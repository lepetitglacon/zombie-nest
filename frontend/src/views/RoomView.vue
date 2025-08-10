<script setup lang="ts">
import {onMounted, onUnmounted, watch} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRoomStore } from '@/stores/roomStore'
import { useSocketStore } from '@/stores/socket'
import PlayersList from '@/components/Room/PlayersList.vue'
import MapSelector from '@/components/Room/MapSelector.vue'

const route = useRoute()
const router = useRouter()
const roomStore = useRoomStore()
const socketStore = useSocketStore()

const roomId = route.params.id as string

const leaveRoom = async () => {
  if (confirm('Are you sure you want to leave the room?')) {
    await roomStore.leaveRoom()
  }
}

onMounted(async () => {
  try {
    // Fetch room data
    await roomStore.fetchRoom(roomId)

    // Setup socket connection and listeners
    if (!socketStore.socket?.connected) {
      await socketStore.connect()
    }

    roomStore.setupSocketListeners()

    // Join room socket channel
    if (socketStore.socket) {
      socketStore.socket.emit('room:join', { roomId })
    }
  } catch (error) {
    console.error('Failed to load room:', error)
    router.push('/')
  }
})

onUnmounted(() => {
  // Leave room socket channel
  if (socketStore.socket) {
    socketStore.socket.emit('room:leave', { roomId })
  }
})

watch(() => socketStore.socket.connected, () => {
  if (!roomStore.currentRoom) {
    socketStore.socket.emit('room:join', { roomId })
  }
})
</script>

<template>
<!--  <pre>{{ roomStore.currentRoom }}</pre>-->
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-6">
    <!-- Loading State -->
    <div v-if="roomStore.loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p class="text-white">Loading room...</p>
      </div>
    </div>

    <!-- Room Content -->
    <div v-else-if="roomStore.currentRoom" class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-4xl font-bold text-white mb-2">{{ roomStore.currentRoom.name }}</h1>
          <p class="text-gray-300">{{ roomStore.currentRoom.description || 'No description' }}</p>
        </div>
        
        <div class="flex items-center gap-4">
          <!-- Room Status Badge -->
          <div class="px-4 py-2 rounded-full border"
               :class="{
                 'border-yellow-500 bg-yellow-500/10 text-yellow-400': roomStore.currentRoom.status === 'waiting',
                 'border-green-500 bg-green-500/10 text-green-400': roomStore.currentRoom.status === 'in_progress',
                 'border-red-500 bg-red-500/10 text-red-400': roomStore.currentRoom.status === 'finished'
               }">
            {{ roomStore.currentRoom.status.replace('_', ' ').toUpperCase() }}
          </div>

          <!-- Leave Room Button -->
          <button @click="leaveRoom"
                  class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
            Leave Room
          </button>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Column: Room Info & Map -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Map Selector -->
          <MapSelector />
          
          <!-- Game Options -->
          <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 class="text-xl font-semibold text-white mb-4">Game Settings</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              
              <div class="bg-white/5 rounded-lg p-3">
                <p class="text-gray-400 text-sm">Max Players</p>
                <p class="text-white font-medium">{{ roomStore.currentRoom.gameOptions.maxPlayers }}</p>
              </div>
              
              <div class="bg-white/5 rounded-lg p-3">
                <p class="text-gray-400 text-sm">Difficulty</p>
                <p class="text-white font-medium capitalize">{{ roomStore.currentRoom.gameOptions.difficulty }}</p>
              </div>
              
              <div class="bg-white/5 rounded-lg p-3">
                <p class="text-gray-400 text-sm">Game Mode</p>
                <p class="text-white font-medium capitalize">{{ roomStore.currentRoom.gameOptions.gameMode }}</p>
              </div>
              
              <div class="bg-white/5 rounded-lg p-3">
                <p class="text-gray-400 text-sm">Friendly Fire</p>
                <p class="text-white font-medium">{{ roomStore.currentRoom.gameOptions.friendlyFire ? 'Enabled' : 'Disabled' }}</p>
              </div>
              
              <div v-if="roomStore.currentRoom.gameOptions.timeLimit" class="bg-white/5 rounded-lg p-3">
                <p class="text-gray-400 text-sm">Time Limit</p>
                <p class="text-white font-medium">{{ roomStore.currentRoom.gameOptions.timeLimit }} min</p>
              </div>
              
              <div class="bg-white/5 rounded-lg p-3">
                <p class="text-gray-400 text-sm">Privacy</p>
                <p class="text-white font-medium">{{ roomStore.currentRoom.isPrivate ? 'Private' : 'Public' }}</p>
              </div>
              
            </div>
          </div>
          
        </div>

        <!-- Right Column: Players -->
        <div class="space-y-6">
          
          <!-- Players List -->
          <PlayersList />
          
          <!-- Ready/Start Game Controls -->
          <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div class="space-y-4">
              
              <!-- Ready Toggle (for non-hosts) -->
              <div v-if="!roomStore.isHost" class="text-center">
                <button @click="roomStore.toggleReady()"
                        :disabled="roomStore.loading"
                        class="w-full py-3 px-6 rounded-lg font-medium transition-colors"
                        :class="roomStore.currentPlayer?.ready
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'">
                  {{ roomStore.currentPlayer?.ready ? 'Ready!' : 'Ready Up' }}
                </button>
              </div>
              
              <!-- Start Game (for hosts) -->
              <div v-else class="text-center space-y-3">
                <div v-if="!roomStore.allPlayersReady" class="text-yellow-400 text-sm">
                  Waiting for all players to ready up...
                </div>
                
                <button @click="roomStore.startGame()"
                        :disabled="!roomStore.canStartGame || roomStore.loading"
                        class="w-full py-3 px-6 rounded-lg font-medium transition-colors"
                        :class="roomStore.canStartGame
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'">
                  {{ roomStore.loading ? 'Starting...' : 'Start Game' }}
                </button>
              </div>
              
            </div>
          </div>
          
        </div>
        
      </div>
      
      <!-- Error Display -->
      <div v-if="roomStore.error" 
           class="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
        <div class="flex items-center justify-between gap-4">
          <span>{{ roomStore.error }}</span>
          <button @click="roomStore.clearError()" class="text-white/80 hover:text-white">
            ×
          </button>
        </div>
      </div>
      
    </div>

    <!-- Room Not Found -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-white mb-4">Room not found</h2>
        <p class="text-gray-400 mb-6">The room you're looking for doesn't exist or has been closed.</p>
        <button @click="$router.push('/')"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          Back to Home
        </button>
      </div>
    </div>
    
  </div>
</template>

