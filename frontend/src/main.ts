import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ui from '@nuxt/ui/vue-plugin'
import Tres from '@tresjs/core'
import {router} from "@/router/router.ts";
import App from './App.vue'

import '@/assets/main.css'


const pinia = createPinia()

const app = createApp(App)
app.use(ui)
app.use(pinia)
app.use(Tres)
app.use(router)
app.mount('#app')