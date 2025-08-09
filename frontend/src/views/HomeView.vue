<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'radix-vue'
import api from '@/services/api'

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

onMounted(() => {
  loadMaps()
  // Simulate some stats
  stats.value.totalPlayers = 847
  stats.value.yourSessions = 23
})
</script>

<template>
  <div class="dashboard-container">
    <!-- Navigation Header -->
    <nav class="dashboard-nav">
      <div class="nav-content">
        <div class="nav-brand">
          <h1>Zombie Nest</h1>
        </div>
        <div class="nav-actions">
          <span class="user-welcome">Welcome, {{ authStore.user?.email }}</span>
          <button @click="() => router.push('/admin')" class="btn btn-admin">
            Admin Panel
          </button>
          <button @click="logout" class="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- Stats Overview -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{ stats.totalPlayers }}</h3>
            <p>Active Players</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🗺️</div>
          <div class="stat-content">
            <h3>{{ stats.activeMaps }}</h3>
            <p>Available Maps</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎮</div>
          <div class="stat-content">
            <h3>{{ stats.yourSessions }}</h3>
            <p>Your Sessions</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Content -->
    <div class="dashboard-main">
      <TabsRoot default-value="play" class="tabs-root">
        <TabsList class="tabs-list">
          <TabsTrigger value="play" class="tabs-trigger">
            🎯 Quick Play
          </TabsTrigger>
          <TabsTrigger value="maps" class="tabs-trigger">
            🗺️ Browse Maps
          </TabsTrigger>
          <TabsTrigger value="history" class="tabs-trigger">
            📊 Match History
          </TabsTrigger>
          <TabsTrigger value="profile" class="tabs-trigger">
            👤 Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="play" class="tabs-content">
          <div class="quick-play-section">
            <div class="featured-map">
              <div class="map-preview">
                <div class="map-image">🏞️</div>
                <div class="map-info">
                  <h3>Featured Map: Flora Square</h3>
                  <p>A lush forest environment perfect for survival gameplay. Face hordes of zombies while scavenging for resources.</p>
                  <div class="map-stats">
                    <span class="player-count">🔴 24 players online</span>
                    <span class="difficulty">⚡ Difficulty: Medium</span>
                  </div>
                </div>
              </div>
              <div class="play-actions">
                <RouterLink to="/games/flora-square" class="btn btn-play">
                  🚀 Join Now
                </RouterLink>
                <button class="btn btn-secondary">Quick Match</button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="maps" class="tabs-content">
          <div class="maps-grid">
            <div v-for="map in maps" :key="map.id" class="map-card">
              <div class="map-thumbnail">🗺️</div>
              <div class="map-details">
                <h4>{{ map.name }}</h4>
                <p class="map-description">{{ map.description || 'No description available' }}</p>
                <div class="map-meta">
                  <span class="players">👥 {{ Math.floor(Math.random() * 50) }} players</span>
                  <span class="status active">🟢 Online</span>
                </div>
                <RouterLink :to="`/games/${map.id}`" class="btn btn-small btn-primary">
                  Play
                </RouterLink>
              </div>
            </div>
            
            <div v-if="maps.length === 0" class="empty-state">
              <p>No maps available at the moment.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" class="tabs-content">
          <div class="match-history">
            <div class="section-header">
              <h3>Recent Matches</h3>
              <button class="btn btn-small btn-secondary">View All</button>
            </div>
            <div class="matches-list">
              <div v-for="match in recentMatches" :key="match.id" class="match-item">
                <div class="match-info">
                  <div class="match-map">{{ match.map }}</div>
                  <div class="match-meta">
                    <span class="duration">⏱️ {{ match.duration }}</span>
                    <span class="time">🕐 {{ match.time }}</span>
                  </div>
                </div>
                <div class="match-result" :class="match.result.toLowerCase()">
                  {{ match.result }}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="profile" class="tabs-content">
          <div class="profile-section">
            <div class="profile-card">
              <div class="profile-avatar">👤</div>
              <div class="profile-info">
                <h3>{{ authStore.user?.email }}</h3>
                <p class="profile-rank">🏆 Rank: Survivor</p>
                <div class="profile-stats">
                  <div class="profile-stat">
                    <span class="stat-label">Games Played</span>
                    <span class="stat-value">{{ stats.yourSessions }}</span>
                  </div>
                  <div class="profile-stat">
                    <span class="stat-label">Win Rate</span>
                    <span class="stat-value">67%</span>
                  </div>
                  <div class="profile-stat">
                    <span class="stat-label">Playtime</span>
                    <span class="stat-value">45h 30m</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="profile-actions">
              <button class="btn btn-primary">Edit Profile</button>
              <button class="btn btn-secondary">Game Settings</button>
            </div>
          </div>
        </TabsContent>
      </TabsRoot>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.dashboard-nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 0;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h1 {
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-welcome {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.stats-section {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.stat-icon {
  font-size: 2rem;
}

.stat-content h3 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.stat-content p {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

.dashboard-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 2rem 2rem;
}

.tabs-root {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1);
}

.tabs-list {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
}

.tabs-trigger {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 12px 12px 0 0;
}

.tabs-trigger[data-state="active"] {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  border-bottom: 2px solid #3b82f6;
}

.tabs-trigger:hover:not([data-state="active"]) {
  color: #475569;
  background: rgba(248, 250, 252, 0.8);
}

.tabs-content {
  padding: 2rem;
}

.quick-play-section {
  max-width: 800px;
  margin: 0 auto;
}

.featured-map {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
}

.map-preview {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.map-image {
  font-size: 4rem;
  background: linear-gradient(135deg, #34d399, #10b981);
  border-radius: 12px;
  padding: 2rem;
  color: white;
}

.map-info {
  flex: 1;
  text-align: left;
}

.map-info h3 {
  color: #1e293b;
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
}

.map-info p {
  color: #64748b;
  margin: 0 0 1rem 0;
}

.map-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
}

.play-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.maps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.map-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.map-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgb(0 0 0 / 0.15);
}

.map-thumbnail {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
}

.map-details h4 {
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.map-description {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
}

.map-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  margin-bottom: 1rem;
}

.status.active {
  color: #10b981;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  color: #64748b;
  padding: 2rem;
}

.match-history {
  max-width: 800px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  color: #1e293b;
  margin: 0;
}

.matches-list {
  space-y: 1rem;
}

.match-item {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.match-map {
  font-weight: 500;
  color: #1e293b;
}

.match-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #64748b;
}

.match-result {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.match-result.victory {
  background: #dcfce7;
  color: #166534;
}

.match-result.defeat {
  background: #fee2e2;
  color: #dc2626;
}

.profile-section {
  max-width: 600px;
  margin: 0 auto;
}

.profile-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.profile-avatar {
  font-size: 4rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-info h3 {
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.profile-rank {
  color: #d97706;
  font-weight: 500;
  margin: 0 0 1rem 0;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.profile-stat {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.stat-value {
  display: block;
  font-weight: 600;
  color: #1e293b;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Button Styles */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-admin {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.btn-admin:hover {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
}

.btn-play {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-size: 1rem;
  padding: 0.75rem 2rem;
}

.btn-play:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
}

.btn-small {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
}
</style>