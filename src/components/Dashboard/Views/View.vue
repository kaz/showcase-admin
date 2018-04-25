<template>
  <div class="row" v-if="log">
    <div class="col-md-12">
      <div class="card">
        <div class="header">
          <h3>{{log.repo}} <small>({{log.branch}})</small></h3>
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

  import {statusColor, API} from 'src/showcase'

  export default {
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
      badgeClass () {
        return statusColor('badge', this.log.status)
      }
    },
    created () {
      this.getData()
    },
    methods: {
      emitError (msg) {
        this.$notifications.notify({
          message: `[Showcase returns error]<br>${msg}`,
          icon: 'ti-face-sad',
          type: 'danger',
          verticalAlign: 'top',
          horizontalAlign: 'right'
        })
      },
      async getData () {
        const [ok, raw] = await API('log', {id: this.id})
        if (!ok) {
          return this.emitError(raw)
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
