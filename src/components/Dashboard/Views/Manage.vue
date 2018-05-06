<template>
  <section v-if="app">
    <div class="row">
      <article class="col-sm-12">
        <stats-card>
          <div class="icon-big text-center icon-warning" slot="header">
            <i class="ti-server"></i>
          </div>
          <div class="numbers" slot="content">
            <p>Source</p>
            {{app.repo}} <small>({{app.branch}})</small>
          </div>
          <div class="stats" slot="footer">
            <a :href="sourceLink" target="_blank">
              <i class="ti-new-window"></i> View in traP git
            </a>
          </div>
        </stats-card>
      </article>
      <article class="col-sm-7">
        <stats-card>
          <div class="icon-big text-center" :class="statusColor" slot="header">
            <i :class="statusIcon"></i>
          </div>
          <div class="numbers capital" slot="content">
            <p>Status</p>
            <span style="text-transform: uppercase">
              {{app.status.Status}}
            </span>
          </div>
          <div class="stats" slot="footer">
            <a v-if="openLink" :href="openLink" target="_blank">
              <i class="ti-new-window"></i> Open application
            </a>
          </div>
        </stats-card>
      </article>
      <article class="col-sm-5">
        <stats-card>
          <div class="icon-big text-center icon-primary" slot="header">
            <i class="ti-cloud-up"></i>
          </div>
          <div class="numbers" slot="content">
            <p>Deployed</p>
            {{app.logs.length}} <small>TIME{{app.logs.length === 1 ? '' : 'S'}}</small>
          </div>
          <div class="stats" slot="footer">
            <router-link :to="{path: '/logs', query: $route.query}">
              <i class="ti-new-window"></i> View deploy logs
            </router-link>
          </div>
        </stats-card>
      </article>
    </div>
    <div class="row">
      <article class="col-sm-4">
        <div class="card">
          <div class="header">
            <h3>Management</h3>
            <hr>
          </div>
          <div class="content actions">
            <label>SSH Access</label>
            <p><code>ssh -p 22 showcase@{{serverHost}}</code></p>
            <p><a target="_blank" href="https://git.trapti.tech/user/settings/keys">SSH key management</a></p>
            <br>
            <label>Deploy</label>
            <button class="btn btn-success" @click="deploy('create')">Trigger deployment</button>
            <button class="btn btn-danger" @click="deploy('remove')">Delete application</button>
            <br><br>
            <template v-if="dynamic">
              <label>Application</label>
              <button class="btn btn-warning" @click="action('stop')">Stop application</button>
              <button class="btn btn-warning" @click="action('start')">Start application</button>
              <button class="btn btn-warning" @click="action('restart')">Restart application</button>
              <br><br>
              <label>Configuration</label>
              <button class="btn btn-info" @click="showKeyModal">View DB keys</button>
              <button class="btn btn-info" @click="showEnvModal">Set env-vars</button>
              <br><br>
            </template>
          </div>
        </div>
      </article>
      <article class="col-sm-8">
        <div class="card">
          <div class="header">
            <h3>Information</h3>
            <hr>
          </div>
          <div class="content config">
            <label>Created at</label>
            <p>{{new Date(app.created).toLocaleString()}}</p>
            <label>Updated at</label>
            <p>{{new Date(app.updated).toLocaleString()}}</p>
            <label>App URLs</label>
            <ol>
              <template v-if="openLink">
                <li><a :href="openLink" target="_blank">{{openLink}}</a></li>
                <li><a :href="namespaceOpenLink" target="_blank">{{namespaceOpenLink}}</a></li>
                <li><a :href="commonOpenLink" target="_blank">{{commonOpenLink}}</a></li>
              </template>
              <li v-for="cname in app.config.cname">
                <a :href="'http://' + cname" target="_blank">http://{{cname}}/</a>
              </li>
            </ol>
          </div>
        </div>
        <div class="card">
          <div class="header">
            <h3>Configuration</h3>
            <p class="category">
              <a :href="sourceLink + 'showcase.yaml'" target="_blank">
                <i class="ti-new-window"></i> View showcase.yaml
              </a>
            </p>
            <hr>
          </div>
          <div class="content config">
            <label>App type</label>
            <p>{{app.config.type}}</p>
            <template v-if="dynamic">
              <label>Exposed port</label>
              <p>{{exposedPort}}</p>
              <label>HTTP proxying</label>
              <p v-html="httpProxying"></p>
            </template>
            <label>Enable HTTPS</label>
            <p>{{app.config.https}}</p>
            <label>Enable internal acess filter</label>
            <p>{{app.config.internal}}</p>
            <label>Alternative hostname</label>
            <p>
              <template v-if="!app.config.cname.length">
                not configured
              </template>
              <template v-for="cname in app.config.cname">
                {{cname}}<br>
              </template>
            </p>
            <label>Workdir / Docroot (relative from repository root)</label>
            <p>{{app.config.work_dir}}</p>
            <label>Startup script</label>
            <p><pre>{{app.config.startup}}</pre></p>
            <template v-if="dynamic">
              <label>Entrypoint script</label>
              <p><pre>{{app.config.entrypoint}}</pre></p>
            </template>
          </div>
        </div>
      </article>
    </div>
    <div class="row" v-if="dynamic">
      <article class="col-sm-12">
        <div class="card">
          <div class="header">
            <h3>STDOUT of main process</h3>
            <hr>
          </div>
          <div class="content">
            <shell v-if="stdout" :value="stdout" />
            <button class="btn btn-lg btn-primary" @click="getData({stdout: true})">{{stdout ? 'Update' : 'View'}} STDOUT</button>
            <br><br>
          </div>
        </div>
      </article>
    </div>
    <v-dialog />
  </section>
