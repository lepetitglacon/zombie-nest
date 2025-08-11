<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'
import {useSocketStore} from "@/stores/socket.ts";
import {ref, toRaw} from "vue";

const socketStore = useSocketStore()

const map = ref(null)

socketStore.on('gameEngine.init.loadMap', async mapFilepath => {
  console.log('Loading map', mapFilepath);

  const { scene } = await useGLTF(`http://localhost:3001/${game.map.filePath}`, { draco: true })
  map.value = scene
})

</script>

<template>

  <suspense>
    <primitive v-if="map" :object="toRaw(map)" />
  </suspense>

</template>

<style scoped>

</style>