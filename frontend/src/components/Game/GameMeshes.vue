<script setup lang="ts">

import Map from "@/components/Game/Map.vue";
</script>

<template>
  <TresMesh>
    <TresTorusGeometry :args="[1, 0.5, 16, 32]" />
    <TresMeshBasicMaterial color="orange" />
  </TresMesh>
  <Map/>
  <Player/>
</template>

<style scoped>

</style>