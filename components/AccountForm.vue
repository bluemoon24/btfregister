<template>
  <div id='regform1'>
    <v-form v-model="valid">
      {{ role.text }}
      <v-radio-group v-model="role.text" :label="role.label" :rules="[rules.required]" @change="update">
        <v-layout wrap>
          <v-flex xs4 md3 v-for="o in role.options" :key="o.value">
            <v-radio :label="o.text" :value="o.value" ></v-radio>
          </v-flex>
        </v-layout>
      </v-radio-group>

      <v-text-field v-for="(f, k) in group" :key="k"
        :placeholder="f.placeholder"
        :label="f.label"
        :type="f.type"
        :prefix="f.prefix || ''"
        :textarea="f.type === 'textarea'"
        :rules="validationRule(k)"
        v-model="f.text"
        @change="update"
        editable
      />
    </v-form>
    <div v-if="showActions">
    <v-btn :disabled="!valid" color="primary" @click="submit" flat nuxt >submit</v-btn>
    <!-- <v-btn color="primary" @click="submit" flat nuxt >submit</v-btn> -->
  </div>
  </div>
</template>

<script>
import { Group } from '~/components/Classes.js'
export default {
  name: 'account-form',
  props: {
    vip: {
      type: Object
    },
    showActions: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      valid: false,
      group: {
        name: {
          text: '',
          label: 'publicly known artist name',
          placeholder: 'Músicadanza Tango Group',
          type: 'text'
        },
        email: {
          text: '',
          label: 'email',
          placeholder: 'info@somewhere.com',
          type: 'email'
        },
        mobile: {
          text: '',
          label: 'mobile (incl country code (+))',
          placeholder: '54 111 222222',
          type: 'tel',
          prefix: '+'
        },
        postaladdress: {
          text: '',
          label: 'postal address (as if printed on an envelope)',
          placeholder: 'Carlos Otros \n' +
          'Av. Jujuy 777 \n' +
          'C1083AAN CABA \n' +
          'Argentina',
          type: 'textarea'
        },
        url: {
          text: '',
          label: "group's official website",
          placeholder: 'http://our-web-site.com',
          type: 'url'
        },
        comments: {
          text: '',
          label: 'comments',
          placeholder: 'anything...',
          type: 'textarea'
        }
      },
      role: {
        text: 'other',
        label: 'role',
        options: [
          { text: 'musician', value: 'musician' },
          { text: 'dancer', value: 'dancer' },
          { text: 'DJ(ane)', value: 'dj' },
          { text: 'taxi', value: 'taxi' },
          { text: 'other', value: 'other' }
        ]
      },
      rules: {
        required: (value) => !!value || 'Required.',
        email: (value) => {
          const pattern = /^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        phone: (value) => {
          return /^\d?(\d+\s?)*$/.test(value) || 'Invalid number'
        },
        url: (value) => {
          return /^$|^https?:\/\//.test(value) || 'url must start with http:// or https://'
        }
      }
    }
  },
  async fetch ({ store, params, redirect }) {
    // note: mixins not yet available
    // console.log('account form fetch UID', this.vip.id)
    // if (!store.state.uids.some(e => e.id === params.id)) return redirect('/')
    // await store.dispatch('getUserData', this.vip.id)
  },
  watch: {
    'vip': function () {
      console.log('vip watcher', this.vip)
      this.updateGroup()
    }
  },
  mounted: function () {
    // console.log('mounted', this.vip ? this.vip.id : 'no vip')
    // if (!this.vip) return
    this.updateGroup()
  },
  methods: {
    getUserData: async function () {
      if (!this.vip) return
      await this.$store.dispatch('getUserData', this.vip.id)
      console.log('getUserData', this.vip.id, this.$store.state.udata)
      // this.update()
    },
    updateGroup: function () {
      console.log('account:update', this.vip)

      // let group = this.vip.id ? this.$store.state.udata : new Group(this.$store.state.udata)
      for (var k in this.vip) {
        if (!this.group[k]) continue
        this.group[k].text = this.vip[k]
      }
      // this.role.text = this.$store.state.udata.role.tdata
      this.role.text = (this.role.options.some((v) => (v.value === this.vip.role))
        ? this.vip.role : '')
    },

    update: function () {
      // let group = this.vip.id ? this.$store.state.udata : new Group(this.$store.state.udata)
      for (var k in this.group) {
        console.log('account:update', k, this.group[k], this.vip.hasOwnProperty(k))
        if (!this.vip || !this.vip.hasOwnProperty(k)) continue
        this.vip[k] = this.group[k].text
      }
      this.vip.role = this.role.text
      this.$emit('update:vip', this.vip)
    },
    validationRule: function (k) {
      // switch (k) {
      //   case 'email': return [this.rules.email]
      //   case 'mobile': return [this.rules.phone]
      //   case 'url': return [this.rules.url]
      // }
      return []
    },
    submit: function () {
      console.log('submit form')
      let data = {}
      for (let k in this.group) {
        data[k] = this.group[k].text
      }
      let group = new Group(data)
      // for (var k in this.group) {
      //   obj[k] = this.group[k].text
      // }
      group['role'] = this.role.text
      group['id'] = this.vip.id // !== '0' ? this.uid : Util.createUid(this.uids)
      // if (!group.members) group.members = '[]'
      console.log('submit form', group)
      if (this.vip.id) this.$store.dispatch('updateGroup', group)
      else console.log('AccountForm.submit: No vip.id')
    }
  }
}
</script>

<style lang="stylus" scoped>

#regform1
margin 5vw 5vw
  text-align left

</style>
