import { defineStore } from 'pinia'
import {ref, watch} from 'vue'
import { io, Socket } from 'socket.io-client'
import {useAuthStore} from "@/stores/authStore.ts";
import {useRoomStore} from "@/stores/roomStore.ts";
import {useGameStore} from "@/stores/gameStore.ts";

export type ClientState = {
  room?: RoomDocument;
  game?: GameDocument;
};

export const useSocketStore = defineStore('socket', () => {
  const authStore = useAuthStore()
  const roomStore = useRoomStore()
  const gameStore = useGameStore()

  const socket = ref<Socket>(io('http://localhost:3001', {autoConnect: false}))
  const isConnected = ref(false)

  socket.value.on('connect', () => {
    isConnected.value = true
    console.log('Connected to server')
  })
  socket.value.on('disconnect', (reason) => {
    isConnected.value = false
    console.log('Disconnected from server', reason)
  })
  socket.value.on('client:state', (state: ClientState) => {
    console.log('client state', state)
    roomStore.room = state.room
    gameStore.game = state.game
  })

  function connect(opts= {}) {
    socket.value.connect(opts)
  }
  
  function disconnect() {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
    }
  }
  
  function emit(event: string, data: any) {
    if (socket.value) {
      socket.value.emit(event, data)
    }
  }
  
  function on(event: string, callback: Function) {
    if (socket.value) {
      socket.value.on(event, callback)
    }
  }

  watch(() => authStore.isAuthenticated, () => {
    if (authStore.isAuthenticated) {
      if (!socket.value) {
        connect({ query: {
          token: authStore.token,
          userId: authStore?.user?.id,
        } })
      }
    } else {
      console.log('not auth')
      disconnect()
    }
  })
  
  return {
    socket,
    isConnected,
    connect,
    disconnect,
    emit,
    on
  }
})