<template>
  <div class="row" v-if="log">
    <div class="col-md-12">
      <div class="card">
        <div class="header">
          <h3>
            Deploy:
            <router-link :to="link">
              <i class="ti-server"></i>
              {{log.repo}}
            </router-link>
            <small>({{log.branch}})</small>
          </h3>
          <hr>
          <p>
            <span class="badge" :class="badgeClass">{{log.status}}</span>
            at {{new Date(log.created).toLocaleString()}}
          </p>
          <hr>
        </div>
        <div class="content">
          <shell :value="log.log" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Shell from 'components/UIComponents/Shell.vue'
  import Notifier from 'components/Dashboard/mixin_notifier.js'

  import {statusColor, API} from 'src/showcase'

  export default {
    mixins: [
      Notifier
    ],
    components: {
      Shell
    },
    props: {
      id: String
    },
    data () {
      return {
        log: null
      }
    },
    computed: {
      link () {
        return {
          path: '/manage',
          query: {
            repo: this.log.repo,
            ref: this.log.branch
          }
        }
      },
      badgeClass () {
        return statusColor('badge', this.log.status)
      }
    },
    created () {
      this.getData()
    },
    methods: {
      async getData () {
        const [ok, raw] = await API('log', {id: this.id})
        if (!ok) {
          return this.notifyRemoteError(raw)
        }
        this.log = raw
      }
    }
  }
</script>
<style scoped>
  small {
    font-size: .8em;
  }
  h3 {
    margin: 0;
  }
</style>
