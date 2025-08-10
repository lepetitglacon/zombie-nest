<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'radix-vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const authStore = useAuthStore()
const router = useRouter()

const stats = ref({
  totalUsers: 245,
  totalMaps: 12,
  activeSessions: 89,
  serverUptime: '7d 14h 32m'
})

const recentActivity = ref([
  { id: 1, action: 'User registered', user: 'john@example.com', time: '2 min ago' },
  { id: 2, action: 'Map created', user: 'admin@example.com', time: '15 min ago' },
  { id: 3, action: 'Game session started', user: 'player1@example.com', time: '1h ago' },
  { id: 4, action: 'User login', user: 'jane@example.com', time: '2h ago' }
])

const users = ref([
  { id: 1, email: 'john@example.com', createdAt: '2024-01-15', status: 'active' },
  { id: 2, email: 'jane@example.com', createdAt: '2024-01-20', status: 'active' },
  { id: 3, email: 'bob@example.com', createdAt: '2024-01-22', status: 'inactive' }
])

const showAddMapModal = ref(false)
const mapsList = ref([])
const loading = ref(false)

const loadMaps = async () => {
  try {
    loading.value = true
    const response = await api.get('/maps?includeInactive=true')
    mapsList.value = response.data
  } catch (error) {
    console.error('Error loading maps:', error)
  } finally {
    loading.value = false
  }
}

const toggleMapStatus = async (map: any) => {
  try {
    if (map.isActive) {
      await api.post(`/maps/${map._id}/deactivate`)
    } else {
      await api.post(`/maps/${map._id}/activate`)
    }
    await loadMaps()
  } catch (error) {
    console.error('Error toggling map status:', error)
  }
}

const deleteMap = async (map: any) => {
  if (confirm(`Are you sure you want to delete "${map.name}"? This action cannot be undone.`)) {
    try {
      await api.delete(`/maps/${map._id}`)
      await loadMaps()
    } catch (error) {
      console.error('Error deleting map:', error)
    }
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  loadMaps()
})
</script>

