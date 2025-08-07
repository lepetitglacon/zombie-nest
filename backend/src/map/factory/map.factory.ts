import {Injectable, Logger, OnModuleInit} from "@nestjs/common";
import {join} from "path";
import {GLTF, loadGltf} from "node-three-gltf";
import GameMap from "@/map/entities/map.entity";
import {promises as fs} from "fs";
import * as THREE from "three";
import {MapService} from "@/map/map.service";
import RAPIER from "@dimforge/rapier3d-compat";

@Injectable()
export class MapFactory {
    private readonly logger = new Logger(MapFactory.name);

    constructor(private readonly mapService: MapService) {
    }

    async loadAvailableMaps(): Promise<Map<string, GameMap>> {
        const maps = new Map<string, GameMap>();
        const mapsDirectory = join(process.cwd(), 'assets', 'maps');

        try {
            const files = await fs.readdir(mapsDirectory);
            const mapFiles = files.filter(file =>
                file.endsWith('.gltf') || file.endsWith('.glb')
            );

            if (mapFiles.length === 0) {
                this.logger.warn('No GLTF/GLB files found in maps directory');
            }

            this.logger.log(`Found ${mapFiles.length} map files to load`);

            for (const file of mapFiles) {
                const mapData = await this.parseMapDataFromFile(file)
                mapData.id = file.split(".")[0]
                mapData.filePath = file
                maps.set(mapData.id, mapData);
            }

            this.logger.log(`Successfully loaded ${maps.size} maps`);
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                this.logger.warn('Maps directory not found, creating assets/maps directory');
                await fs.mkdir(mapsDirectory, { recursive: true });
            } else {
                this.logger.error('Error accessing maps directory:', error);
            }
        }
        return maps
    }

    async parseMapDataFromFile(file: string): Promise<GameMap> {
        const filePath = join(process.cwd(), 'assets', 'maps', file);
        const gltf = await loadGltf(filePath);
        const gameMap = await this.parseMapData(gltf);

        this.logger.log(`Loaded map: ${gameMap.name}`);

        return gameMap;
    }

    async parseMapData(gltfMap: GLTF): Promise<GameMap> {
        const gameMap = new GameMap(gltfMap)
        this.logger.log(`Map ${gameMap.id}: loaded`);
        return gameMap

        // // Extract metadata from GLTF extras if available
        // const metadata = gltfMap?.json?.extras || {};
        // {
        //     id: mapId,
        //     name: metadata.name || mapId,
        //     filePath: mapId,
        //     metadata: {
        //         author: metadata.author,
        //         description: metadata.description,
        //         version: metadata.version || '1.0.0',
        //         maxPlayers: metadata.maxPlayers || 16,
        //         gameMode: metadata.gameMode || ['survival'],
        //     },
        // };
    }

}