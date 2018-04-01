export default {
  computed: {
    $privileged () {
      let uid = this.$store.state.uids.find(e => e.id === this.$route.params.id)
      return uid !== undefined && uid.privileged
    },
    $canedit () {
      return this.$store.state.uid === this.$route.params.id || this.$privileged
    },
    $validuser () {
      return this.$store.state.uids.some(e => e.id === this.$route.params.id)
    }
  }
}
