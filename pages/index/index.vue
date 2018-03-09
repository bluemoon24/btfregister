<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-btn color="white" dark outline flat slot="activator">Send link again</v-btn>
      <v-card v-if="dialogStep === 0">
        <v-card-title>
          <span class="headline">Enter your registered name or email address</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-layout>
              <v-flex xs12 sm12 md12>
                <v-text-field label="name or email" v-model="name" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click.native="lookupName">Lookup</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else-if="dialogStep === 1" align-center>
        <v-card-title>Trying to find you ...</v-card-title>
        <v-card-text>
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-card-text>
      </v-card>
      <v-card v-else-if="dialogStep === 2">
        <v-card-text>
          <p>
          We have sent the link to your email address.
          </p>
          Thanks for your working with us.
        </v-card-text>
        <v-card-actions>
        <v-btn color="blue darken-1" flat @click.native="dialog=false;dialogStep=0">Close</v-btn>
      </v-card-actions>
      </v-card>
      <v-card v-else-if="dialogStep === 3">
        <v-card-text>
          <p>
          Sorry, but we couldn't find "{{ name }}" in our database or couldn't send the email.
          </p>
          Make sure you entered your data correctly or <a href='mailto:info@tangofestival-bonn.de'>contact</a> us.
        </v-card-text>
        <v-card-actions>
        <v-btn color="blue darken-1" flat @click.native="dialog=false;dialogStep=0">Cancel</v-btn>
        <v-btn color="blue darken-1" flat @click.native="dialogStep=0">Try again</v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  // import axios from 'axios'
  import { HTTP } from '~/store/index'

  export default {
    data: () => {
      return {
        dialog: false,
        dialogStep: 0,
        name: ''
      }
    },
    methods: {
      lookupName: async function () {
        this.dialogStep = 1
        var name = this.name
        // const { data } = await axios.get('http://vip-registration.tangofestival-bonn.de/service/resend/' + name)
        const { data } = await HTTP.get('resend/' + name)
        console.log('found?', data)
        this.dialogStep = (data ? 2 : 3)
        // this.$store.dispatch('resendLink', this.name)
      }
    }
  }
</script>

<style scoped>

</style>
