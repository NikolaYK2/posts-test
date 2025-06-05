import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
  },
  {
    path: '/about',
    name: 'About',
    component: {
      template: '<div>About Page</div>',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
