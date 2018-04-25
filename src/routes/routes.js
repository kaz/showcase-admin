import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

// Admin pages
import Logs from 'src/components/Dashboard/Views/Logs.vue'
import Apps from 'src/components/Dashboard/Views/Apps.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/logs',
    children: [
      {
        path: 'logs',
        name: 'Deploy logs',
        component: Logs
      },
      {
        path: 'apps/my',
        name: 'My Applications',
        component: Apps,
        props: {scope: 'my'}
      },
      {
        path: 'apps/all',
        name: 'All Applications',
        component: Apps,
        props: {scope: 'all'}
      }
    ]
  },
  { path: '*', component: NotFound }
]

export default routes
