import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

// Admin pages
import Logs from 'src/components/Dashboard/Views/Logs.vue'
import View from 'src/components/Dashboard/Views/View.vue'
import Apps from 'src/components/Dashboard/Views/Apps.vue'
import Manage from 'src/components/Dashboard/Views/Manage.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/logs',
    children: [
      {
        path: 'logs',
        name: 'Deploy Logs',
        component: Logs
      },
      {
        path: 'view/:id',
        name: 'View Logs',
        component: View,
        props: true
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
      },
      {
        path: 'manage',
        name: 'Manage Applications',
        component: Manage
      }
    ]
  },
  { path: '*', component: NotFound }
]

export default routes
