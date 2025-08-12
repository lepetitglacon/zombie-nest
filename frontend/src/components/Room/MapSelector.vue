
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {GameMap, useRoomStore} from '@/stores/roomStore'



const roomStore = useRoomStore()
const showMapSelector = ref(false)

// Mock data for available maps - replace with API call
const availableMaps = ref(roomStore.availableMaps)

const currentMap = computed(() => {return roomStore.availableMaps.find(map => map._id === roomStore.room?.mapId)})

const canChangeMap = computed(() => {
  return roomStore.isHost && roomStore.room?.status === 'waiting'
})

const onMapSelected = async (map: GameMap) => {
  if (!canChangeMap.value) return
  console.log(map)
  try {
    await roomStore.updateMap(map._id)
    showMapSelector.value = false
  } catch (error) {
    console.error('Failed to update map:', error)
  }
}
</script>

<template>
<!--   <pre>{{ roomStore.availableMaps}}</pre> -->
   <pre>{{ roomStore.isHost }}</pre>

  <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-semibold text-white">Map Selection</h3>
      <div v-if="roomStore.isHost && roomStore.room?.status === 'waiting'"
           class="text-sm text-blue-400">
        Click to change map
      </div>
    </div>

    <!-- Current Selected Map -->
    <div v-if="currentMap" class="mb-6">
      <div class="relative group cursor-pointer rounded-lg overflow-hidden"
           :class="{ 'hover:ring-2 hover:ring-blue-400': canChangeMap }"
           @click="canChangeMap && (showMapSelector = true)">
        
        <!-- Map Image -->
        <div class="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
          <img v-if="currentMap.imageUrl" 
               :src="currentMap.imageUrl" 
               :alt="currentMap.name"
               class="w-full h-full object-cover" />
          
          <!-- Fallback for no image -->
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>

          <!-- Change Map Overlay -->
          <div v-if="canChangeMap" 
               class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div class="text-center text-white">
              <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="text-sm font-medium">Change Map</p>
            </div>
          </div>
        </div>

        <!-- Map Info -->
        <div class="p-4 bg-white/5">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="text-lg font-semibold text-white mb-1">{{ currentMap.name }}</h4>
              <p class="text-gray-400 text-sm mb-2">{{ currentMap.description || 'No description available' }}</p>
              
              <div class="flex items-center gap-4 text-sm">
                <div class="flex items-center gap-1 text-gray-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {{ currentMap.maxPlayers || 'Unlimited' }} players
                </div>
                
                <div class="flex items-center gap-1 text-gray-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {{ currentMap.difficulty || 'Medium' }}
                </div>
                
                <div class="flex items-center gap-1 text-gray-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ~{{ currentMap.estimatedTime || '15' }}min
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Map Selection Modal -->
    <Teleport to="body">
      <div v-if="showMapSelector" 
           class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
           style="z-index: 9999;"
           @click.self="showMapSelector = false"
           @keydown.esc="showMapSelector = false">
        
        <div class="bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b border-white/10">
            <h3 class="text-2xl font-bold text-white">Choose Map</h3>
            <button @click="showMapSelector = false" 
                    class="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Scrollable Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="map in availableMaps" 
                   :key="map.id"
                   class="bg-white/5 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                   :class="{ 'ring-2 ring-blue-500': map._id === currentMap?._id }"
                   @click="onMapSelected(map)">
                
                <div class="h-32 bg-gradient-to-br from-gray-800 to-gray-900">
                  <img v-if="map.imageUrl" 
                       :src="map.imageUrl" 
                       :alt="map.name"
                       class="w-full h-full object-cover" />
                  
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 013.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                </div>

                <div class="p-3">
                  <h4 class="font-semibold text-white mb-1">{{ map.name }}</h4>
                  <p class="text-xs text-gray-400 mb-2">{{ map.description || 'No description' }}</p>
                  
                  <div class="flex items-center justify-between text-xs text-gray-300">
                    <span>{{ map.maxPlayers || 'Unlimited' }} players</span>
                    <span class="capitalize">{{ map.difficulty || 'Medium' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
