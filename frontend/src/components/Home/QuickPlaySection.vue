<script setup lang="ts">
const emit = defineEmits<{
  joinFeaturedMap: []
  quickMatch: []
}>()

const featuredMap = {
  name: 'Flora Square',
  description: 'A lush forest environment perfect for survival gameplay. Face hordes of zombies while scavenging for resources.',
  playersOnline: 24,
  difficulty: 'Medium'
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <UCard class="overflow-hidden">
      <template #header>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <UIcon name="i-heroicons-bolt" class="w-5 h-5 mr-2 text-yellow-500" />
          Quick Play
        </h2>
      </template>
      
      <div class="space-y-6">
        <!-- Featured Map -->
        <div class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6">
          <div class="flex items-start space-x-6">
            <div class="flex-shrink-0">
              <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-3xl">
                🏞️
              </div>
            </div>
            
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Featured Map: {{ featuredMap.name }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ featuredMap.description }}
              </p>
              
              <div class="flex items-center space-x-4 text-sm">
                <UBadge color="red" variant="soft">
                  <UIcon name="i-heroicons-signal" class="w-3 h-3 mr-1" />
                  {{ featuredMap.playersOnline }} players online
                </UBadge>
                <UBadge color="yellow" variant="soft">
                  <UIcon name="i-heroicons-bolt" class="w-3 h-3 mr-1" />
                  Difficulty: {{ featuredMap.difficulty }}
                </UBadge>
              </div>
            </div>
          </div>
          
          <div class="flex space-x-3 mt-6">
            <UButton
              size="lg"
              color="green"
              @click="emit('joinFeaturedMap')"
              class="flex-1 sm:flex-none hover:scale-105 hover:shadow-lg transition-all duration-200"
            >
              <UIcon name="i-heroicons-rocket-launch" class="w-4 h-4 mr-2" />
              Join Now
            </UButton>
            
            <UButton
              size="lg"
              variant="soft"
              color="gray"
              @click="emit('quickMatch')"
              class="flex-1 sm:flex-none hover:scale-105 hover:shadow-md transition-all duration-200"
            >
              <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 mr-2" />
              Quick Match
            </UButton>
          </div>
        </div>
        
        <!-- Quick Stats -->
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              4.2/5
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Community Rating
            </div>
          </div>
          
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ~15min
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Average Match
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>