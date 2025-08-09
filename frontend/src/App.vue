<script setup lang="ts">
import {useSocketStore} from "@/stores/socket.ts";
import {router} from "@/router/router.ts";
import {useAuthStore} from "@/stores/authStore.ts";

const authStore = useAuthStore()
const socketStore = useSocketStore()

authStore.initializeAuth()

router.beforeEach((to, from, next) => {
  if (!authStore.isAuthenticated && to.name !== 'login') {
    return next({ name: 'login' });
  }

  next();
})
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

body, html {
  margin: 0;
  padding: 0;
  background: #9f2121;
}
</style>