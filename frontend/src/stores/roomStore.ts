import { defineStore } from 'pinia'
import {ref, computed, onMounted, watch} from 'vue'
import { router } from "@/router/router.ts"
import api from '@/services/api'
import { useSocketStore } from "@/stores/socket.ts"
import { useAuthStore } from "@/stores/authStore.ts"
import {useGameStore} from "@/stores/gameStore.ts";

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
  const gameStore = useGameStore()

  const room = ref<Room>()
  const availableRooms = ref<Room[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const availableMaps = ref<GameMap[]>([])

  const ownRooms = ref<Room[]>([])

  onMounted(async () => {
    const roomId = router.currentRoute.value.params?.id
    if (roomId) {
      console.log('joining room', roomId)
      socketStore.emit('room:join', {roomId})
    }
    const mapReq = await api.get('/maps/available')
    availableMaps.value = mapReq.data
    const roomReq = await api.get('/rooms/me')
    ownRooms.value = roomReq.data
  })

  // Computed properties
  const isHost = computed(() => {
    return room.value?.hostId === authStore.user._id
  })

  const currentPlayer = computed(() => {
    if (!room.value || !authStore.user) return null
    return room.value.players.find(p => p.userId === authStore.user!.id)
  })

  const allPlayersReady = computed(() => {
    if (!room.value) return false
    return room.value.players.every(p => p.ready || p.isHost)
  })

  const canStartGame = computed(() => {
    return isHost.value && 
           allPlayersReady.value && 
           room.value?.players.length >= 1 &&
           room.value?.status === 'waiting'
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
      room.value = response.data
      
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
    const response = await api.post(`/rooms/${roomId}/join`, { password })

    if (response.data._id) {
      await router.push(`/room/${response.data._id}`)
    } else {
        error.value = response.data.message || 'Failed to join room'
        console.error(error.value)
    }

    return response.data
  }

  const leaveRoom = async () => {
    if (!room.value) return

    try {
      loading.value = true
      await api.post(`/rooms/${room.value._id}/leave`)
      room.value = null
      await router.push('/')
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to leave room'
    } finally {
      loading.value = false
    }
  }

  const toggleReady = async () => {
    if (!room.value) return
    socketStore.emit('room:ready', {
        roomId: room.value._id,
        playerId: authStore.user?.id
    })
  }

  const startGame = async () => {
    if (!room.value || !isHost.value) return
    
    try {
      loading.value = true
      const response = await api.post(`/rooms/${room.value._id}/start`)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to start game'
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
    if (!room.value || !isHost.value) return

    try {
      const response = await api.patch(`/rooms/${room.value._id}/map`, {
        mapId: mapId
      })
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update game options'
    }
  }

  const updateGameOptions = async (gameOptions: Partial<GameOptions>) => {
    if (!room.value || !isHost.value) return
    
    try {
      const response = await api.patch(`/rooms/${room.value._id}/game-options`, {
        gameOptions
      })
      room.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update game options'
    }
  }

  // Socket event handlers
  const setupSocketListeners = () => {
    if (!socketStore.socket) {
      console.log('socketStore not initialized')
    } else {
      console.log('Setting up socket listeners for room events')
    }

    // socketStore.socket.on('room:state', (room: Room) => {
    //   console.log(room)
    //   room.value = room
    // })
    socketStore.socket.on('room:started', async ({room, game}: {room: Room, game: any}) => {
      console.log(room, game)
      gameStore.gameId = game._id
      room.value = room
      await router.push(`/game/${room._id}`)
    })
    socketStore.socket.on('room:error', (error) => {
      console.log('Error room:', error)
    })

    socketStore.socket.on('room:disbanded', () => {
      room.value = null
      router.push('/')
    })
  }

  const clearError = () => {
    error.value = null
  }

  watch(() => room.value, (room) => {
    console.log(room.status)
    if (!room) return
    if (room.status === 'in_progress') {
      router.push('/game/' + room._id)
    }
  })

  return {
    // State
    room,
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
    fetchAvailableRooms,
    updateMap,
    updateGameOptions,
    setupSocketListeners,
    clearError
  }
})