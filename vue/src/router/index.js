import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Layout',
      redirect: {name: 'Home'},
      component: () => import('@/view/layout.vue'),
      children: [
        {
          path: '/home',
          name: 'Home',
          component: () => import('@/view/landing/index.vue')
        },
        {
          path: '/about',
          name: 'About',
          component: () => import('@/view/about/about.vue')
        },
        {
          path: '/explore',
          name: 'Explore',
          component: () => import('@/view/explore/explore.vue')
        },
        {
          path: '/customize',
          name: 'CustomizeData',
          component: () => import('@/view/mapKeyToValue/customMapping/table.vue')
        },
        {
          path: '/output',
          name: 'OutputView',
          component: () => import('@/view/mapKeyToValue/output.vue')
        }
      ]
    }
  ]
})