<template>
  <div class="admin-container">
    <!-- Header -->
    <header class="admin-header">
      <div class="header-content">
        <h1>Admin Dashboard</h1>
        <div class="header-actions">
          <span class="user-info">{{ authStore.user?.email }}</span>
          <button @click="() => router.push('/')" class="btn btn-secondary">
            Back to Game
          </button>
          <button @click="logout" class="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Users</h3>
        <p class="stat-number">{{ stats.totalUsers }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Maps</h3>
        <p class="stat-number">{{ stats.totalMaps }}</p>
      </div>
      <div class="stat-card">
        <h3>Active Sessions</h3>
        <p class="stat-number">{{ stats.activeSessions }}</p>
      </div>
      <div class="stat-card">
        <h3>Server Uptime</h3>
        <p class="stat-number">{{ stats.serverUptime }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="admin-content">
      <TabsRoot default-value="users" class="tabs-root">
        <TabsList class="tabs-list">
          <TabsTrigger value="users" class="tabs-trigger">
            Users
          </TabsTrigger>
          <TabsTrigger value="maps" class="tabs-trigger">
            Maps
          </TabsTrigger>
          <TabsTrigger value="activity" class="tabs-trigger">
            Recent Activity
          </TabsTrigger>
          <TabsTrigger value="settings" class="tabs-trigger">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" class="tabs-content">
          <div class="content-section">
            <div class="section-header">
              <h2>User Management</h2>
              <button class="btn btn-primary">Add User</button>
            </div>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Created At</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.createdAt }}</td>
                    <td>
                      <span :class="`status ${user.status}`">
                        {{ user.status }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-secondary">Edit</button>
                      <button class="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="maps" class="tabs-content">
          <div class="content-section">
            <div class="section-header">
              <h2>Map Management</h2>
              <button @click="showAddMapModal = true" class="btn btn-primary">Add Map</button>
            </div>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Tags</th>
                    <th>File Size</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="map in mapsList" :key="map._id || map.id">
                    <td>{{ map.name }}</td>
                    <td>
                      <div class="tags-container">
                        <span v-for="tag in map.tags" :key="tag" class="tag">
                          {{ tag }}
                        </span>
                      </div>
                    </td>
                    <td>{{ formatFileSize(map.fileSize || 0) }}</td>
                    <td>
                      <span :class="`status ${map.isActive ? 'active' : 'inactive'}`">
                        {{ map.isActive ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td>{{ formatDate(map.createdAt) }}</td>
                    <td>
                      <button 
                        @click="toggleMapStatus(map)"
                        :class="`btn btn-sm ${map.isActive ? 'btn-warning' : 'btn-success'}`"
                      >
                        {{ map.isActive ? 'Deactivate' : 'Activate' }}
                      </button>
                      <button @click="deleteMap(map)" class="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="mapsList.length === 0" class="empty-state">
                <p>No maps found. <button @click="showAddMapModal = true" class="link-button">Add your first map</button></p>
              </div>
            </div>
          </div>

          <!-- Add Map Modal -->
          <AddMapModal
            v-model:open="showAddMapModal" 
            @map-created="loadMaps"
          />
        </TabsContent>

        <TabsContent value="activity" class="tabs-content">
          <div class="content-section">
            <h2>Recent Activity</h2>
            <div class="activity-list">
              <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
                <div class="activity-info">
                  <strong>{{ activity.action }}</strong>
                  <span class="activity-user">{{ activity.user }}</span>
                </div>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" class="tabs-content">
          <div class="content-section">
            <h2>Server Settings</h2>
            <div class="settings-grid">
              <div class="setting-item">
                <label>Max Players per Map</label>
                <input type="number" value="50" class="setting-input" />
              </div>
              <div class="setting-item">
                <label>Session Timeout (minutes)</label>
                <input type="number" value="30" class="setting-input" />
              </div>
              <div class="setting-item">
                <label>Enable Registration</label>
                <input type="checkbox" checked class="setting-checkbox" />
              </div>
              <div class="setting-item">
                <label>Maintenance Mode</label>
                <input type="checkbox" class="setting-checkbox" />
              </div>
            </div>
            <button class="btn btn-primary">Save Settings</button>
          </div>
        </TabsContent>
      </TabsRoot>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  min-height: 100vh;
  background-color: #f8fafc;
}

.admin-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header-content h1 {
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  color: #64748b;
  font-size: 0.875rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.stat-card h3 {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.stat-number {
  color: #1e293b;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.admin-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 2rem 2rem;
}

.tabs-root {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
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
}

.tabs-trigger[data-state="active"] {
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
}

.tabs-trigger:hover:not([data-state="active"]) {
  color: #475569;
  background-color: #f8fafc;
}

.tabs-content {
  padding: 2rem;
}

.content-section h2 {
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.data-table th {
  background-color: #f8fafc;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.data-table td {
  color: #1e293b;
  font-size: 0.875rem;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status.active {
  background-color: #dcfce7;
  color: #166534;
}

.status.inactive {
  background-color: #fee2e2;
  color: #dc2626;
}

.status.maintenance {
  background-color: #fef3c7;
  color: #d97706;
}

.activity-list {
  space-y: 1rem;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.activity-user {
  color: #64748b;
  font-size: 0.875rem;
}

.activity-time {
  color: #64748b;
  font-size: 0.875rem;
}

.settings-grid {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-item label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.setting-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
}

.setting-checkbox {
  width: 1rem;
  height: 1rem;
}

/* Button Styles */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-danger {
  background-color: #dc2626;
  color: white;
}

.btn-danger:hover {
  background-color: #b91c1c;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  margin-right: 0.5rem;
}

.btn-sm:last-child {
  margin-right: 0;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tag {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

.link-button {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  text-decoration: underline;
}

.link-button:hover {
  color: #2563eb;
}

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-success:hover {
  background-color: #059669;
}

.btn-warning {
  background-color: #f59e0b;
  color: white;
}

.btn-warning:hover {
  background-color: #d97706;
}
</style>