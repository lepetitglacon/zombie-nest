<script setup lang="ts">
import {computed} from "vue";

interface StatItem {
  icon: string
  value: number
  label: string
  color?: string
}

interface Props {
  stats: {
    totalPlayers: number
    activeMaps: number
    yourSessions: number
  }
}

const props = defineProps<Props>()

const statItems = computed<StatItem[]>(() => [
  {
    icon: 'i-heroicons-users',
    value: props.stats.totalPlayers,
    label: 'Active Players',
    color: 'blue'
  },
  {
    icon: 'i-heroicons-map',
    value: props.stats.activeMaps,
    label: 'Available Maps',
    color: 'green'
  },
  {
    icon: 'i-heroicons-play',
    value: props.stats.yourSessions,
    label: 'Your Sessions',
    color: 'purple'
  }
])
</script>

<template>
  <div class="px-4 py-8 max-w-7xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard
        v-for="stat in statItems"
        :key="stat.label"
        class="hover:shadow-lg transition-shadow duration-200"
      >
        <div class="flex items-center space-x-4">
          <div :class="`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`">
            <UIcon 
              :name="stat.icon" 
              :class="`w-8 h-8 text-${stat.color}-600 dark:text-${stat.color}-400`"
            />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ stat.value.toLocaleString() }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ stat.label }}
            </p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>