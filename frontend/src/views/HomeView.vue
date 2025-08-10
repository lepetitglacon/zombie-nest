<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useAuthStore } from '@/stores/authStore'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

import DashboardNavigation from '@/components/Home/DashboardNavigation.vue'
import StatsOverview from '@/components/Home/StatsOverview.vue'
import QuickPlaySection from '@/components/Home/QuickPlaySection.vue'
import RoomsList from '@/components/Home/RoomsList.vue'
import MatchHistory from '@/components/Home/MatchHistory.vue'
import ProfileSection from '@/components/Home/ProfileSection.vue'
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger
} from 'radix-vue'

const authStore = useAuthStore()
const router = useRouter()

const maps = ref([])
const stats = ref({
  totalPlayers: 0,
  activeMaps: 0,
  yourSessions: 0
})

const recentMatches = ref([
  { id: 1, map: 'Flora Square', duration: '25m 30s', result: 'Victory', time: '2 hours ago' },
  { id: 2, map: 'Urban Ruins', duration: '18m 45s', result: 'Defeat', time: '1 day ago' },
  { id: 3, map: 'Forest Base', duration: '32m 12s', result: 'Victory', time: '2 days ago' }
])

const loadMaps = async () => {
  try {
    const response = await api.get('/maps/available')
    maps.value = response.data
    stats.value.activeMaps = response.data.length
  } catch (error) {
    console.error('Error fetching maps:', error)
  }
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

const goToAdmin = () => {
  router.push('/admin')
}

const joinFeaturedMap = () => {
  router.push('/games/flora-square')
}

const quickMatch = () => {
  console.log('Quick match functionality')
}

const playMap = (mapId: string) => {
  router.push(`/games/${mapId}`)
}

const viewAllMatches = () => {
  console.log('View all matches functionality')
}

const editProfile = () => {
  console.log('Edit profile functionality')
}

const gameSettings = () => {
  console.log('Game settings functionality')
}


const tabs = [
  { key: 'play', label: '🎯 Quick Play' },
  { key: 'rooms', label: '🏠 Browse Rooms' },
  { key: 'history', label: '📊 Match History' },
  { key: 'profile', label: '👤 Profile' }
]

// Get active tab from URL query parameter
const route = useRoute()
const activeTab = computed(() => {
  const tab = route.query.tab as string
  return tabs.find(t => t.key === tab)?.key || 'play'
})

// Update URL when tab changes
const handleTabChange = (tabKey: string) => {
  router.push({ 
    name: 'home', 
    query: { 
      ...route.query, 
      tab: tabKey 
    } 
  })
}

onMounted(() => {
  loadMaps()
  stats.value.totalPlayers = 847
  stats.value.yourSessions = 23
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">


    <StatsOverview :stats="stats" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <TabsRoot 
        :default-value="activeTab" 
        :model-value="activeTab"
        @update:model-value="handleTabChange"
        class="w-full"
      >
        <!-- Tabs List -->
        <TabsList class="grid w-full grid-cols-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-gray-200 dark:border-gray-700">
          <TabsTrigger 
            v-for="tab in tabs" 
            :key="tab.key"
            :value="tab.key"
            class="flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 dark:data-[state=inactive]:text-gray-400 dark:data-[state=inactive]:hover:text-gray-100 data-[state=inactive]:hover:bg-gray-100 dark:data-[state=inactive]:hover:bg-gray-700"
          >
            {{ tab.label }}
          </TabsTrigger>
        </TabsList>

        <!-- Tabs Content -->
        <div class="mt-6">
          <TabsContent value="play" class="focus:outline-none">
            <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <QuickPlaySection
                :maps="maps"
                @join-featured-map="joinFeaturedMap"
                @quick-match="quickMatch"
              />
            </div>
          </TabsContent>

          <TabsContent value="rooms" class="focus:outline-none">
            <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <RoomsList />
            </div>
          </TabsContent>

          <TabsContent value="history" class="focus:outline-none">
            <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <MatchHistory
                :matches="recentMatches"
                @view-all-matches="viewAllMatches"
              />
            </div>
          </TabsContent>

          <TabsContent value="profile" class="focus:outline-none">
            <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <ProfileSection
                :user-email="authStore.user?.email"
                :stats="stats"
                @edit-profile="editProfile"
                @game-settings="gameSettings"
              />
            </div>
          </TabsContent>
        </div>
      </TabsRoot>
    </div>
  </div>
</template>

