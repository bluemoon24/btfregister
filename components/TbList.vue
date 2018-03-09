<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer/>
      <v-toolbar-side-icon @click="addItem">
        <v-icon>{{ add_icon }}</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-side-icon @click="deleteItem" :disabled="selectedIndex < 0">
        <v-icon>delete</v-icon>
      </v-toolbar-side-icon>
    </v-toolbar>
    <v-expansion-panel >
      <v-expansion-panel-content v-for="(l, i) in list" :key="i" v-model="selections[i]">
        <div slot="header">{{ l.header }}
          <v-icon v-if="l.icon">{{ l.icon }}</v-icon>
        </div>
        <v-card >
          <v-card-text>
            <slot :index="i"></slot>
          </v-card-text>
        </v-card>
        <v-toolbar color='grey darken-3'>
          <v-card-actions v-for="a in actions" :key="a.id">
            <v-btn color="primary" flat nuxt @click="handleAction(l, a)">{{ a.label }}</v-btn>
          </v-card-actions>
        </v-toolbar>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>
  import { Tbevent } from '~/components/Classes.js'
  // import { TbListContent } from '~/components/TbListContent.vue'

  export default {
    props: ['list', 'title', 'add_icon', 'actions'],
    name: 'tb-list',
    // computed: {,
    //   elist = list.map((e) => (e['selected']))
    // },
    data: () => {
      return {
        selectedIndex: -1,
        selections: []
      }
    },
    components: {
    },
    mounted: function () {
      // this.selections = Array.from(this.list, () => (false))
      // console.log('TbList mounted')
    },
    watch: {
      'selections': {
        handler: function (val, oldVal) {
          this.selectedIndex = val.findIndex((e) => (e))
          console.log('selections handler', this.selectedIndex)
          this.$emit('tblistevent', new Tbevent('selected', this.selectedIndex))
        }
        // deep: true
      }
    },
    methods: {
      handleAction: function (l, a) {
        console.log('*** action', a, this.selectedIndex, this.selections)
        if (a.close) console.log('closing', this.selections[this.selectedIndex])
        if (a.close) this.selections[this.selectedIndex] = false
        this.$emit('tblistevent', new Tbevent('action', { item: l.item, action: a.id }))
      },
      addItem: function () {
        this.$emit('tblistevent', new Tbevent('add', -1))
      },
      deleteItem: function () {
        this.$emit('tblistevent', new Tbevent('delete', this.selectedIndex))
      }
    }
  }
</script>

<style scoped>

</style>
