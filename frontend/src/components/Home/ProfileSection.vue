<script setup lang="ts">
import {computed} from "vue";

interface Props {
  userEmail?: string
  stats: {
    yourSessions: number
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  editProfile: []
  gameSettings: []
}>()

const profileStats = computed(() => [
  {
    label: 'Games Played',
    value: props.stats.yourSessions,
    icon: 'i-heroicons-play'
  },
  {
    label: 'Win Rate',
    value: '67%',
    icon: 'i-heroicons-trophy'
  },
  {
    label: 'Playtime',
    value: '45h 30m',
    icon: 'i-heroicons-clock'
  }
])
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Profile Card -->
    <UCard>
      <div class="flex items-center space-x-6">
        <UAvatar
          :alt="userEmail"
          size="3xl"
          :ui="{ background: 'bg-gradient-to-r from-blue-500 to-purple-600' }"
        >
          <UIcon name="i-heroicons-user" class="w-12 h-12 text-white" />
        </UAvatar>
        
        <div class="flex-1">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ userEmail }}
          </h2>
          <div class="flex items-center mt-2">
            <UBadge color="orange" variant="soft" size="lg">
              <UIcon name="i-heroicons-trophy" class="w-4 h-4 mr-2" />
              Rank: Survivor
            </UBadge>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Profile Stats -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Statistics
        </h3>
      </template>
      
      <div class="grid grid-cols-3 gap-6">
        <div
          v-for="stat in profileStats"
          :key="stat.label"
          class="text-center"
        >
          <div class="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-800 rounded-full">
            <UIcon :name="stat.icon" class="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ stat.value }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </UCard>

    <!-- Achievements -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Achievements
        </h3>
      </template>
      
      <div class="space-y-3">
        <div class="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <UIcon name="i-heroicons-star" class="w-4 h-4 text-white" />
          </div>
          <div>
            <div class="font-medium text-gray-900 dark:text-white">
              First Victory
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Won your first match
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <UIcon name="i-heroicons-bolt" class="w-4 h-4 text-white" />
          </div>
          <div>
            <div class="font-medium text-gray-900 dark:text-white">
              Speed Runner
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Completed a match in under 10 minutes
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Profile Actions -->
    <div class="flex space-x-4">
      <UButton
        color="primary"
        class="flex-1 hover:scale-105 hover:shadow-lg transition-all duration-200"
        @click="emit('editProfile')"
      >
        <UIcon name="i-heroicons-pencil" class="w-4 h-4 mr-2" />
        Edit Profile
      </UButton>
      
      <UButton
        variant="soft"
        color="gray"
        class="flex-1 hover:scale-105 hover:shadow-md transition-all duration-200"
        @click="emit('gameSettings')"
      >
        <UIcon name="i-heroicons-cog-6-tooth" class="w-4 h-4 mr-2" />
        Game Settings
      </UButton>
    </div>
  </div>
</template>