export interface MapData {
  id: string;
  name: string;
  filePath: string;
  spawnPoints: SpawnPoint[];
  collisionMeshes: CollisionMesh[];
  metadata?: MapMetadata;
}

export interface SpawnPoint {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  type: 'player' | 'zombie' | 'item';
}

export interface CollisionMesh {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  geometry: {
    type: 'box' | 'sphere' | 'capsule' | 'trimesh';
    parameters: number[];
  };
}

export interface MapMetadata {
  author?: string;
  description?: string;
  version?: string;
  maxPlayers?: number;
  gameMode?: string[];
}