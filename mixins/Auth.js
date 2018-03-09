export default {
  computed: {
    $privileged () {
      let uid = this.$store.state.uids.find(e => e.id === this.$route.params.id)
      return uid && uid.privileged
    },
    $canedit () {
      return this.$store.state.uid === this.$route.params.id || this.$privileged
    }

  }
}
