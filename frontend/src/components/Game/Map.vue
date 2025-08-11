<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'
import {useSocketStore} from "@/stores/socket.ts";
import {onMounted, ref, toRaw} from "vue";
import {useGameStore} from "@/stores/gameStore.ts";

const gameStore = useGameStore()
const socketStore = useSocketStore()

const map = ref(null)

onMounted( () => {
  socketStore.on('gameEngine:init:done', async (data) => {
    console.log('map game:init', data)
    map.value = await useGLTF(`http://localhost:3001${data.map.filePath}`)
    console.log(map.value)
    gameStore.game = 'test'
  })
})

</script>

<template>

  <suspense>
    <primitive v-if="map" :object="toRaw(map.scene)" />
  </suspense>

</template>

<style scoped>

</style>