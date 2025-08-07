import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Tres from '@tresjs/core'
import App from './App.vue'
import {router} from "@/router/router.ts";


const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(Tres)
app.use(router)
app.mount('#app')