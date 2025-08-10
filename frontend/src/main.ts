import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ui from '@nuxt/ui/vue-plugin'
import Tres from '@tresjs/core'
import {router} from "@/router/router.ts";
import { initNavigation } from '@/utils/navigation'
import App from './App.vue'

import '@/assets/main.css'


const pinia = createPinia()

const app = createApp(App)
app.use(ui)
app.use(pinia)
app.use(Tres)
app.use(router)

// Initialize navigation after router is ready
router.isReady().then(() => {
  initNavigation()
})

app.mount('#app')