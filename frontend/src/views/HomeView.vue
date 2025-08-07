<script setup lang="ts">

import {ref} from "vue";

const maps = ref([]);

fetch('http://localhost:3001/maps/available')
  .then(response => response.json())
  .then(data => {
    maps.value = data;
    console.log('Maps:', data);
  })
  .catch(error => {
    console.error('Error fetching maps:', error);
  });
</script>

<template>
  <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
    HELLO

    <RouterLink to="/games/test">PLAY</RouterLink>

    <ul>
      <li v-for="map of maps">
        <RouterLink :to="`/games/${map.id}`">{{ map.name }}</RouterLink>
        <pre>{{ map }}</pre></li>
    </ul>
  </div>
</template>

<style scoped>
</style>