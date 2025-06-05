import { createRouter, createWebHistory } from 'vue-router'
import PostsList from '@/feature/posts/ui/PostsList.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: {
      template: PostsList,
    },
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
