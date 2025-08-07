import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { MapModule } from '@/map/map.module';

@Module({
  imports: [MapModule],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}