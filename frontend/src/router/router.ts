import GameView from '@/views/GameView.vue'
import HomeView from "@/views/HomeView.vue";
import {createRouter, createWebHistory} from "vue-router";

const routes = [
    { path: '/', component: HomeView },
    { path: '/games/:id', component: GameView }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})