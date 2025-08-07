import { Module } from '@nestjs/common';
import { GameSessionService } from './game-session.service';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [GameSessionService],
  exports: [GameSessionService],
})
export class GameSessionModule {}