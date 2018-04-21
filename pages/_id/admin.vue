<template>
  <div>
    <!-- <v-btn color="primary" class="mb-2" nuxt @click="getNewRoute()">New</v-btn> -->
    <v-dialog v-model="dialog" max-width="800px">
      <v-btn color="primary" slot="activator" class="mb-2">New VIP</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <account-form :vip.sync="editedItem"></account-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="taxid" max-width="800px" width="800px">
      <v-btn color="primary" slot="activator" class="mb-2">Taxi list</v-btn>
      <v-card>
        <v-btn @click="copyToClipboard">Copy</v-btn>
        <v-card-text>
        <textarea ref='taxilist' style='width:100%; height:600px;'>
          {{ taxilist }}
        </textarea>
      </v-card-text>
      </v-card>
    </v-dialog>

    <v-data-table
      :headers="headers"
      :items="list"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td><a :href="'../' + props.item.id + '/account'">{{ props.item.id }}</a></td>
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.role }}</td>
        <td><a :href="'mailto:' + props.item.email">{{ props.item.email }}</a></td>
        <td>{{ props.item.mobile }}</td>
        <td class="justify-center layout px-0">
          <v-btn icon class="mx-0" nuxt @click="$router.push('/' + props.item.id + '/eventinfo')">
          <!-- <v-btn icon class="mx-0" nuxt :to="'/' + props.item.id + '/eventinfo'"> -->
            <v-icon color="teal">timeline</v-icon>
          </v-btn>
          <v-btn icon class="mx-0" @click="editItem(props.item)">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn icon class="mx-0" @click="deleteItem(props.item)">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import AccountForm from '~/components/AccountForm.vue'
  import { Group, Util } from '~/components/Classes.js'

  export default {
    components: {
      AccountForm
    },
    async fetch ({ store, params, redirect, app }) {
      await store.dispatch('getUserData', params.id)
      if (!store.state.privileged) {
        return redirect('/' + params.id)
      } else {
        store.dispatch('setRealUser', params.id)
        store.dispatch('getEventinfoData')
      }
    },

    data: () => ({
      dialog: false,
      taxid: false,
      headers: [
        {
          text: 'ID',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        { text: 'Name', value: 'name' },
        { text: 'Role', value: 'role' },
        { text: 'Email', value: 'email' },
        { text: 'Mobile', value: 'mobile' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      items: [],
      editedIndex: -1,
      editedItem: new Group()
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
      taxilist: function () {
        let table = this.$store.state.eventinfoData.filter(e => e.type === 'tnt')
          .map(el => (`${el.starts.replace(' ', '\t ')}\t ${el.location.name}\t ${el.location.address.replace(/\n/g, ', ')}\t` +
          `${el.targetloc.name}\t ${el.targetloc.address.replace(/\n/g, ', ')}\t` +
          `${el.involved.filter(e => (e.role !== 'other')).map(e => e.name).join(', ')}`))
        // table.unshift('Date\t Time\t From\t Address\t To\t Address\t Who')
        return table.join('\n')
      },
      list: function () {
        console.log('list function computed')
        return this.$store.state.uids
        // if (this.newgroup) st = st.concat([this.newgroup])
        // return st.map((m) => ({ item: m, header: m.name, icon: null }))
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      vip (val) {
        console.log('vip watcher')
      }
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        this.items = [
        ]
      },

      copyToClipboard: function () {
        console.log('copyToClipboard', this.$refs.taxilist)
        // var copyText = document.getElementById("myInput");

        /* Select the text field */
        this.$refs.taxilist.select()

        /* Copy the text inside the text field */
        document.execCommand('Copy')
        // document.selection.empty()
        this.taxid = false
      },
      vipChanged: function (e) {
        console.log('vip changed', e, this.$event)
      },

      getNewRoute: function () {
        let nuid = Util.createUid(this.$store.state.uids)
        console.log('new path:', `/${nuid}/account`)
        this.$router.push({ path: `/${nuid}/account` })
      },

      async editItem (item) {
        await this.$store.dispatch('getUserData', item.id)
        this.editedIndex = this.list.indexOf(item)
        this.editedItem = new Group(this.$store.state.udata)
        console.log('editItem 1', item.id, this.$store.state.udata, this.editedItem)
        this.dialog = true
      },

      deleteItem (item) {
        // const index = this.items.indexOf(item)
        console.log('delete Item', item.name, item.id)
        if (confirm('Are you sure you want to delete this item?')) {
          // this.items.splice(index, 1)
          this.$store.dispatch('deleteGroup', item.id)
        }
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = new Group()
          this.editedIndex = -1
        }, 300)
      },

      save () {
        // console.log('dispatch', this.editedIndex, this.editedItem)
        if (this.editedIndex > -1) {
          console.log('dispatch', this.editedItem)
          this.$store.dispatch('updateGroup', new Group(this.editedItem))
          // Object.assign(this.items[this.editedIndex], this.editedItem)
        } else {
          // this.items.push(this.editedItem)
          this.editedItem.id = Util.createUid(this.$store.state.uids)
          // this.newItem = new Group(this.editedItem)
          let g = new Group(this.editedItem)
          console.log('dispatched new', g)
          this.$store.dispatch('updateGroup', g)
        }
        this.close()
      }
    }
  }
</script>
