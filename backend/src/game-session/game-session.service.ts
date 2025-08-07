import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameSession, GameSessionDocument } from '@/database/schemas/game-session.schema';

@Injectable()
export class GameSessionService {
  constructor(
    @InjectModel(GameSession.name) private gameSessionModel: Model<GameSessionDocument>,
  ) {}

  async createSession(sessionData: Partial<GameSession>): Promise<GameSession> {
    const createdSession = new this.gameSessionModel({
      ...sessionData,
      status: 'waiting',
      startTime: new Date(),
    });
    return createdSession.save();
  }

  async findById(id: string): Promise<GameSession | null> {
    return this.gameSessionModel.findById(id).populate('players.playerId').exec();
  }

  async findActiveSessionForMap(mapId: string): Promise<GameSession | null> {
    return this.gameSessionModel
      .findOne({ mapId, status: { $in: ['waiting', 'active'] } })
      .populate('players.playerId')
      .exec();
  }

  async addPlayerToSession(
    sessionId: string,
    playerId: string,
    username: string,
  ): Promise<GameSession | null> {
    return this.gameSessionModel
      .findByIdAndUpdate(
        sessionId,
        {
          $push: {
            players: {
              playerId,
              username,
              joinTime: new Date(),
              isActive: true,
            },
          },
        },
        { new: true }
      )
      .populate('players.playerId')
      .exec();
  }

  async removePlayerFromSession(
    sessionId: string,
    playerId: string,
  ): Promise<GameSession | null> {
    return this.gameSessionModel
      .findByIdAndUpdate(
        sessionId,
        {
          $set: {
            'players.$[elem].isActive': false,
            'players.$[elem].leaveTime': new Date(),
          },
        },
        {
          arrayFilters: [{ 'elem.playerId': playerId }],
          new: true,
        }
      )
      .populate('players.playerId')
      .exec();
  }

  async updatePlayerStats(
    sessionId: string,
    playerId: string,
    stats: { kills?: number; deaths?: number; score?: number },
  ): Promise<GameSession | null> {
    const updateFields: any = {};
    
    if (stats.kills !== undefined) {
      updateFields['players.$[elem].kills'] = stats.kills;
    }
    if (stats.deaths !== undefined) {
      updateFields['players.$[elem].deaths'] = stats.deaths;
    }
    if (stats.score !== undefined) {
      updateFields['players.$[elem].score'] = stats.score;
    }

    return this.gameSessionModel
      .findByIdAndUpdate(
        sessionId,
        { $inc: updateFields },
        {
          arrayFilters: [{ 'elem.playerId': playerId }],
          new: true,
        }
      )
      .populate('players.playerId')
      .exec();
  }

  async updateSessionStatus(sessionId: string, status: string): Promise<GameSession | null> {
    const updateData: any = { status };
    
    if (status === 'finished') {
      updateData.endTime = new Date();
    }

    return this.gameSessionModel
      .findByIdAndUpdate(sessionId, updateData, { new: true })
      .populate('players.playerId')
      .exec();
  }

  async startNewWave(sessionId: string, waveNumber: number): Promise<GameSession | null> {
    return this.gameSessionModel
      .findByIdAndUpdate(
        sessionId,
        {
          $set: { currentWave: waveNumber },
          $push: {
            waveHistory: {
              wave: waveNumber,
              zombiesSpawned: 0,
              zombiesKilled: 0,
              startTime: new Date(),
              completed: false,
            },
          },
        },
        { new: true }
      )
      .populate('players.playerId')
      .exec();
  }

  async updateWaveProgress(
    sessionId: string,
    waveNumber: number,
    zombiesSpawned?: number,
    zombiesKilled?: number,
    completed?: boolean,
  ): Promise<GameSession | null> {
    const updateFields: any = {};
    
    if (zombiesSpawned !== undefined) {
      updateFields['waveHistory.$[elem].zombiesSpawned'] = zombiesSpawned;
    }
    if (zombiesKilled !== undefined) {
      updateFields['waveHistory.$[elem].zombiesKilled'] = zombiesKilled;
      updateFields.totalZombiesKilled = zombiesKilled;
    }
    if (completed !== undefined) {
      updateFields['waveHistory.$[elem].completed'] = completed;
      updateFields['waveHistory.$[elem].endTime'] = new Date();
    }

    return this.gameSessionModel
      .findByIdAndUpdate(
        sessionId,
        { $inc: updateFields },
        {
          arrayFilters: [{ 'elem.wave': waveNumber }],
          new: true,
        }
      )
      .populate('players.playerId')
      .exec();
  }

  async getSessionsByPlayer(playerId: string, limit: number = 10): Promise<GameSession[]> {
    return this.gameSessionModel
      .find({ 'players.playerId': playerId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('players.playerId')
      .exec();
  }

  async getActiveSessionsCount(): Promise<number> {
    return this.gameSessionModel.countDocuments({ status: { $in: ['waiting', 'active'] } }).exec();
  }
}