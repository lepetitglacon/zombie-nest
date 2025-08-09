import {createRouter, createWebHistory} from "vue-router";
import GameView from '@/views/GameView.vue'
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import AdminView from "@/views/AdminView.vue";

const routes = [
    { path: '/', component: HomeView, name: 'home' },
    { path: '/login', component: LoginView, name: 'login' },
    { path: '/admin', component: AdminView, name: 'admin' },
    { path: '/games/:id', component: GameView, name: 'game' }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})

