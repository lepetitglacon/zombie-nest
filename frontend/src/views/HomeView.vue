<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import api from '@/services/api'

import DashboardNavigation from '@/components/Home/DashboardNavigation.vue'
import StatsOverview from '@/components/Home/StatsOverview.vue'
import QuickPlaySection from '@/components/Home/QuickPlaySection.vue'
import MapsGrid from '@/components/Home/MapsGrid.vue'
import MatchHistory from '@/components/Home/MatchHistory.vue'
import ProfileSection from '@/components/Home/ProfileSection.vue'

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
  { key: 'play', slot: 'play', label: '🎯 Quick Play' },
  { key: 'maps', slot: 'maps', label: '🗺️ Browse Maps' },
  { key: 'history', slot: 'history', label: '📊 Match History' },
  { key: 'profile', slot: 'profile', label: '👤 Profile' }
]

onMounted(() => {
  loadMaps()
  stats.value.totalPlayers = 847
  stats.value.yourSessions = 23
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <DashboardNavigation
      :user-email="authStore.user?.email"
      @logout="logout"
      @go-to-admin="goToAdmin"
    />

    <StatsOverview :stats="stats" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <UTabs :items="tabs" class="w-full" default-value="play">
        <template #play>
          <div class="py-6">
            <QuickPlaySection
              @join-featured-map="joinFeaturedMap"
              @quick-match="quickMatch"
            />
          </div>
        </template>

        <template #maps>
          <div class="py-6">
            <MapsGrid
              :maps="maps"
              @play-map="playMap"
            />
          </div>
        </template>

        <template #history>
          <div class="py-6">
            <MatchHistory
              :matches="recentMatches"
              @view-all-matches="viewAllMatches"
            />
          </div>
        </template>

        <template #profile>
          <div class="py-6">
            <ProfileSection
              :user-email="authStore.user?.email"
              :stats="stats"
              @edit-profile="editProfile"
              @game-settings="gameSettings"
            />
          </div>
        </template>
      </UTabs>
    </div>
  </div>
</template>

