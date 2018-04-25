import Sidebar from './SideBar.vue'

const SidebarStore = {
  showSidebar: false,
  sidebarLinks: [
    {
      name: 'Deploy Logs',
      icon: 'ti-receipt',
      path: '/logs'
    },
    {
      name: 'My Apps',
      icon: 'ti-harddrive',
      path: '/apps/my'
    },
    {
      name: 'All Apps',
      icon: 'ti-harddrives',
      path: '/apps/all'
    }
  ],
  displaySidebar (value) {
    this.showSidebar = value
  }
}

const SidebarPlugin = {

  install (Vue) {
    Vue.mixin({
      data () {
        return {
          sidebarStore: SidebarStore
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$sidebar', {
      get () {
        return this.$root.sidebarStore
      }
    })
    Vue.component('side-bar', Sidebar)
  }
}

export default SidebarPlugin
