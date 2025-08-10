

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoomStore, type RoomPlayer } from '@/stores/roomStore'
import { useAuthStore } from '@/stores/authStore'

const roomStore = useRoomStore()
const authStore = useAuthStore()

const urlInput = ref<HTMLInputElement>()
const urlCopied = ref(false)

const emptySlots = computed(() => {
  const currentPlayers = roomStore.currentRoom?.players.length || 0
  const maxPlayers = roomStore.currentRoom?.gameOptions.maxPlayers || 8
  return Math.max(0, maxPlayers - currentPlayers)
})

const roomUrl = computed(() => {
  if (!roomStore.currentRoom) return ''
  return `${window.location.origin}/room/${roomStore.currentRoom._id}`
})

const getPlayerInitials = (name: string): string => {
  if (!name) return '?'
  if (name.includes('@')) {
    // Email format - take first letter
    return name.charAt(0).toUpperCase()
  }
  // Regular name - take first letters of first two words
  const words = name.split(' ')
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
  }
  return words[0].slice(0, 2).toUpperCase()
}

const getPlayerDisplayName = (player: RoomPlayer): string => {
  if (player.username) {
    // If username is an email, extract the part before @
    if (player.username.includes('@')) {
      return player.username.split('@')[0]
    }
    return player.username
  }
  return `${player.userId.slice(0, 12)}`
}

const getPlayerStatus = (player: RoomPlayer): string => {
  if (player.isHost) {
    return 'Room Host'
  }
  if (player.ready) {
    return 'Ready to play'
  }
  return 'Preparing...'
}

const isCurrentUser = (player: RoomPlayer): boolean => {
  return player.userId === authStore.user?.id
}

const kickPlayer = async (player: RoomPlayer) => {
  if (confirm(`Are you sure you want to kick ${getPlayerDisplayName(player)}?`)) {
    try {
      // TODO: Implement kick player API
      console.log('Kicking player:', player.userId)
    } catch (error) {
      console.error('Failed to kick player:', error)
    }
  }
}

const copyRoomUrl = async () => {
  try {
    await navigator.clipboard.writeText(roomUrl.value)
    urlCopied.value = true
    setTimeout(() => {
      urlCopied.value = false
    }, 2000)
  } catch (error) {
    // Fallback for older browsers
    if (urlInput.value) {
      urlInput.value.select()
      document.execCommand('copy')
      urlCopied.value = true
      setTimeout(() => {
        urlCopied.value = false
      }, 2000)
    }
  }
}
</script>

<template>
  <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-semibold text-white">Players</h3>
      <div class="text-sm text-gray-400">
        {{ roomStore.currentRoom?.players.length || 0 }} / {{ roomStore.currentRoom?.gameOptions.maxPlayers || 8 }}
      </div>
    </div>

    <div class="space-y-3">
      <div v-for="player in roomStore.currentRoom?.players" 
           :key="player.userId"
           class="flex items-center justify-between p-3 rounded-lg"
           :class="{
             'bg-blue-500/10 border border-blue-500/20': player.isHost,
             'bg-white/5': !player.isHost
           }">
        
        <div class="flex items-center gap-3">
          <!-- Player Avatar -->
          <div class="relative">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span class="text-white font-bold text-sm">
                {{ getPlayerInitials(player.userId) }}
              </span>
            </div>
            <!-- Host Crown -->
            <div v-if="player.isHost" 
                 class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2V3a1 1 0 011-1zm0 5v3h10V7H5z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2">
              <span class="text-white font-medium">
                {{ getPlayerDisplayName(player) }}
              </span>
              <span v-if="player.isHost" class="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                Host
              </span>
              <span v-if="isCurrentUser(player)" class="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                You
              </span>
            </div>
            
            <!-- Player Status -->
            <div class="text-sm text-gray-400 mt-1">
              {{ getPlayerStatus(player) }}
            </div>
          </div>
        </div>

        <!-- Ready Status -->
        <div class="flex items-center gap-2">


          <button @click="roomStore.toggleReady()">

            <div v-if="player.ready"
                 class="flex items-center gap-1 text-green-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-xs font-medium">Ready</span>
            </div>

            <div v-else class="flex items-center gap-1 text-yellow-400">
              <svg class="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-xs font-medium">Waiting</span>
            </div>

          </button>


          <!-- Kick Button (only for host and not themselves) -->
          <button v-if="roomStore.isHost && !player.isHost && !isCurrentUser(player)"
                  @click="kickPlayer(player)"
                  class="ml-2 p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                  title="Kick player">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      </div>

      <!-- Empty slots -->
      <div v-for="n in emptySlots" 
           :key="`empty-${n}`"
           class="flex items-center p-3 rounded-lg bg-white/5 border-2 border-dashed border-white/10">
        <div class="flex items-center gap-3 text-gray-500">
          <div class="w-10 h-10 rounded-full bg-gray-600/50 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span class="text-sm">Waiting for player...</span>
        </div>
      </div>
    </div>

    <!-- Room URL for sharing (if host) -->
    <div v-if="roomStore.isHost && roomStore.currentRoom" 
         class="mt-6 pt-4 border-t border-white/10">
      <div class="text-sm text-gray-400 mb-2">Share room URL:</div>
      <div class="flex items-center gap-2">
        <input ref="urlInput" 
               :value="roomUrl" 
               readonly
               class="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-400" />
        <button @click="copyRoomUrl"
                class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
          {{ urlCopied ? 'Copied!' : 'Copy' }}
        </button>
      </div>
    </div>
  </div>
</template>