<script setup lang="ts">
import {useSocketStore} from "@/stores/socketStore.ts";
import {router} from "@/router/router.ts";
import {useAuthStore} from "@/stores/authStore.ts";
import {watch, computed} from "vue";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'radix-vue'
import {useRoomStore} from "@/stores/roomStore.ts";

const authStore = useAuthStore()
const roomStore = useRoomStore()
const socketStore = useSocketStore()

authStore.initializeAuth()

router.beforeEach((to, from, next) => {
  if (!authStore.isAuthenticated && to.name !== 'login') {
    return next({ name: 'login' });
  }
  if (authStore.isAuthenticated && to.name === 'login') {
    return next({ name: 'home' });
  }

  next();
})

watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated && router.currentRoute.value.name === 'login') {
    router.push({ name: 'home' });
  }
});
</script>

<template>
    <div id="app">
      <router-view v-if="!authStore.isAuthenticated" />

      <template v-else>
        <!-- Modern Navbar -->
        <nav
            v-if="router.currentRoute.value.name !== 'game'"
            class="bg-white/95 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/95 dark:border-gray-700 sticky top-0 z-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
              <!-- Logo/Brand -->
              <div class="flex items-center">
                <button 
                  class="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                >
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span class="text-white font-bold text-sm">🧟</span>
                  </div>
                  <span class="text-xl font-bold text-gray-900 dark:text-white">
                    Zombie Nest
                  </span>
                </button>
              </div>

              <!-- Navigation Links -->
              <div class="hidden md:flex items-center space-x-8">
                <button 
                  class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  🎮 Play
                </button>
                <button 
                  @click="router.push({ name: 'home', query: { tab: 'maps' } })"
                  class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  🗺️ Maps
                </button>
                <button 
                  v-if="authStore.isAdmin"
                  class="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  ⚙️ Admin
                </button>
              </div>

              <!-- User Avatar Dropdown -->
              <div class="flex items-center space-x-4">

                <!-- Avatar Dropdown -->
                <DropdownMenuRoot>
                  <DropdownMenuTrigger asChild>
                    <button class="group relative">
                      <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                        {{ authStore.user?.email }}
                      </div>
                      <!-- Online indicator -->
                      <div
                          class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-900 rounded-full"
                          :class="socketStore.isConnected ? 'bg-green-400' : 'bg-red-400'"
                      ></div>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent 
                    align="end" 
                    class="w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-50"
                  >
                    <pre>{{ authStore.user}}</pre>
                    <!-- User Info -->
                    <DropdownMenuLabel class="px-3 py-2">
                      <div class="flex flex-col space-y-1">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          Account
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {{ authStore.user?.email }}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    
                    <DropdownMenuSeparator class="h-px bg-gray-200 dark:bg-gray-600 my-1" />

                    <!-- Navigation Items -->
                    <DropdownMenuGroup>
                      <DropdownMenuItem 
                        class="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </DropdownMenuItem>

                      <DropdownMenuItem 
                        class="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </DropdownMenuItem>

                      <DropdownMenuItem 
                        @select="router.push({ name: 'home', query: { tab: 'history' } })"
                        class="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Match History
                      </DropdownMenuItem>

                      <DropdownMenuItem 
                        v-if="authStore.isAdmin"
                        class="flex items-center px-3 py-2 text-sm text-purple-700 dark:text-purple-300 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer"
                      >
                        <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Admin Panel
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator class="h-px bg-gray-200 dark:bg-gray-600 my-1" />

                    <!-- Logout -->
                    <DropdownMenuItem 
                      @select="authStore.logout"
                      class="flex items-center px-3 py-2 text-sm text-red-700 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                    >
                      <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenuRoot>
              </div>
            </div>
          </div>
        </nav>

        <div class="page-container">
          <!-- Room Status Banner -->
          <div v-if="roomStore.ownRooms.length" class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-lg">
            <div class="max-w-7xl mx-auto">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span class="text-lg">🏠</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold">Your Active Rooms</h3>
                    <p class="text-sm text-white/80">{{ roomStore.ownRooms.length }} room(s) available</p>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <div 
                    v-for="room in roomStore.ownRooms" 
                    :key="room._id"
                    class="bg-white/10 backdrop-blur-sm rounded-lg p-3 min-w-[200px]"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-medium truncate">{{ room.name }}</h4>
                      <div class="flex items-center space-x-1">
                        <div 
                          :class="{
                            'bg-yellow-400': room.status === 'waiting',
                            'bg-green-400': room.status === 'in_progress', 
                            'bg-gray-400': room.status === 'finished',
                            'bg-red-400': room.status === 'cancelled'
                          }"
                          class="w-2 h-2 rounded-full"
                        ></div>
                        <span class="text-xs capitalize">{{ room.status.replace('_', ' ') }}</span>
                      </div>
                    </div>
                    
                    <div class="text-sm text-white/70 mb-3">
                      <div class="flex items-center space-x-4">
                        <span>👥 {{ room.players.length }}/{{ room.gameOptions.maxPlayers }}</span>
                        <span v-if="room.isPrivate">🔒 Private</span>
                      </div>
                    </div>
                    
                    <div class="flex space-x-2">
                      <button 
                        @click="joinActiveRoom(room._id)"
                        :disabled="room.status === 'finished' || room.status === 'cancelled'"
                        class="flex-1 bg-white text-blue-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {{ room.status === 'waiting' ? 'Join' : room.status === 'in_progress' ? 'Rejoin' : 'View' }}
                      </button>
                      <button 
                        @click="deleteRoom(room._id)"
                        :disabled="room.status === 'in_progress'"
                        class="bg-red-500/20 hover:bg-red-500/30 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <router-view />
        </div>
      </template>
    </div>
</template>

<style>
#app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

body, html {
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-container {
  height: calc(100vh - 64px); /* Full height minus navbar */
  overflow-y: auto;
}
</style>