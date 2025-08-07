import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from './schemas/player.schema';
import { GameSession, GameSessionSchema } from './schemas/game-session.schema';
import { MapStats, MapStatsSchema } from './schemas/map-stats.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: GameSession.name, schema: GameSessionSchema },
      { name: MapStats.name, schema: MapStatsSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}