import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {MapFactory} from "./factory/map.factory";
import GameMap from "@/map/entities/map.entity";

@Injectable()
export class MapService implements OnModuleInit {
  private readonly logger = new Logger(MapService.name);
  private maps: Map<string, GameMap> = new Map();
  private currentMap: GameMap | null = null;

  constructor(private readonly mapFactory: MapFactory) {}

  async onModuleInit() {
    this.maps = await this.mapFactory.loadAvailableMaps();

    if (this.maps.size > 0 && !this.currentMap) {
      const firstMapId = Array.from(this.maps.keys())[0];
      this.setCurrentMap(firstMapId);
      this.logger.log(`Set default map to: ${firstMapId}`);
    }
  }

  getMapList(): Partial<GameMap>[] {
    return Array.from(this.maps.values()).map(map => {
      return {
        id: map.id,
        name: map.name,
        description: map.description,
        thumbnail: map.thumbnail,
        // Add other fields as needed
      }
    });
  }

  getCurrentMap(): GameMap | null {
    return this.currentMap;
  }

  setCurrentMap(mapId: string): void {
    const map = this.maps.get(mapId);
    if (!map) {
      this.logger.warn(`Map with ID ${mapId} not found`);
      return;
    }
    this.currentMap = map;
    this.logger.log(`Current map set to: ${map.name}`);
  }
}