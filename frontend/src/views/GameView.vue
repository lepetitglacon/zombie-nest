<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import { useGameStore } from '@/stores/game'
import { useSocketStore } from '@/stores/socket'
import GameMeshes from "@/components/Game/GameMeshes.vue";
import {useRouter} from "vue-router";

const gameStore = useGameStore()
const socketStore = useSocketStore()

const router = useRouter()
console.log(router.currentRoute.value.params)

onMounted(() => {
  socketStore.on('game:init', (data) => {
    console.log('game:init', data)
  })
  socketStore.emit('game:init', {})
})

onUnmounted(() => {
  socketStore.disconnect()
})

const showMenu = ref(false)

function toggleMenu() {
  showMenu.value = !showMenu.value
}
</script>

<template>

  <div class="menu-container" style="z-index: 1000; position: absolute; top: 20px; right: 20px; pointer-events: none;">
    <button class="burger-button" @click="toggleMenu" style="pointer-events: auto;">
      <div class="burger-line"></div>
      <div class="burger-line"></div>
      <div class="burger-line"></div>
    </button>
    
    <div v-if="showMenu" class="menu-dropdown" style="pointer-events: auto;">
      <RouterLink to="/">Quitter</RouterLink>
    </div>
  </div>

  <div class="game-container">
    <TresCanvas
        clear-color="#82DBC5"
        window-size
    >
      <TresPerspectiveCamera
          :position="[3, 3, 3]"
          :look-at="[0, 0, 0]"
      />
      <OrbitControls/>
      <TresAmbientLight :intensity="1" />

      <GameMeshes/>

    </TresCanvas>
  </div>
</template>

<style scoped>
.game-container {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.burger-button {
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 40px;
  height: 40px;
  justify-content: center;
}

.burger-line {
  width: 24px;
  height: 3px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.burger-button:hover {
  background: rgba(0, 0, 0, 0.9);
}

.menu-dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 8px;
  padding: 12px;
  min-width: 120px;
}

.menu-dropdown a {
  color: white;
  text-decoration: none;
  display: block;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.menu-dropdown a:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>