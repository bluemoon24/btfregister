<template>
  <div>
    <!-- <v-card> -->
    <!-- <v-layout row wrap> -->
      <!-- <v-flex xs12> -->
      <v-card>
        <v-card-title>
          Date selection
        </v-card-title>
        <v-card-text>
          <v-date-picker
            :allowedDates="allowedDates || null"
            v-model="selectedDate"
            no-title
            reactive
            actions>
          </v-date-picker>

        </v-card-text>
      <!-- </v-card> -->
    <!-- </v-flex> -->

    <!-- <v-flex d-flex>
      <v-card>
        <v-card-title>
        Time selection
        </v-card-title>
          <v-card-text class="mt-5">
            <v-flex xs3 >
              <v-select single-line auto :items="timelist" v-model="selectedTime">
              </v-select>
            </v-flex>
        </v-card-text>
      </v-card>
    </v-flex> -->
    <!-- </v-layout> -->
      <v-card-actions>
        <v-btn flat color="primary" flat @click.stop="submit">Ok</v-btn>
        <v-btn flat color="primary" flat @click.stop="reset">Now</v-btn>
        <v-btn flat color="primary" flat @click.stop="cancel">Cancel</v-btn>
      </v-card-actions>

  </v-card>
  </div>
</template>

<script>
  import { Tbevent, Util } from '~/components/Classes.js'
  export default {
    name: 'date-time-picker',
    props: ['allowedDates', 'time', 'date'],
    mounted: function () {
      this.selectedDate = this.date
      this.selectedTime = this.time
      // console.log('mounted DateTimePicker', this.date, this.time)
    },
    watch: {
      'date': 'update',
      'time': 'update'
    },
    methods: {
      roundTime: function (t) {
        if (!t) return null
        let [h, m] = t.split(':')
        m = Math.floor(m / 15) * 15
        m = (m < 9 ? '0' : '') + Number(m)
        h = (h < 9 ? '0' : '') + Number(h)
        return h + ':' + m
      },
      update: function () {
        // console.log('DateTimePicker update', this.date, this.time)
        this.selectedDate = this.date
        this.selectedTime = this.roundTime(this.time)
        // this.submit()
      },
      reset: function () {
        let d = new Date()
        this.selectedDate = Util.formatDateTime(d).date
        this.selectedTime = this.roundTime(d.getHours() + ':' + d.getMinutes())
        // console.log('reset', this.selectedDate)
      },
      cancel: function () {
        this.$emit('datime', new Tbevent('cancel'))
      },
      submit: function () {
        let dtinfo = {
          time: this.selectedTime,
          date: this.selectedDate
        }
        // console.log('DateTimePicker submit', this.date, this.time, this.selectedDate + 'T' + this.selectedTime)
        // let d = new Date(this.selectedDate + 'T' + this.selectedTime)
        dtinfo.datime = this.selectedDate + ' ' + this.selectedTime
        this.$emit('datime', new Tbevent('save', dtinfo))
      }
    },
    computed: {
      timelist: function () {
        let list = []
        for (var h = 0; h < 24; h++) {
          for (var m = 0; m < 60; m += 15) {
            list.push((h > 9 ? '' : '0') + h + (m > 9 ? ':' : ':0') + m)
          }
        }
        return list
      }
    },
    data: () => {
      return {
        selectedDate: '',
        selectedTime: ''
      }
    }
  }
</script>

<style scoped lang='stylus'>
</style>
