<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer/>
      <v-text-field v-if="showfilter"
        prepend-icon="filter_list"
        label="Filter"
        solo
        flat clearable lazy
        @input="$emit('update:filter', myfilter)"
        v-model="myfilter"
        >
      </v-text-field>
      <!-- <v-spacer/> -->
      <v-toolbar-side-icon @click="addItem">
        <v-icon>{{ add_icon }}</v-icon>
      </v-toolbar-side-icon>

      <v-dialog v-model="dialog" persistent max-width="290">
        <v-toolbar-side-icon  slot="activator" :disabled="selectedIndex < 0">
          <v-icon>delete</v-icon>
        </v-toolbar-side-icon>
         <v-card>
           <v-card-title class="headline">Confirm delete</v-card-title>
           <v-card-actions>
             <v-spacer></v-spacer>
             <v-btn flat @click.native="dialog = false">Cancel</v-btn>
             <v-btn flat @click="dialog = false; deleteItem()">Delete</v-btn>
           </v-card-actions>
         </v-card>
       </v-dialog>
    </v-toolbar>
    <v-expansion-panel popout>
      <v-expansion-panel-content v-for="(l, i) in list" :key="i" v-model="selections[i]">
        <div slot="header">{{ l.header }}
          <v-icon v-if="l.icon">{{ l.icon }}</v-icon>
        </div>
        <v-card >
          <v-card-text>
            <slot :index="i"></slot>
          </v-card-text>
        </v-card>
        <v-toolbar >
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
    props: ['list', 'title', 'add_icon', 'actions', 'filter', 'showfilter'],
    name: 'tb-list',
    // computed: {,
    //   elist = list.map((e) => (e['selected']))
    // },
    data: () => {
      return {
        dialog: false,
        selectedIndex: -1,
        myfilter: this.filter,
        selections: []
      }
    },
    components: {
    },
    mounted: function () {
      this.selections = Array.from(this.list, () => (false))
      // console.log('TbList mounted')
    },
    watch: {
      // 'list': {
      //   handler: function () {
      //     this.selections = []
      //     this.selectedIndex = -1
      //   }
      // },
      'selections': {
        handler: function (val, oldVal) {
          console.log('TBList selections handler', val)
          this.selectedIndex = val.findIndex((e) => (e))
          console.log('selections handler', this.selectedIndex)
          this.$emit('tblistevent', new Tbevent('selected', this.selectedIndex))
        }
        // deep: true
      }
    },
    computed: {
      // myfilter: function () {
      //   return this.myfilter
      // }
    },
    methods: {
      updateFilter: function (newval) {
        // console.log('*************************** update filter', this.myfilter, newval)
        // this.$emit('update:filter', this.myfilter)
      },
      handleAction: function (l, a) {
        console.log('*** action', a, this.selectedIndex, this.selections)
        this.$emit('tblistevent', new Tbevent('action', { item: l.item, action: a.id }))
        if (a.close) {
          console.log('closing selection', this.selectedIndex)
          this.selections[this.selectedIndex] = false
          this.selectedIndex = -1
        }
      },
      addItem: function () {
        this.$emit('tblistevent', new Tbevent('add', -1))
      },
      deleteItem: function () {
        this.$emit('tblistevent', new Tbevent('delete', this.selectedIndex))
        this.selections[this.selectedIndex] = false
        this.selectedIndex = -1
      }
    }
  }
</script>

<style scoped>

</style>
