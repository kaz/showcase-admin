<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <paper-table :data="data" :columns="columns" />
      </div>
    </div>
  </div>
</template>
<script>
  import PaperTable from 'components/UIComponents/PaperTable.vue'

  import {GIT_URL, statusBadge, printPort, printHostname, API} from 'src/showcase'

  export default {
    components: {
      PaperTable
    },
    props: {
      scope: String
    },
    data () {
      return {
        data: [],
        timer: null
      }
    },
    computed: {
      columns () {
        return ['Repository', 'Branch', 'Status', 'Port', 'Link', this.scope === 'my' ? 'Manage' : 'Config']
      }
    },
    beforeDestroy () {
      clearInterval(this.timer)
    },
    created () {
      this.timer = setInterval(this.getData, 30 * 1000)
      this.getData()
    },
    watch: {
      scope () {
        this.getData()
      }
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
        const [ok, raw] = await API('apps', {scope: this.scope})
        if (!ok) {
          return this.emitError(raw)
        }
        this.data = raw.map(app => [
          {
            value: app.repo,
            link: `${GIT_URL}/${app.repo}/`,
            icon: 'ti-cloud'
          },
          {
            value: app.branch,
            link: `${GIT_URL}/${app.repo}/src/branch/${app.branch}/`
          },
          {
            value: app.status,
            badge: statusBadge(app.status)
          },
          {
            value: printPort(app.config.expose)
          },
          app.config.type === 'static' || app.config.http_proxy ? {
            value: 'Open',
            link: `http://${printHostname(app)}`,
            icon: 'ti-new-window'
          } : {
            value: '-'
          },
          this.scope === 'my' ? {
            value: 'Manage this app',
            routerLink: {
              path: '/manage',
              query: {
                repo: app.repo,
                ref: app.branch
              }
            }
          } : {
            value: 'showcase.yaml',
            link: `${GIT_URL}/${app.repo}/src/branch/${app.branch}/showcase.yaml`,
            icon: 'ti-settings'
          }
        ])
      }
    }
  }
</script>
<style>
</style>
