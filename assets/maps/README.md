# Maps Directory

Place your GLTF (.gltf) or GLB (.glb) map files in this directory.

## Map Naming Conventions

### Spawn Points
Name objects in your 3D modeling software (Blender, Maya, etc.) using these prefixes:
- `spawn_player_01` - Player spawn point
- `spawn_zombie_01` - Zombie spawn point  
- `spawn_item_01` - Item spawn point

### Collision Meshes
Name collision objects with the `collision_` prefix:
- `collision_wall_01` - Wall collision
- `collision_floor_01` - Floor collision
- `collision_object_01` - Generic collision object

## Map Metadata (Optional)

Add metadata to your GLTF file's extras field:

```json
{
  "extras": {
    "name": "Warehouse",
    "author": "YourName",
    "description": "A zombie survival warehouse map",
    "version": "1.0.0",
    "maxPlayers": 8,
    "gameMode": ["survival", "waves"]
  }
}
```

## Supported Collision Types

The map service automatically detects collision geometry types:
- **Box** - Simple box colliders for walls, floors
- **Sphere** - Ball colliders for round objects  
- **Capsule** - Pill-shaped colliders for columns
- **Trimesh** - Complex mesh colliders for detailed geometry

## Example Map Structure

```
warehouse.gltf
├── Scene
│   ├── spawn_player_01 (Empty/Locator)
│   ├── spawn_player_02 (Empty/Locator)
│   ├── spawn_zombie_01 (Empty/Locator)
│   ├── collision_walls (Mesh)
│   ├── collision_floor (Mesh)
│   └── visual_geometry (Mesh - not processed)
```