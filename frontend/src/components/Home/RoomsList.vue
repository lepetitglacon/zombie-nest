<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Available Rooms</h2>
        <p class="text-gray-600 dark:text-gray-400">Join an existing room or create your own</p>
      </div>
      
      <div class="flex items-center gap-3">
        <button @click="refreshRooms"
                :disabled="loading"
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
        
        <CreateRoomModal />
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-4 mb-6">
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Show:</label>
        <select v-model="showPrivate" 
                class="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
          <option :value="false">Public rooms only</option>
          <option :value="true">All rooms</option>
        </select>
      </div>
      
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
        <select v-model="statusFilter" 
                class="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
          <option value="">All statuses</option>
          <option value="waiting">Waiting</option>
          <option value="in_progress">In Progress</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading rooms...</p>
      </div>
    </div>

    <!-- Rooms List -->
    <div v-else-if="filteredRooms.length > 0" class="space-y-4">
      <div v-for="room in filteredRooms" 
           :key="room._id"
           class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
        
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ room.name }}</h3>
              
              <!-- Status Badge -->
              <span class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="{
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400': room.status === 'waiting',
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400': room.status === 'in_progress',
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400': room.status === 'finished'
                    }">
                {{ room.status.replace('_', ' ').toUpperCase() }}
              </span>
              
              <!-- Private Badge -->
              <span v-if="room.isPrivate" 
                    class="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
                Private
              </span>
            </div>
            
            <p v-if="room.description" class="text-gray-600 dark:text-gray-400 text-sm mb-3">
              {{ room.description }}
            </p>
            
            <!-- Room Details -->
            <div class="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {{ room.players?.length || 0 }} / {{ room.gameOptions?.maxPlayers || 8 }} players
              </div>
              
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {{ room.gameOptions?.mapName || 'Unknown Map' }}
              </div>
              
              <div class="flex items-center gap-1 capitalize">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {{ room.gameOptions?.difficulty || 'Medium' }}
              </div>
              
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatTime(room.createdAt) }}
              </div>
            </div>
          </div>
          
          <!-- Join Button -->
          <div class="ml-6">
            <button @click="roomStore.joinRoom(room._id)"
                    :disabled="room.players?.length >= room.gameOptions?.maxPlayers || room.status !== 'waiting'"
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium">
              <span v-if="room.players?.length >= room.gameOptions?.maxPlayers">Full</span>
              <span v-else-if="room.status !== 'waiting'">{{ room.status === 'in_progress' ? 'In Progress' : 'Finished' }}</span>
              <span v-else>Join Room</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="max-w-md mx-auto">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No rooms available</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          There are no rooms matching your criteria. Be the first to create one!
        </p>
        <CreateRoomModal />
      </div>
    </div>

    <!-- Join Private Room Modal -->
    <div v-if="showJoinModal" 
         class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
         @click.self="showJoinModal = false">
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Join Private Room</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">This room is private. Enter the password to join.</p>
        
        <input v-model="roomPassword"
               type="password"
               placeholder="Room password"
               class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        
        <div class="flex gap-3">
          <button @click="showJoinModal = false"
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Cancel
          </button>
          <button @click=""
                  :disabled="!roomPassword.trim()"
                  class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors">
            Join Room
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoomStore, type Room } from '@/stores/roomStore'
import CreateRoomModal from '@/components/Home/CreateRoomModal.vue'

const roomStore = useRoomStore()

const loading = ref(false)
const showPrivate = ref(false)
const statusFilter = ref('')
const showJoinModal = ref(false)
const roomPassword = ref('')
const selectedRoom = ref<Room | null>(null)

const filteredRooms = computed(() => {
  let rooms = roomStore.availableRooms || []
  
  if (!showPrivate.value) {
    rooms = rooms.filter(room => !room.isPrivate)
  }
  
  if (statusFilter.value) {
    rooms = rooms.filter(room => room.status === statusFilter.value)
  }
  
  return rooms.sort((a, b) => {
    // Sort by status: waiting first, then in_progress, then finished
    const statusOrder = { waiting: 0, in_progress: 1, finished: 2 }
    const statusDiff = statusOrder[a.status] - statusOrder[b.status]
    if (statusDiff !== 0) return statusDiff
    
    // Then by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

const refreshRooms = async () => {
  loading.value = true
  try {
    await roomStore.fetchAvailableRooms()
  } catch (error) {
    console.error('Failed to fetch rooms:', error)
  } finally {
    loading.value = false
  }
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `${minutes}m ago`
  } else if (hours < 24) {
    return `${hours}h ago`
  } else {
    return `${days}d ago`
  }
}

onMounted(() => {
  refreshRooms()
})
</script>