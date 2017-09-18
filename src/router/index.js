import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import Network from '@/pages/Network'
import Traffic from '@/pages/Traffic'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/network',
      name: 'Network',
      component: Network
    },
    {
      path: '/traffic',
      name: 'Traffic',
      component: Traffic
    }
  ]
})
