<script setup lang="ts">
interface Match {
  id: number
  map: string
  duration: string
  result: 'Victory' | 'Defeat'
  time: string
}

interface Props {
  matches: Match[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  viewAllMatches: []
}>()

const getResultColor = (result: string) => {
  return result === 'Victory' ? 'green' : 'red'
}

const getResultIcon = (result: string) => {
  return result === 'Victory' ? 'i-heroicons-trophy' : 'i-heroicons-x-circle'
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
        <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 mr-2 text-purple-500" />
        Match History
      </h2>
      <UButton
        variant="soft"
        color="gray"
        size="sm"
        @click="emit('viewAllMatches')"
      >
        View All
      </UButton>
    </div>

    <div v-if="matches.length === 0" class="text-center py-8">
      <div class="text-4xl mb-4">📊</div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No matches yet
      </h3>
      <p class="text-gray-500 dark:text-gray-400">
        Your match history will appear here after you play some games.
      </p>
    </div>

    <div v-else class="space-y-3">
      <UCard
        v-for="match in matches"
        :key="match.id"
        class="hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3">
              <div class="font-medium text-gray-900 dark:text-white">
                {{ match.map }}
              </div>
              <UBadge
                :color="getResultColor(match.result)"
                variant="soft"
              >
                <UIcon :name="getResultIcon(match.result)" class="w-3 h-3 mr-1" />
                {{ match.result }}
              </UBadge>
            </div>
            
            <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center">
                <UIcon name="i-heroicons-clock" class="w-4 h-4 mr-1" />
                {{ match.duration }}
              </div>
              <div class="flex items-center">
                <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-1" />
                {{ match.time }}
              </div>
            </div>
          </div>
          
          <UButton variant="ghost" size="sm" color="gray">
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>