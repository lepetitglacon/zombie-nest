<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import api from "@/services/api.ts";
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle, DialogTrigger
} from 'radix-vue';
import {router} from "@/router/router.ts";

interface RoomData {
  name: string;
  mapId: string;
  gameOptions: GameOptions;
  isPrivate?: boolean;
  password?: string;
  description?: string;
}
enum GameMode {
  SURVIVAL = 'survival',
  PVP = 'pvp',
  EXPLORATION = 'exploration',
  COOPERATIVE = 'cooperative',
}
enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXTREME = 'extreme',
}

class GameOptions {
  gameMode?: GameMode;
  difficulty?: Difficulty;
  timeLimit?: number;
  friendlyFire?: boolean;
  respawnEnabled?: boolean;
  zombieCount?: number;
  lootMultiplier?: number;
  dayNightCycle?: boolean;
  weatherEnabled?: boolean;
}

interface Props {
  maps: any[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()
const isOpen = ref(false)

const initialRoomData = {
  name: '',
  mapId: '',
  isPrivate: false,
  password: '',
  maxPlayers: 4,
  gameOptions: {
    gameMode: GameMode.SURVIVAL
  }
}
const roomData = ref<RoomData>(initialRoomData)

const playerOptions = [
  { label: '2 Players', value: 2 },
  { label: '4 Players', value: 4 },
  { label: '6 Players', value: 6 },
  { label: '8 Players', value: 8 }
]

const maps = ref<{id: string}[]>([])


const selectedMap = computed(() => 
  maps.value.find(map => map.id === roomData.value.mapId)
)

const isValid = computed(() => {
  return roomData.value.name.trim() && 
         roomData.value.mapId
})

const handleCreateRoom = async () => {
  if (isValid.value) {
    try {
      console.log('Creating room:', { ...roomData.value })
      const roomRes = await api.post('/rooms', roomData.value)
      const room = roomRes.data

      handleClose()
      await router.push(`/room/${room._id}`)
    } catch (error) {
      console.error('Error creating room:', error)
      // TODO: Show error message to user
    }
  }
}

const handleClose = () => {
  // Reset form
  roomData.value = initialRoomData
  emit('close')
}

onMounted(async () => {
  const response = await api.get('/maps/available')
  maps.value = response.data
})
</script>

<template>
  <DialogRoot v-model="isOpen" @update:open="handleClose">

    <dialog-trigger>
      <UButton
          size="lg"
          variant="soft"
          color="blue"
          @click="isOpen = true"
          class="hover:scale-105 hover:shadow-md transition-all duration-200"
      >
        <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
        Create Room
      </UButton>
    </dialog-trigger>

    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
      <DialogContent class="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">

        <pre>{{ roomData}}</pre>

        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <DialogTitle class="text-lg font-semibold text-gray-900 dark:text-white">
              Create New Room
            </DialogTitle>
            <DialogClose class="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </DialogClose>
          </div>

      <form @submit.prevent="handleCreateRoom" class="space-y-4">
        <!-- Room Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Room Name
          </label>
          <input
            v-model="roomData.name"
            type="text"
            placeholder="Enter room name..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <!-- Map Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Map
          </label>
          <select
            v-model="roomData.mapId"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="" disabled>Select a map...</option>
            <option v-for="map in maps" :key="map.id" :value="map._id">
              {{ map.name }}
            </option>
          </select>
          
          <!-- Map Preview -->
          <div v-if="selectedMap" class="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="text-2xl">🗺️</div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">
                  {{ selectedMap.name }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ selectedMap.description || 'No description available' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Max Players -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Players
          </label>
          <select
            v-model="roomData.maxPlayers"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option v-for="option in playerOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Private Room Toggle -->
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Private Room
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Requires password to join
            </p>
          </div>
          <button
            type="button"
            @click="roomData.isPrivate = !roomData.isPrivate"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              roomData.isPrivate ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
            ]"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                roomData.isPrivate ? 'translate-x-6' : 'translate-x-1'
              ]"
            />
          </button>
        </div>

        <!-- Password (only if private) -->
        <div v-if="roomData.isPrivate" class="transition-all duration-200">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Room Password
          </label>
          <input
            v-model="roomData.password"
            type="password"
            placeholder="Enter room password..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <!-- Room Summary -->
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 class="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Room Summary
          </h4>
          <div class="space-y-1 text-sm text-blue-700 dark:text-blue-300">
            <div class="flex justify-between">
              <span>Name:</span>
              <span>{{ roomData.name || 'Not set' }}</span>
            </div>
            <div class="flex justify-between">
              <span>Map:</span>
              <span>{{ selectedMap?.name || 'Not selected' }}</span>
            </div>
            <div class="flex justify-between">
              <span>Players:</span>
              <span>{{ roomData.maxPlayers }}</span>
            </div>
            <div class="flex justify-between">
              <span>Privacy:</span>
              <span>{{ roomData.isPrivate ? 'Private' : 'Public' }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="handleClose"
            class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :class="[
              'flex-1 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors inline-flex items-center justify-center',
              isValid 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
            ]"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Room
          </button>
        </div>
      </form>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>