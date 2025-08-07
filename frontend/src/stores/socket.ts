import { defineStore } from 'pinia'
import { ref } from 'vue'
import { io, Socket } from 'socket.io-client'

export const useSocketStore = defineStore('socket', () => {
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)
  
  function connect(opts) {
    socket.value = io('http://localhost:3001', opts)

    socket.value.on('connect', () => {
      isConnected.value = true
      console.log('Connected to server')
    })
    socket.value.on('disconnect', () => {
      isConnected.value = false
      console.log('Disconnected from server')
    })
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
  
  return {
    socket,
    isConnected,
    connect,
    disconnect,
    emit,
    on
  }
})