<template>
  <div>
    <v-layout>
      <v-form v-model="valid">
        <!-- {{ person }} -->
        <div v-for="(f, k) in person" :key="k">
          <v-text-field v-if="!!controls[k] && controls[k].type === 'text' && (k !== 'instrument' || role === 'musician')"
            :placeholder="controls[k].placeholder"
            :label="controls[k].label"
            :type="controls[k].type"
            :prefix="controls[k].prefix || ''"
            :rules="validationRule(k)"
            :multi-line="controls[k].type === 'textarea'"
            v-model="person[k]"
            editable
          />
          <v-checkbox v-if="!!controls[k] && controls[k].type === 'checkbox'"
            :label="controls[k].label"
            :type="controls[k].type"
            v-model="person[k]"
            @change="changeEvent"
            
          />
        </div>
      </v-form>
    </v-layout>
  </div>
</template>

<script>
  // @change="changeEvent"
  // @change="$emit('managerChanged')"
  import { Person } from '~/components/Classes.js'

  export default {
    name: 'person-form',
    props: {
      person: {
        type: Person
      },
      role: {
        type: String
      },
      manager: {
        type: Boolean
      }
    },
    data: () => {
      return {
        selectedIndex: -1,
        valid: false,
        controls: {
          name: {
            label: 'Name',
            placeholder: 'Firstname Lastname',
            rules: 'required',
            type: 'text'
          },
          isManager: {
            label: 'is manager',
            placeholder: 'Manager',
            type: 'checkbox'
          },
          mobile: {
            label: 'Mobile phone',
            placeholder: '54 111 222222',
            type: 'text',
            rules: 'phone',
            prefix: '+'
          },
          instrument: {
            label: 'Instrument you play',
            placeholder: 'Bandoneon',
            type: 'text'
          },
          allergies: {
            label: 'Allergies/food constraints',
            placeholder: 'Gluten, Lactose, Nuts, ...',
            type: 'text'
          }
        },
        rules: {
          required: (value) => !!value || 'Required.',
          phone: (value) => {
            return /(\d+\s?)*$/.test(value) || 'Invalid number'
          }
        }
      }
    },
    watch: {
      person: {
        handler: function (val, oldVal) {
          console.log('PersonForm:update', val, oldVal)
          // this.person.isManager = val.isManager
          // this.isManager = this.manager
        },
        deep: true
      }
      // 'person': 'update'
    },
    computed: {
      // isManager: {
      //   get: () => (this.manager),
      //   set: function () {
      //     console.log('isManager setter')
      //     this.$emit('update:manager', this.person.isManager)
      //   }
      // }
    },
    methods: {
      clickHandler: function (val) {
        console.log('clickHandler', val)
        // this.$emit('input', val)
      },
      update: function () {
        console.log('PersonForm:update', this.manager)
        this.isManager = this.manager
      },
      validationRule: function (k) {
        switch (k) {
          case 'name': return [this.rules.required]
          case 'mobile': return [this.rules.phone]
          default: return []
        }
      },
      changeEvent: function (newval) {
        console.log('changeEvent', this.person, newval)
        this.$emit('managerChanged', this.person.id, newval)
      }
    }
  }
</script>

<style scoped>

</style>
