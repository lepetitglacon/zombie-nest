import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GameSessionDocument = GameSession & Document;

@Schema({ timestamps: true })
export class GameSession {
  @Prop({ required: true })
  mapId: string;

  @Prop({ required: true })
  mapName: string;

  @Prop({ required: true })
  gameMode: string; // 'survival', 'waves', 'campaign', etc.

  @Prop({ default: 1 })
  currentWave: number;

  @Prop({ default: 'waiting' })
  status: string; // 'waiting', 'active', 'finished', 'paused'

  @Prop({ default: 0 })
  totalZombiesKilled: number;

  @Prop({ default: 0 })
  totalScore: number;

  @Prop({ default: Date.now })
  startTime: Date;

  @Prop()
  endTime: Date;

  @Prop({ default: 0 })
  duration: number; // en secondes

  @Prop({
    type: [{
      playerId: { type: Types.ObjectId, ref: 'Player' },
      username: String,
      kills: { type: Number, default: 0 },
      deaths: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
      joinTime: { type: Date, default: Date.now },
      leaveTime: Date,
      isActive: { type: Boolean, default: true }
    }],
    default: []
  })
  players: Array<{
    playerId: Types.ObjectId;
    username: string;
    kills: number;
    deaths: number;
    score: number;
    joinTime: Date;
    leaveTime?: Date;
    isActive: boolean;
  }>;

  @Prop({
    type: [{
      wave: Number,
      zombiesSpawned: Number,
      zombiesKilled: Number,
      startTime: Date,
      endTime: Date,
      completed: { type: Boolean, default: false }
    }],
    default: []
  })
  waveHistory: Array<{
    wave: number;
    zombiesSpawned: number;
    zombiesKilled: number;
    startTime: Date;
    endTime?: Date;
    completed: boolean;
  }>;

  @Prop({
    type: {
      maxPlayers: { type: Number, default: 4 },
      difficulty: { type: String, default: 'normal' },
      friendlyFire: { type: Boolean, default: false },
      infiniteAmmo: { type: Boolean, default: false },
      powerupsEnabled: { type: Boolean, default: true }
    },
    default: {
      maxPlayers: 4,
      difficulty: 'normal',
      friendlyFire: false,
      infiniteAmmo: false,
      powerupsEnabled: true
    }
  })
  gameSettings: {
    maxPlayers: number;
    difficulty: string;
    friendlyFire: boolean;
    infiniteAmmo: boolean;
    powerupsEnabled: boolean;
  };
}

export const GameSessionSchema = SchemaFactory.createForClass(GameSession);