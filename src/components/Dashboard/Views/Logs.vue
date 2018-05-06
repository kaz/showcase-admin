<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <paper-table type="hover" :title="tableTitle || 'Deployments'" :subTitle="tableTitle ? 'Filtered list' : ''" :data="data" :columns="columns" />
      </div>
    </div>
  </div>
</template>
<script>
  import Notifier from 'components/Dashboard/mixin_notifier.js'
  import PaperTable from 'components/UIComponents/PaperTable.vue'

  import {statusColor, API} from 'src/showcase'

  export default {
    mixins: [
      Notifier
    ],
    components: {
      PaperTable
    },
    data () {
      return {
        logs: [],
        columns: ['Datetime', 'App', 'Result', 'View'],
        timer: null
      }
    },
    computed: {
      tableTitle () {
        const {repo, ref} = this.$route.query
        if (!repo || !ref) {
          return null
        }
        return `${repo} (${ref})`
      },
      filtered () {
        const {repo, ref} = this.$route.query
        if (!repo || !ref) {
          return this.logs
        }
        return this.logs.filter(log => log.repo === repo && log.branch === ref)
      },
      data () {
        return this.filtered.map(log => [
          {
            value: new Date(log.created).toLocaleString()
          },
          {
            value: `${log.repo} (${log.branch})`,
            icon: 'ti-server',
            routing: {
              path: '/manage',
              query: {
                repo: log.repo,
                ref: log.branch
              }
            }
          },
          {
            value: log.status,
            badge: statusColor('badge', log.status)
          }, {
            value: 'View log',
            routing: {
              path: `/view/${log._id}`
            },
            linkTag: 'button',
            linkClass: 'btn'
          }
        ])
      }
    },
    beforeDestroy () {
      clearInterval(this.timer)
    },
    created () {
      this.timer = setInterval(this.getData, 32768)
      this.getData()
    },
    methods: {
      async getData () {
        const [ok, raw] = await API('log', sessionStorage.admin ? {all: 1} : {})
        if (!ok) {
          return this.notifyRemoteError(raw)
        }
        this.logs = raw.reverse()
      }
    }
  }
</script>
<style>
</style>
