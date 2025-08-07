import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MapStatsDocument = MapStats & Document;

@Schema({ timestamps: true })
export class MapStats {
  @Prop({ required: true, unique: true })
  mapId: string;

  @Prop({ required: true })
  mapName: string;

  @Prop({ default: 0 })
  totalPlays: number;

  @Prop({ default: 0 })
  totalPlayTime: number; // en secondes

  @Prop({ default: 0 })
  averageWave: number;

  @Prop({ default: 0 })
  highestWave: number;

  @Prop({ default: 0 })
  totalZombiesKilled: number;

  @Prop({ default: 0 })
  averageScore: number;

  @Prop({ default: 0 })
  highestScore: number;

  @Prop({ default: 5.0 })
  rating: number; // Note moyenne sur 5

  @Prop({ default: 0 })
  ratingCount: number;

  @Prop({
    type: [{
      playerId: String,
      username: String,
      bestWave: Number,
      bestScore: Number,
      totalKills: Number,
      playCount: Number,
      lastPlayed: Date
    }],
    default: []
  })
  playerStats: Array<{
    playerId: string;
    username: string;
    bestWave: number;
    bestScore: number;
    totalKills: number;
    playCount: number;
    lastPlayed: Date;
  }>;

  @Prop({
    type: [{
      difficulty: String,
      averageWave: Number,
      highestWave: Number,
      averageScore: Number,
      playCount: Number
    }],
    default: []
  })
  difficultyStats: Array<{
    difficulty: string;
    averageWave: number;
    highestWave: number;
    averageScore: number;
    playCount: number;
  }>;
}

export const MapStatsSchema = SchemaFactory.createForClass(MapStats);