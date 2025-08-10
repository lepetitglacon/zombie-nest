import { defineStore } from 'pinia'
import {ref, computed, onMounted, watch} from 'vue'
import { router } from "@/router/router.ts"
import api from '@/services/api'
import { useSocketStore } from "@/stores/socket.ts"
import { useAuthStore } from "@/stores/authStore.ts"

export interface RoomPlayer {
  userId: string
  username?: string
  ready: boolean
  isHost: boolean
}

export interface GameOptions {
  maxPlayers: number
  difficulty: 'easy' | 'medium' | 'hard'
  gameMode: 'survival' | 'objective' | 'pvp'
  mapName: string
  timeLimit?: number
  friendlyFire: boolean
}

export interface Room {
  _id: string
  name: string
  description?: string
  hostId: string
  mapId: string
  isPrivate: boolean
  players: RoomPlayer[]
  gameOptions: GameOptions
  status: 'waiting' | 'in_progress' | 'finished' | 'cancelled'
  createdAt: Date
  startedAt?: Date
  finishedAt?: Date
}

export interface GameMap {
  _id: string
  id: string
  name: string
  description?: string
  imageUrl?: string
  maxPlayers?: number
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime?: number
  tags?: string[]
}

export const useRoomStore = defineStore('room', () => {
  const socketStore = useSocketStore()
  const authStore = useAuthStore()

  const currentRoom = ref<Room | null>(null)
  const availableRooms = ref<Room[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const availableMaps = ref<GameMap[]>([])

  const ownRooms = ref<Room[]>([])

  onMounted(async () => {
    const mapReq = await api.get('/maps/available')
    availableMaps.value = mapReq.data
    const roomReq = await api.get('/rooms/me')
    ownRooms.value = roomReq.data
  })

  // Computed properties
  const isHost = computed(() => {
    return currentRoom.value?.hostId === authStore.user._id
  })

  const currentPlayer = computed(() => {
    if (!currentRoom.value || !authStore.user) return null
    return currentRoom.value.players.find(p => p.userId === authStore.user!.id)
  })

  const allPlayersReady = computed(() => {
    if (!currentRoom.value) return false
    return currentRoom.value.players.every(p => p.ready || p.isHost)
  })

  const canStartGame = computed(() => {
    return isHost.value && 
           allPlayersReady.value && 
           currentRoom.value?.players.length >= 1 &&
           currentRoom.value?.status === 'waiting'
  })

  // Actions
  const createRoom = async (roomData: {
    name: string
    description?: string
    isPrivate: boolean
    password?: string
    gameOptions: GameOptions
  }) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/rooms', roomData)
      currentRoom.value = response.data
      
      await router.push(`/room/${response.data._id}`)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create room'
      throw err
    } finally {
      loading.value = false
    }
  }

  const joinRoom = async (roomId: string, password?: string) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post(`/rooms/${roomId}/join`, { password })
      currentRoom.value = response.data
      
      await router.push(`/room/${roomId}`)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to join room'
      throw err
    } finally {
      loading.value = false
    }
  }

  const leaveRoom = async () => {
    if (!currentRoom.value) return
    
    try {
      loading.value = true
      await api.post(`/rooms/${currentRoom.value._id}/leave`)
      currentRoom.value = null
      await router.push('/')
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to leave room'
    } finally {
      loading.value = false
    }
  }

  const toggleReady = async () => {
    if (!currentRoom.value) return

    socketStore.emit('room:ready', {
        roomId: currentRoom.value._id,
        playerId: authStore.user?.id
    })
    
    // try {
    //   const response = await api.patch(`/rooms/${currentRoom.value._id}/ready`)
    //   currentRoom.value = response.data
    // } catch (err: any) {
    //   error.value = err.response?.data?.message || 'Failed to toggle ready status'
    // }
  }

  const startGame = async () => {
    if (!currentRoom.value || !isHost.value) return
    
    try {
      loading.value = true
      const response = await api.post(`/rooms/${currentRoom.value._id}/start`)
      currentRoom.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to start game'
    } finally {
      loading.value = false
    }
  }

  const fetchRoom = async (roomId: string) => {
    try {
      loading.value = true
      const response = await api.get(`/rooms/${roomId}`)
      currentRoom.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Room not found'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAvailableRooms = async () => {
    try {
      const response = await api.get('/rooms')
      availableRooms.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch rooms'
    }
  }

  const updateMap = async (mapId: string) => {
    if (!currentRoom.value || !isHost.value) return

    try {
      const response = await api.patch(`/rooms/${currentRoom.value._id}/map`, {
        mapId: mapId
      })
      currentRoom.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update game options'
    }
  }

  const updateGameOptions = async (gameOptions: Partial<GameOptions>) => {
    if (!currentRoom.value || !isHost.value) return
    
    try {
      const response = await api.patch(`/rooms/${currentRoom.value._id}/game-options`, {
        gameOptions
      })
      currentRoom.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update game options'
    }
  }

  // Socket event handlers
  const setupSocketListeners = () => {
    if (!socketStore.socket) return

    socketStore.socket.on('room:state', (data: { room: Room, player: RoomPlayer }) => {
      console.log(data)
      currentRoom.value = data.room
    })
    socketStore.socket.on('room:joined', (room: Room) => {
      console.log('Joined room:', room)
    })
    socketStore.socket.on('room:started', ({room}: {room: Room}) => {
      console.log('room:started:', room)
      router.push('/game/' + room._id)
    })
    socketStore.socket.on('room:error', (error) => {
      console.log('Error room:', error)
    })

    socketStore.socket.on('room:disbanded', () => {
      currentRoom.value = null
      router.push('/')
    })
  }

  const clearError = () => {
    error.value = null
  }

  watch(() => currentRoom.value, (room) => {
    console.log(room.status)
    if (!room) return
    if (room.status === 'in_progress') {
      router.push('/game/' + room._id)
    }
  })

  return {
    // State
    currentRoom,
    availableRooms,
    loading,
    error,

    availableMaps,
    ownRooms,
    
    // Computed
    isHost,
    currentPlayer,
    allPlayersReady,
    canStartGame,
    
    // Actions
    createRoom,
    joinRoom,
    leaveRoom,
    toggleReady,
    startGame,
    fetchRoom,
    fetchAvailableRooms,
    updateMap,
    updateGameOptions,
    setupSocketListeners,
    clearError
  }
})