import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/page/router/router.ts'

const app = createApp(App)

app.use(router)

app.mount('#app')
