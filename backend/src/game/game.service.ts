import {Injectable, OnModuleInit, OnModuleDestroy, Logger} from '@nestjs/common';
import RAPIER from '@dimforge/rapier3d-compat';
import { MapService } from '@/map/map.service';
import Game from "@/game/entities/game.entity";
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class GameService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(GameService.name);

  games: Map<string, Game> = new Map<string, Game>();

  constructor(
      private mapService: MapService,
      private eventEmitter: EventEmitter2
  ) {

  }

  async onModuleInit() {
    await RAPIER.init();
    this.logger.log('RAPIER initialized');
    await this.create()
  }

  onModuleDestroy() {

  }

  async create() {
    this.logger.log('Creating new game instance');
    const map = this.mapService.getCurrentMap()
    if (!map) {
      this.logger.error('No current map set, cannot create game instance');
      throw new Error('No current map set');
    }
    const game = new Game(map);
    await game.init();

    this.games.set(game.map.id, game);

    // Emit event instead of directly calling gateway
    this.eventEmitter.emit('game.init', {game});
    return game;
  }
}