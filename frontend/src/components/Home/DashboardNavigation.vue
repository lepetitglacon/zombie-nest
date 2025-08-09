<script setup lang="ts">
interface Props {
  userEmail?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  logout: []
  goToAdmin: []
}>()
</script>

<template>
  <nav class="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <h1 class="text-xl font-bold text-gray-900">
            🧟 Zombie Nest
          </h1>
        </div>
        
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-500">
            Welcome, {{ userEmail }}
          </span>
          
          <UButton
            variant="soft"
            color="violet"
            class="hover:scale-105 transition-transform duration-200"
            @click="emit('goToAdmin')"
          >
            <UIcon name="i-heroicons-cog-6-tooth" class="w-4 h-4 mr-2" />
            Admin Panel
          </UButton>
          
          <UButton
            variant="soft"
            color="gray"
            class="hover:scale-105 transition-transform duration-200"
            @click="emit('logout')"
          >
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4 mr-2" />
            Logout
          </UButton>
        </div>
      </div>
    </div>
  </nav>
</template>