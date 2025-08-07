import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from '@/database/schemas/player.schema';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
  ) {}

  async create(playerData: Partial<Player>): Promise<Player> {
    const createdPlayer = new this.playerModel(playerData);
    return createdPlayer.save();
  }

  async findById(id: string): Promise<Player | null> {
    return this.playerModel.findById(id).exec();
  }

  async findByUsername(username: string): Promise<Player | null> {
    return this.playerModel.findOne({ username }).exec();
  }

  async findByEmail(email: string): Promise<Player | null> {
    return this.playerModel.findOne({ email }).exec();
  }

  async updatePlayer(id: string, updateData: Partial<Player>): Promise<Player | null> {
    return this.playerModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async updateLastLogin(id: string): Promise<Player | null> {
    return this.playerModel
      .findByIdAndUpdate(id, { lastLogin: new Date() }, { new: true })
      .exec();
  }

  async updateStats(
    id: string,
    stats: {
      kills?: number;
      deaths?: number;
      score?: number;
      experience?: number;
      playTime?: number;
    },
  ): Promise<Player | null> {
    const updateFields: any = {};
    
    if (stats.kills !== undefined) {
      updateFields.$inc = { ...updateFields.$inc, totalKills: stats.kills };
    }
    if (stats.deaths !== undefined) {
      updateFields.$inc = { ...updateFields.$inc, totalDeaths: stats.deaths };
    }
    if (stats.score !== undefined) {
      updateFields.$inc = { ...updateFields.$inc, totalScore: stats.score };
    }
    if (stats.experience !== undefined) {
      updateFields.$inc = { ...updateFields.$inc, experience: stats.experience };
    }
    if (stats.playTime !== undefined) {
      updateFields.$inc = { ...updateFields.$inc, totalPlayTime: stats.playTime };
    }

    return this.playerModel
      .findByIdAndUpdate(id, updateFields, { new: true })
      .exec();
  }

  async updateGameState(id: string, gameState: Partial<Player['gameState']>): Promise<Player | null> {
    return this.playerModel
      .findByIdAndUpdate(
        id,
        { $set: { gameState } },
        { new: true }
      )
      .exec();
  }

  async updateSettings(id: string, settings: Partial<Player['settings']>): Promise<Player | null> {
    return this.playerModel
      .findByIdAndUpdate(
        id,
        { $set: { settings } },
        { new: true }
      )
      .exec();
  }

  async getLeaderboard(limit: number = 10): Promise<Player[]> {
    return this.playerModel
      .find()
      .sort({ totalScore: -1 })
      .limit(limit)
      .select('username level totalScore totalKills highestWave')
      .exec();
  }

  async getPlayerCount(): Promise<number> {
    return this.playerModel.countDocuments().exec();
  }
}