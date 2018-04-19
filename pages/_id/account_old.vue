<template>
  <div id='regform1'>
    <v-form v-model="valid">
      <v-radio-group v-model="role.text" :label="role.label" :rules="[rules.required]">
        <v-layout wrap>

          <v-flex xs4 md3 v-for="o in role.options">
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
        editable
      />
    </v-form>
    <v-btn :disabled="!valid" color="primary" @click="submit" flat nuxt >submit</v-btn>
    <!-- <v-btn color="primary" to="eventinfo" flat nuxt >Event</v-btn> -->
  </div>
</template>

<script>
import { Group, Util } from '~/components/Classes.js'
export default {
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
    console.log('account.vue', store.state.privileged)
    if (!store.state.privileged && !store.state.uids.some(e => e.id === params.id)) return redirect('/')
    await store.dispatch('getUserData', store.state.uid)
  },
  watch: {
    '$store.state.uid': 'update'
  },
  mounted: function () {
    this.update()
  },
  methods: {
    update: function () {
      console.log('account:update', this.$store.state.uid, this.$route.params)
      let group = this.$store.state.uid ? this.$store.state.udata : new Group()
      for (var k in group) {
        if (!this.group[k]) continue
        this.group[k].text = group[k]
      }
      // this.role.text = this.$store.state.udata.role.tdata
      this.role.text = (this.role.options.some((v) => (v.value === group.role))
        ? group.role : '')
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
      group['id'] = this.$store.state.uid !== '0' ? this.$store.state.uid : Util.createUid(this.$store.state.uids)
      // if (!group.members) group.members = '[]'
      console.log('submit form', group)
      this.$store.dispatch('updateGroup', group)
    }
  }
}
</script>

<style lang="stylus" scoped>

#regform1
margin 5vw 5vw
  text-align left

</style>
