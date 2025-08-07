import { Module } from '@nestjs/common';
import { GameModule } from '@/game/game.module';
import { WebsocketModule } from '@/websocket/websocket.module';
import { MapModule } from '@/map/map.module';
import {join} from "path";
import {ServeStaticModule} from "@nestjs/serve-static";
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '@/database/database.module';
import { PlayerModule } from '@/player/player.module';
import { GameSessionModule } from '@/game-session/game-session.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/zombie-nest'),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    PlayerModule,
    GameSessionModule,
    GameModule,
    WebsocketModule,
    MapModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets'),
      serveRoot: '/assets'
    }),
  ],
})
export class AppModule {}