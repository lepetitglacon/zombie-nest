import {createRouter, createWebHistory} from "vue-router";
import GameView from '@/views/GameView.vue'
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import AdminView from "@/views/AdminView.vue";
import RoomView from "@/views/RoomView.vue";
import { useAuthStore } from '@/stores/authStore';

const routes = [
    { 
        path: '/', 
        component: HomeView, 
        name: 'home',
        meta: { requiresAuth: true }
    },
    { 
        path: '/login', 
        component: LoginView, 
        name: 'login',
        meta: { guest: true }
    },
    { 
        path: '/admin', 
        component: AdminView, 
        name: 'admin',
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    { 
        path: '/room/:id', 
        component: RoomView, 
        name: 'room',
        meta: { requiresAuth: true }
    },
    { 
        path: '/game/:id', 
        component: GameView, 
        name: 'game',
        meta: { requiresAuth: true }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    
    // Check if user is authenticated
    const isAuthenticated = authStore.isAuthenticated || await authStore.checkAuth()
    
    // Routes that require authentication
    if (to.meta.requiresAuth && !isAuthenticated) {
        // Store the intended URL before redirecting to login
        if (to.path !== '/login') {
            authStore.setRedirectAfterAuth(to.fullPath)
        }
        next('/login')
        return
    }
    
    // Routes only for guests (not authenticated users)
    if (to.meta.guest && isAuthenticated) {
        next('/')
        return
    }
    
    // Routes that require admin permissions
    if (to.meta.requiresAdmin && (!isAuthenticated || !authStore.isAdmin)) {
        next('/')
        return
    }
    
    next()
})

