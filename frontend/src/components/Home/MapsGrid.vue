<script setup lang="ts">
interface Map {
  id: string
  name: string
  description?: string
}

interface Props {
  maps: Map[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  playMap: [mapId: string]
}>()

const getRandomPlayerCount = () => Math.floor(Math.random() * 50) + 1
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
        <UIcon name="i-heroicons-map" class="w-5 h-5 mr-2 text-blue-500" />
        Browse Maps
      </h2>
      <UButton variant="soft" color="gray" size="sm">
        <UIcon name="i-heroicons-funnel" class="w-4 h-4 mr-2" />
        Filter
      </UButton>
    </div>

    <div v-if="maps.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">🗺️</div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No maps available
      </h3>
      <p class="text-gray-500 dark:text-gray-400">
        No maps are currently available. Check back later!
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="map in maps"
        :key="map.id"
        class="hover:shadow-lg transition-all duration-200 hover:scale-105"
      >
        <template #header>
          <div class="flex items-center justify-center h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
            <div class="text-4xl">🗺️</div>
          </div>
        </template>

        <div class="space-y-3">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">
              {{ map.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ map.description || 'No description available' }}
            </p>
          </div>

          <div class="flex items-center justify-between text-sm">
            <UBadge color="blue" variant="soft">
              <UIcon name="i-heroicons-users" class="w-3 h-3 mr-1" />
              {{ getRandomPlayerCount() }} players
            </UBadge>
            <UBadge color="green" variant="soft">
              <UIcon name="i-heroicons-signal" class="w-3 h-3 mr-1" />
              Online
            </UBadge>
          </div>

          <UButton
            block
            color="primary"
            @click="emit('playMap', map.id)"
          >
            <UIcon name="i-heroicons-play" class="w-4 h-4 mr-2" />
            Play
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>