import { ref, onMounted, onUnmounted } from 'vue'
import RAPIER from '@dimforge/rapier3d-compat'

export function usePhysics() {
  const world = ref<RAPIER.World | null>(null)
  const isInitialized = ref(false)
  
  onMounted(async () => {
    await RAPIER.init()
    
    const gravity = { x: 0, y: -9.81, z: 0 }
    world.value = new RAPIER.World(gravity)
    isInitialized.value = true
  })
  
  onUnmounted(() => {
    if (world.value) {
      world.value.free()
    }
  })
  
  function step() {
    if (world.value) {
      world.value.step()
    }
  }
  
  function createRigidBody(bodyDesc: RAPIER.RigidBodyDesc) {
    if (world.value) {
      return world.value.createRigidBody(bodyDesc)
    }
    return null
  }
  
  function createCollider(colliderDesc: RAPIER.ColliderDesc, rigidBody?: RAPIER.RigidBody) {
    if (world.value) {
      if (rigidBody) {
        return world.value.createCollider(colliderDesc, rigidBody)
      }
      return world.value.createCollider(colliderDesc)
    }
    return null
  }
  
  return {
    world,
    isInitialized,
    step,
    createRigidBody,
    createCollider
  }
}