<script setup lang="ts">
import { ref } from 'vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  TagsInputRoot,
  TagsInputInput,
  TagsInputItem, TagsInputItemDelete, TagsInputItemText
} from 'radix-vue'
import api from '@/services/api'

interface Props {
  open?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'map-created'): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false
})

const emit = defineEmits<Emits>()

const form = ref<{
  name: string,
  description: string,
  tags: string[],
  isActive: boolean,
}>({
  name: '',
  description: '',
  tags: [],
  isActive: true,
})

const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement>()
const loading = ref(false)
const error = ref('')
const dragOver = ref(false)

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    handleFile(target.files[0])
  }
}

const handleFile = (file: File) => {
  // Validate file type
  if (!file.name.toLowerCase().endsWith('.glb') && !file.name.toLowerCase().endsWith('.gltf')) {
    error.value = 'Please select a GLB or GLTF file'
    return
  }

  // Validate file size (50MB)
  if (file.size > 50 * 1024 * 1024) {
    error.value = 'File size must be less than 50MB'
    return
  }

  selectedFile.value = file
  error.value = ''
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  dragOver.value = false
  
  const files = event.dataTransfer?.files
  if (files && files[0]) {
    handleFile(files[0])
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  dragOver.value = true
}

const handleDragLeave = () => {
  dragOver.value = false
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleSubmit = async () => {
  error.value = ''

  // Validation
  if (!form.value.name.trim()) {
    error.value = 'Map name is required'
    return
  }

  if (!selectedFile.value) {
    error.value = 'Please select a GLB/GLTF file'
    return
  }

  loading.value = true

  try {
    const formData = new FormData()
    formData.append('name', form.value.name.trim())
    formData.append('description', form.value.description.trim())
    formData.append('isActive', form.value.isActive.toString())
    
    // Process tags
    const tags = form.value.tags
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
    
    formData.append('tags', JSON.stringify(tags))
    formData.append('file', selectedFile.value)

    await api.post('/maps', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    // Reset form
    form.value = {
      name: '',
      description: '',
      tags: [],
      isActive: true,
    }
    selectedFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }

    emit('map-created')
    emit('update:open', false)
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Failed to create map'
  } finally {
    loading.value = false
  }
}

const handleOpenChange = (open: boolean) => {
  emit('update:open', open)
}
</script>

<template>
  <DialogRoot :open="props.open" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent class="dialog-content">
        <DialogTitle class="dialog-title">
          Add New Map
        </DialogTitle>
        <DialogDescription class="dialog-description">
          Upload a new GLB/GLTF map file and set its properties.
        </DialogDescription>

        <form @submit.prevent="handleSubmit" class="form">
          <!-- Map Name -->
          <div class="form-group">
            <label for="name" class="label">Map Name *</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              :disabled="loading"
              placeholder="Enter map name"
              class="input"
            />
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="description" class="label">Description</label>
            <textarea
              id="description"
              v-model="form.description"
              :disabled="loading"
              placeholder="Enter map description (optional)"
              rows="3"
              class="textarea"
            />
          </div>

          <!-- Tags -->
          <TagsInputRoot
              v-model="form.tags"
              id="tags"
              class="form-group"
          >
            <label for="tags" class="label">Tags</label>
            <div style="display: flex; align-items: center; justify-content: start; gap: 8px">
              <TagsInputItem
                  v-for="item in form.tags"
                  :key="item"
                  :value="item"
                  class="tag"
                  style="padding: 8px; border-radius: 4px"
              >
                <TagsInputItemText style="padding-right: 4px" />
                <TagsInputItemDelete class="tag-delete">
                  X
                </TagsInputItemDelete>
              </TagsInputItem>
            </div>
            <TagsInputInput
                class="input"
                placeholder="Enter tags separated by commas (e.g., survival, pvp, forest)"
            />
          </TagsInputRoot>

          <!-- File Upload -->
          <div class="form-group">
            <label class="label">Map File (GLB/GLTF) *</label>
            <div
              class="file-drop-zone"
              :class="{ 'drag-over': dragOver, 'has-file': selectedFile }"
              @drop="handleDrop"
              @dragover="handleDragOver"
              @dragleave="handleDragLeave"
              @click="fileInput?.click()"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".glb,.gltf"
                @change="handleFileSelect"
                class="file-input"
              />
              
              <div v-if="!selectedFile" class="file-drop-content">
                <div class="file-drop-icon">📁</div>
                <p class="file-drop-text">
                  <strong>Click to select</strong> or drag and drop your GLB/GLTF file here
                </p>
                <p class="file-drop-subtext">Maximum file size: 50MB</p>
              </div>

              <div v-else class="selected-file">
                <div class="file-info">
                  <div class="file-icon">📦</div>
                  <div class="file-details">
                    <p class="file-name">{{ selectedFile.name }}</p>
                    <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
                  </div>
                </div>
                <button
                  type="button"
                  @click.stop="removeFile"
                  class="remove-file-btn"
                  :disabled="loading"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- Active Status -->
          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="form.isActive"
                type="checkbox"
                :disabled="loading"
                class="checkbox"
              />
              <span class="checkbox-text">Active (visible to players)</span>
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <DialogClose as-child>
              <button type="button" class="btn btn-secondary" :disabled="loading">
                Cancel
              </button>
            </DialogClose>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Creating...' : 'Create Map' }}
            </button>
          </div>
        </form>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.dialog-overlay {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
  z-index: 50;
}

.dialog-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 500px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 2rem;
  z-index: 50;
}

.dialog-title {
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.dialog-description {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 1.5rem 0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

.input,
.textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus,
.textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.input:disabled,
.textarea:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
  opacity: 0.5;
}

.help-text {
  color: #64748b;
  font-size: 0.75rem;
  margin: 0;
}

.file-drop-zone {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.file-drop-zone:hover {
  border-color: #3b82f6;
  background-color: #f8fafc;
}

.file-drop-zone.drag-over {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.file-drop-zone.has-file {
  border-color: #10b981;
  background-color: #f0fdf4;
}

.file-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-drop-content {
  pointer-events: none;
}

.file-drop-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.file-drop-text {
  color: #374151;
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
}

.file-drop-subtext {
  color: #64748b;
  font-size: 0.75rem;
  margin: 0;
}

.selected-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-icon {
  font-size: 2rem;
}

.file-details {
  text-align: left;
}

.file-name {
  color: #1e293b;
  font-weight: 500;
  font-size: 0.875rem;
  margin: 0 0 0.25rem 0;
}

.file-size {
  color: #64748b;
  font-size: 0.75rem;
  margin: 0;
}

.remove-file-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.remove-file-btn:hover:not(:disabled) {
  background: #dc2626;
}

.remove-file-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox {
  width: 1rem;
  height: 1rem;
}

.checkbox-text {
  color: #374151;
  font-size: 0.875rem;
}

.error-message {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #fecaca;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.tag {
  color: white;
  display: inline-flex;
  align-items: center;
  background: #3b82f6;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 4px;
  font-size: 0.875rem;
}
.tag-delete {
  color: white;
  border-radius: 4px;
  border: none;
  background: #3b82f6;
}
.tag-delete:hover {
  background: #2563eb;
}
</style>