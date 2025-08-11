import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  const gameId = ref<null | string>(null)
  const game = ref<any>(null)

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
  
  return {
    gameId,
    game,

    playerHealth,
    score,
    isGameRunning,

    startGame,
    endGame,
    updatePlayerHealth,
    updateScore
  }
})