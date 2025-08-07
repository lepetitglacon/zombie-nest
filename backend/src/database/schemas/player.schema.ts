import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema({ timestamps: true })
export class Player {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 0 })
  experience: number;

  @Prop({ default: 0 })
  totalKills: number;

  @Prop({ default: 0 })
  totalDeaths: number;

  @Prop({ default: 0 })
  totalScore: number;

  @Prop({ default: 0 })
  highestWave: number;

  @Prop({ default: 0 })
  totalPlayTime: number; // en secondes

  @Prop({ default: Date.now })
  lastLogin: Date;

  @Prop({
    type: {
      health: { type: Number, default: 100 },
      armor: { type: Number, default: 0 },
      weapons: [{
        name: String,
        ammo: Number,
        damage: Number,
        unlocked: { type: Boolean, default: false }
      }],
      powerups: [{
        name: String,
        duration: Number,
        active: { type: Boolean, default: false }
      }]
    },
    default: {
      health: 100,
      armor: 0,
      weapons: [],
      powerups: []
    }
  })
  gameState: {
    health: number;
    armor: number;
    weapons: Array<{
      name: string;
      ammo: number;
      damage: number;
      unlocked: boolean;
    }>;
    powerups: Array<{
      name: string;
      duration: number;
      active: boolean;
    }>;
  };

  @Prop({
    type: {
      sensitivity: { type: Number, default: 1.0 },
      volume: { type: Number, default: 0.8 },
      graphics: { type: String, default: 'medium' },
      keybindings: {
        type: Map,
        of: String,
        default: {
          forward: 'KeyW',
          backward: 'KeyS',
          left: 'KeyA',
          right: 'KeyD',
          jump: 'Space',
          reload: 'KeyR',
          shoot: 'Mouse0'
        }
      }
    },
    default: {
      sensitivity: 1.0,
      volume: 0.8,
      graphics: 'medium',
      keybindings: new Map([
        ['forward', 'KeyW'],
        ['backward', 'KeyS'],
        ['left', 'KeyA'],
        ['right', 'KeyD'],
        ['jump', 'Space'],
        ['reload', 'KeyR'],
        ['shoot', 'Mouse0']
      ])
    }
  })
  settings: {
    sensitivity: number;
    volume: number;
    graphics: string;
    keybindings: Map<string, string>;
  };
}

export const PlayerSchema = SchemaFactory.createForClass(Player);