import { CollisionMesh, MapMetadata, SpawnPoint} from '@/map/interfaces/map.interface'
import AbstractDebris from "@/map/entities/debris.abstract.entity";
import {GLTF} from "node-three-gltf";
import RAPIER from "@dimforge/rapier3d-compat";

export default class GameMap {
    id: string;
    name: string;
    description: string = '';

    filePath: string;
    thumbnail: string | undefined;


    rawGltf: GLTF;
    playerSpawnPoints: SpawnPoint[];
    zombieSpawnPoints: SpawnPoint[];
    debris: AbstractDebris[];
    metadata?: MapMetadata | undefined;
    private world?: RAPIER.World;

    constructor(gltf: GLTF) {
        this.rawGltf = gltf;
        this.id = 'none';
        this.name = 'Default Map';
        this.filePath = '';
        this.playerSpawnPoints = [];
        this.zombieSpawnPoints = [];
        this.debris = [];
        this.metadata = undefined;
        this.world = undefined;
    }

    async init(world: RAPIER.World) {
        this.world = world;

        const scene = this.rawGltf.scene;
        const mapId = this.rawGltf.userData?.id?.replace(/\.(gltf|glb)$/, '') ?? 'none'

        // Parse spawn points and collision meshes from GLTF scene
        scene.traverse((child: any) => {
            switch (child.userData?.type) {
                case 'Spawner': {
                    this.zombieSpawnPoints.push({
                        id: child.name,
                        position: { x: child.position.x, y: child.position.y, z: child.position.z },
                        rotation: { x: child.rotation.x, y: child.rotation.y, z: child.rotation.z },
                        type: 'zombie',
                    })
                }
            }
        });
    }

}