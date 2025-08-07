<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'
import {useSocketStore} from "@/stores/socket.ts";
import {ref, toRaw} from "vue";

const socketStore = useSocketStore()

const map = ref(null)

socketStore.on('player.connect.init', async game => {
  console.log('Loading map', game.map.filePath);

  const { scene } = await useGLTF(`http://localhost:3001/assets/maps/${game.map.filePath}`, { draco: true })
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