<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div v-if="$route.params.id">
        Welcome back, {{ udata.name.tdata }}
      </div>
      <div v-else>
      <h2 style="text-align: center;">Welcome to our VIP registration and information page for the Tango Festival Bonn.</h2>
      <v-list>
        <template>
          <h2>Upcoming festival</h2>
          <br>Date: 2018-04-27 to 2018-05-01
          <br>Locations: St Adelheid (Milongas), Brotfabrik (Workshops)
          <br>Organizers: Susanne Illini, Harald Rotter, Lothar Burow
          <br>Email: <a href='mailto:info@tangofestival-bonn.de'>info@tangofestival-bonn.de</a>
        </template>
      </v-list>
        Please use your personal link to access your information.
      <nuxt-child />

      <!-- <q-btn @click="$router.push('resendId')">Resend my ID</q-btn> -->
      <p>
        If you are an artists (dancer, musician, dj) and interested to apply for an engagement at our festival,
        please <a href='mailto:info@tangofestival-bonn.de'>contact</a> us.
      </p>

    </div>
    </v-flex>
  </v-layout>
</template>
<script>
</script>
<style lang='stylus' scoped>
a
  color: white

</style>
