<script setup lang="ts">
import { ref } from 'vue'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'radix-vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

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

const maps = ref([
  { id: 1, name: 'Flora Square', type: 'survival', players: 24, status: 'active' },
  { id: 2, name: 'Urban Ruins', type: 'pvp', players: 12, status: 'active' },
  { id: 3, name: 'Forest Base', type: 'exploration', players: 8, status: 'maintenance' }
])

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
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
              <button class="btn btn-primary">Add Map</button>
            </div>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Players</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="map in maps" :key="map.id">
                    <td>{{ map.id }}</td>
                    <td>{{ map.name }}</td>
                    <td>{{ map.type }}</td>
                    <td>{{ map.players }}</td>
                    <td>
                      <span :class="`status ${map.status}`">
                        {{ map.status }}
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
</style>