<template>
  <div id='regform1'>
    <v-form v-model="valid">
      <v-radio-group v-model="role.text" :label="role.label" :rules="[rules.required]">
        <v-layout wrap>
          <v-flex xs4 md3>
            <v-radio label="musician" value="musician" ></v-radio>
          </v-flex>
          <v-flex xs4 md3>
            <v-radio label="dancer" value="dancer"></v-radio>
          </v-flex>
          <v-flex xs4 md3>
            <v-radio label="DJ" value="dj"></v-radio>
          </v-flex>
          <v-flex xs4 md3>
            <v-radio label="other" value="other"></v-radio>
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
      editable dark clearable
      />
    </v-form>
    <v-btn :disabled="!valid" color="primary" @click="submit" flat nuxt >Continue</v-btn>
  </div>
</template>

<script>

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
        }
      },
      role: {
        text: '',
        label: 'role'
      },
      rules: {
        required: (value) => !!value || 'Required.',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        phone: (value) => {
          return /^\d(\d+\s?)+$/.test(value) || 'Invalid number'
        },
        url: (value) => {
          return /^$|^https?:\/\//.test(value) || 'url must start with http:// or https://'
        }
      }
    }
  },
  async fetch ({ store, params, redirect }) {
    if (!store.state.privileged) return redirect('/')
    // return redirect('/regwizard')
  },
  methods: {
    validationRule: function (k) {
      switch (k) {
        case 'email': return [this.rules.required, this.rules.email]
        case 'mobile': return [this.rules.required, this.rules.phone]
        case 'url': return [this.rules.url]
        default: return [this.rules.required]
      }
    },
    // selectit: function (item) {
    //   console.log('select', item)
    //   return true
    // },
    // selectInput: function (e) {
    //   console.log('selectInput', e, 'end selectInput')
    // },
    // remove: function (item) {
    //   console.log('items', this.group.members.text)
    //   this.group.members.text.splice(this.group.members.text.indexOf(item), 1)
    //   this.group.members.text = [...this.group.members.text]
    // },
    // addMember: function (e) {
    //   this.group.members.text.push(this.member)
    //   this.member = ''
    //   console.log('clickHandler', e, this.member)
    // },
    // addManager: function (e) {
    //   this.group.members.text.push(this.manager)
    //   this.manager = ''
    // },
    // clickHandler: function (e) {
    //   this.group.members.text.push(this.member)
    //   this.member = ''
    //   console.log('clickHandler', e, this.member)
    // },
    // managerInputHandler: function () {
    //   this.group.member.text[0] = this.group.manager.text
    // },
    submit: function () {
      console.log('submit form')
      var obj = {}
      for (var k in this.group) {
        obj[k] = this.group[k].text
      }
      obj['role'] = this.role.text
      console.log('submit form', obj)
      this.$store.dispatch('createArtist', obj)
    }
  }
}
</script>

<style lang="stylus" scoped>

#regform1
margin 5vw 5vw
  text-align left

</style>
