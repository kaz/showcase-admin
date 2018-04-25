export default {
  methods: {
    __notify (type, face, title, msg) {
      this.$notifications.notify({
        type,
        icon: `ti-face-${face}`,
        message: `[${title}]<br>${msg}`,
        verticalAlign: 'top',
        horizontalAlign: 'right'
      })
    },
    notifyLocalError (msg) {
      this.__notify('danger', 'sad', 'An error occurred', msg)
    },
    notifyRemoteError (msg) {
      this.__notify('danger', 'sad', 'Showcase returns error', msg)
    },
    notifyPassed (msg) {
      this.__notify('info', 'smile', 'Showcase says', msg)
    }
  }
}
