<template>
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" :class="{toggled: $sidebar.showSidebar}" @click="toggleSidebar">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar bar1"></span>
          <span class="icon-bar bar2"></span>
          <span class="icon-bar bar3"></span>
        </button>
        <a class="navbar-brand">{{routeName}}</a>
        <a class="navbar-brand" style="color:red" v-if="isAdmin">(admin-mode)</a>
      </div>
      <div class="collapse navbar-collapse">
        <ul class="nav navbar-nav navbar-right">
          <li><img class="user-icon" :src="`https://q.trapti.tech/static/icon/${me}/64.png`"></li>
          <drop-down :title="me">
            <li><a target="_blank" href="https://git.trapti.tech/user/settings/keys">Manage SSH keys (traP git)</a></li>
            <li><a href="#" @click="syncKey">Sync SSH keys (with traP git)</a></li>
          </drop-down>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
  import Notifier from 'components/Dashboard/mixin_notifier.js'
  import {API} from 'src/showcase'

  export default {
    mixins: [
      Notifier
    ],
    computed: {
      routeName () {
        const {name} = this.$route
        return this.capitalizeFirstLetter(name)
      },
      isAdmin () {
        return sessionStorage.admin
      }
    },
    data () {
      return {
        me: null,
        activeNotifications: false
      }
    },
    async created () {
      const [ok, raw] = await API('whoami', {})
      if (!ok) {
        return this.notifyRemoteError(raw)
      }
      this.me = raw
    },
    methods: {
      capitalizeFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      toggleNotificationDropDown () {
        this.activeNotifications = !this.activeNotifications
      },
      closeDropDown () {
        this.activeNotifications = false
      },
      toggleSidebar () {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
      },
      hideSidebar () {
        this.$sidebar.displaySidebar(false)
      },
      async syncKey () {
        const [ok, raw] = await API('key', {})
        if (!ok) {
          return this.notifyRemoteError(raw)
        }
        this.notifyPassed(raw)
      }
    }
  }

</script>
<style scoped>
  .user-icon {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    margin: 18px 9px;
  }
</style>
