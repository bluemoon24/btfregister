<template>
  <div id='regform1' class="layout-padding">
        <q-field v-for="(f, k) in group" :helper="f.helper" :class="k">
          <q-option-group
          v-if="k === 'role'"
          inline
          type="radio"
          v-model="f.text"
          :options="[
            { label: 'musician', value: 'musician' },
            { label: 'dancer', value: 'dancer' },
            { label: 'DJ', value: 'dj' },
            { label: 'other', value: 'other' }
          ]"
          v-on:input="$v.group[k].$touch"
          v-bind:class="{error: $v.group[k].$error, valid: $v.group[k].$dirty && !$v.group[k].$invalid}"
          />

          <q-chips-input
          v-else-if="k === 'members'"
          v-model='f.text'
          color='secondary'
          :placeholder="'list of group members'"
          v-on:input="$v.group[k].$touch"
          v-bind:class="{error: $v.group[k].$error, valid: $v.group[k].$dirty && !$v.group[k].$invalid}"
          />

          <q-input
          v-else-if="k === 'manager'"
          v-model="f.text"
          :placeholder="f.placeholder"
          :type="f.type"
          clearable
          v-on:input="$v.group[k].$touch"
          v-bind:class="{error: $v.group[k].$error, valid: $v.group[k].$dirty && !$v.group[k].$invalid}"
          />

          <q-input
          v-else
          v-model="f.text"
          :prefix="k == 'mobile' ? '+' : '' "
          :placeholder="f.placeholder"
          :type="f.type"
          clearable
          v-on:input="$v.group[k].$touch"
          v-bind:class="{error: $v.group[k].$error, valid: $v.group[k].$dirty && !$v.group[k].$invalid}"
          />

        </q-field>
        <q-btn @click='submit' :disabled="$v.group.$invalid">Submit</q-btn>
</div>
</template>

<script>
import { required, email, maxLength, minLength } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      valid: false,
      group: {
        name: {
          text: '',
          helper: 'publicly known artist name',
          placeholder: 'e.g. Músicadanza Tango Group',
          type: 'text'
        },
        manager: {
          text: '',
          helper: 'manager (required)',
          placeholder: 'e.g. Carlos di Sarli',
          type: 'text'
        },
        email: {
          text: '',
          helper: 'email',
          placeholder: 'info@somewhere.com',
          type: 'email'
        },
        mobile: {
          text: '',
          helper: 'mobile (incl country code (+))',
          placeholder: '+54 111 222222',
          type: 'tel'
        },
        postaladdress: {
          text: '',
          helper: 'postal address (as if printed on an envelope)',
          placeholder: 'Carlos Otros\nAv. Jujuy 777\nC1083AAN CABA\nArgentina',
          type: 'textarea'
        },
        role: { text: '', helper: 'role', placeholder: '', type: 'text' },
        members: {
          text: [],
          helper:
            'type  member names, include manager (press enter after each name)',
          placeholder: 'Carlos di Sarli',
          type: 'text'
        }
      }
    }
  },
  mounted: function () {
    this.$v.group.$touch()
  },
  methods: {
    managerInputHandler: function () {
      this.group.member.text[0] = this.group.manager.text
      this.$v.group.manager.$touch()
    },
    submit: function () {
      if (!this.$v.group.$invalid) {
        for (var k in this.group) {
          if (this.$v.group[k].$invalid) console.log(k, ' is invalid')
          console.log('params', this.$v.group[k].$params)
        }
      }
      else {
        console.log('isarry', this.group.members.text)
        if (this.group.members.text.indexOf(this.group.manager.text) < 0) {
          this.group.members.text.push(this.group.manager.text)
        }
        console.log('submit it', this.$v.group.$invalid)
      }
    }
  },
  validations: {
    group: {
      email: {
        text: { required, email }
      },
      name: {
        text: { required, maxLength: maxLength(40) }
      },
      manager: {
        text: { required, maxLength: maxLength(40) }
      },
      members: {
        text: { required }
      },
      mobile: {
        text: { required, minLength: minLength(8) }
      },
      postaladdress: {
        text: { required }
      },
      role: {
        text: { required }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~variables'

#regform1
margin 5vw 5vw
  text-align left

  .postaladdress
    textarea
      height 6em
      font-size smaller

.error
  border-width: 1px
  border-style: solid
  border-radius: 5px
  border-color: red

.error:focus
  outline-color: #F99

.valid
  border-width: 1px
  border-style: solid
  border-radius: 5px
  border-color: $green

.valid:focus
  outline-color: #8E8

</style>
