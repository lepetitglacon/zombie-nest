import { router } from '@/router/router'
import { useAuthStore } from '@/stores/authStore'

export class NavigationManager {
  /**
   * Navigate to a specific tab in the home view
   */
  static goToHomeTab(tab: 'play' | 'maps' | 'history' | 'profile') {
    router.push({ name: 'home', query: { tab } })
  }

  /**
   * Navigate to a specific room
   */
  static goToRoom(roomId: string) {
    router.push({ name: 'room', params: { id: roomId } })
  }

  /**
   * Navigate to a specific game
   */
  static goToGame(gameId: string) {
    router.push({ name: 'game', params: { id: gameId } })
  }

  /**
   * Navigate to admin panel (with auth check)
   */
  static goToAdmin() {
    const authStore = useAuthStore()
    if (authStore.isAuthenticated && authStore.isAdmin) {
      router.push({ name: 'admin' })
    } else {
      console.warn('Access denied: Admin privileges required')
    }
  }

  /**
   * Navigate back or to home if no history
   */
  static goBack() {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push({ name: 'home' })
    }
  }

  /**
   * Handle deep linking on app startup
   */
  static async handleStartupNavigation() {
    const authStore = useAuthStore()
    const currentRoute = router.currentRoute.value
    
    // Check authentication status
    try {
      await authStore.checkAuth()
    } catch (error) {
      console.error('Auth check failed:', error)
    }

    // If not authenticated and trying to access protected route
    if (!authStore.isAuthenticated && currentRoute.meta.requiresAuth) {
      router.push('/login')
      return
    }

    // If authenticated and on login page, redirect to home
    if (authStore.isAuthenticated && currentRoute.name === 'login') {
      await router.push('/')
      return
    }

    // Handle special startup scenarios
    const urlParams = new URLSearchParams(window.location.search)
    const inviteCode = urlParams.get('invite')
    const roomId = urlParams.get('room')

    if (inviteCode) {
      // Handle room invitation
      try {
        // TODO: Join room with invite code
        console.log('Joining room with invite:', inviteCode)
      } catch (error) {
        console.error('Failed to join room:', error)
        await router.push('/')
      }
    } else if (roomId) {
      // Direct room access
      NavigationManager.goToRoom(roomId)
    }
  }
}

// Auto-initialize navigation on app start
export const initNavigation = () => {
  NavigationManager.handleStartupNavigation()
}