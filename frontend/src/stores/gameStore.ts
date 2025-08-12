import { defineStore } from 'pinia'
import { ref } from 'vue'
import {useSocketStore} from "@/stores/socket.ts";

export const useGameStore = defineStore('game', () => {
  const socketStore = useSocketStore()

  const gameId = ref<null | string>(null)
  const init = ref({})
  const game = ref(null)

  const playerHealth = ref(100)
  const score = ref(0)
  const isGameRunning = ref(false)
  
  function startGame() {
    isGameRunning.value = true
    playerHealth.value = 100
    score.value = 0
  }
  
  function endGame() {
    isGameRunning.value = false
  }
  
  function updatePlayerHealth(health: number) {
    playerHealth.value = health
  }
  
  function updateScore(newScore: number) {
    score.value = newScore
  }

  function bind() {
    socketStore.on('room:joined', () => console.log('room joined'))
    socketStore.on('room:game:state', (data) => game.value = data)
  }
  
  return {
    gameId,
    game,
    init,

    playerHealth,
    score,
    isGameRunning,

    startGame,
    endGame,
    updatePlayerHealth,
    updateScore
  }
})