</template>
<script>
  import Shell from 'components/UIComponents/Shell.vue'
  import Notifier from 'components/Dashboard/mixin_notifier.js'
  import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'

  import {GIT_URL, PUBLIC_DOMAIN, statusColor, printPort, printHostname, API} from 'src/showcase'

  export default {
    mixins: [
      Notifier
    ],
    components: {
      Shell,
      StatsCard
    },
    computed: {
      statusColor () {
        return statusColor('icon', this.app.status.Status)
      },
      statusIcon () {
        if (this.statusColor === 'icon-danger') {
          return 'ti-heart-broken'
        }
        if (this.statusColor === 'icon-warning') {
          return 'ti-pulse'
        }
        if (this.statusColor === 'icon-success' || this.statusColor === 'icon-info') {
          return 'ti-heart'
        }
        return 'ti-help'
      },
      sourceLink () {
        return `${GIT_URL}/${this.app.repo}/src/branch/${this.app.branch}/`
      },
      openLink () {
        if (this.app.config.type === 'static' || this.app.config.http_proxy) {
          return `http://${printHostname(this.app)}/`
        }
        return null
      },
      commonOpenLink () {
        return `https://${PUBLIC_DOMAIN}/~${this.app.repo.toLowerCase()}/`
      },
      namespaceOpenLink () {
        const [ns, repo] = this.app.repo.toLowerCase().split('/')
        return `https://${ns}.${PUBLIC_DOMAIN}/${repo}/`
      },
      serverHost () {
        return location.hostname
      },
      httpProxying () {
        if (this.app.config.http_proxy) {
          return `host( ${printPort([80, 443])} ) <i class="ti-control-forward"></i> app( ${printPort(this.app.config.http_proxy)} )`
        }
        return 'not used'
      },
      exposedPort () {
        if (this.app.config.exposed && this.app.config.exposed.length) {
          return printPort(this.app.config.exposed)
        }
        return 'no exposed port'
      },
      dynamic () {
        return this.app.config.type !== 'static'
      }
    },
    data () {
      return {
        app: null,
        stdout: '',
        timer: null
      }
    },
    beforeDestroy () {
      clearInterval(this.timer)
    },
    created () {
      this.timer = setInterval(_ => this.getData({renew: true}), 8192)
      this.getData()
    },
    watch: {
      '$route' () {
        this.getData()
      }
    },
    methods: {
      param (obj) {
        return Object.assign({}, this.$route.query, obj)
      },
      async getData (req = {}) {
        const [ok, raw] = await API('app', this.param(req))
        if (!ok) {
          return this.notifyRemoteError(raw)
        }
        this.app = raw
        if ('stdout' in raw) {
          this.stdout = raw.stdout
        }
      },
      showKeyModal () {
        this.$modal.show('dialog', {
          title: 'Keys for databases',
          text: `
            <p>Showcase issues a key if <code>use_*****db</code> is enable</p>
            <textarea readonly>${JSON.stringify(this.app.keys, null, 2)}</textarea>
          `,
          buttons: [
            {
              title: 'Close'
            }
          ]
        })
      },
      showEnvModal () {
        this.$modal.show('dialog', {
          title: 'Set environment variables',
          text: `
            <p>
              Write JSON below.<br>
              <strong>Vars will be apply when app is re-deployed.</strong>
            </p>
            <textarea id="env-modal">${JSON.stringify(this.app.envs, null, 2)}</textarea>
          `,
          buttons: [
            {
              title: 'Cancel'
            },
            {
              title: 'Apply',
              handler: async () => {
                try {
                  const envs = JSON.parse(document.querySelector('#env-modal').value)
                  if (typeof envs !== 'object' || Array.isArray(envs)) {
                    throw new Error('invalid json')
                  }

                  const [ok, raw] = await API('env', this.param({set: JSON.stringify(envs)}))
                  if (!ok) {
                    throw new Error(raw)
                  }
                  this.notifyPassed(raw)
                  this.$modal.hide('dialog')
                  await this.getData()
                } catch (e) {
                  this.notifyLocalError(e)
                }
              }
            }
          ]
        })
      },
      async deploy (mode, param = {}) {
        const [ok, raw] = await API(mode, this.param(param))
        if (!ok) {
          return this.notifyRemoteError(raw)
        }
        this.notifyPassed(raw)
        if (mode === 'remove') {
          return this.$router.replace('/apps/my')
        }
        await this.getData()
      },
      async action (action) {
        await this.deploy('action', {action})
      }
    }
}
</script>
<style>
textarea {
  width: 100%;
  height: 10em;
  font-family: monospace;
}
</style>
<style scoped>
  small {
    font-size: .7em;
  }
  h3 {
    margin: 0;
  }
  .actions > button {
    width: 100%;
    margin-bottom: 10px;
  }
  .config > p {
    margin-bottom: 1.3em;
  }
  ol {
    padding: 0 0 0 1.5em;
    line-height: 1.6em;
  }
</style>
