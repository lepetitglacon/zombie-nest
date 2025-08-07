import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from '@/game/game.service';
import {Injectable} from "@nestjs/common";
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server?: Server;

  constructor(private gameService: GameService) {}

  emit(event: string, data: any) {
    if (this.server) {
      this.server.emit(event, data);
    } else {
      console.error('WebSocket server is not initialized');
    }
  }

  @OnEvent('game.init')
  handleGameInit(payload: any) {
    this.emit('game.init', payload);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}, Map ID: ${client.handshake.query.mapId}, Game ID: ${client.handshake.query.mapId}`);

    const mapId = client.handshake.query.mapId as string
    // // Add player to game world (will use spawn point from current map)
    // this.gameService.addPlayer(client.id);
    //
    // const position = this.gameService.getPlayerPosition(client.id);
    //
    // // Notify other clients about new player
    // client.broadcast.emit('playerJoined', {
    //   playerId: client.id,
    //   position: position || { x: 0, y: 2, z: 0 },
    // });
    //
    // // Send current map info to the new client
    // const mapInfo = this.gameService.getCurrentMapInfo();
    const game = this.gameService.games.get(mapId)
    client.emit('player.connect.init', game);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    //
    // // Remove player from game world
    // this.gameService.removePlayer(client.id);
    //
    // // Notify other clients about player leaving
    // client.broadcast.emit('playerLeft', {
    //   playerId: client.id,
    // });
  }

  @SubscribeMessage('playerMove')
  handlePlayerMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { direction: { x: number; z: number } },
  ) {
    // this.gameService.movePlayer(client.id, data.direction);
    //
    // const position = this.gameService.getPlayerPosition(client.id);
    // if (position) {
    //   if (!this.server) { return }
    //   // Broadcast player position to all clients
    //   this.server.emit('playerPosition', {
    //     playerId: client.id,
    //     position,
    //   });
    // }
  }

  @SubscribeMessage('getGameState')
  handleGetGameState(@ConnectedSocket() client: Socket) {
    // Send current game state to requesting client
    // client.emit('gameState', {
    //   players: Array.from(this.gameService['players'].keys()),
    //   currentMap: this.gameService.getCurrentMapInfo(),
    // });
  }

  @SubscribeMessage('getMaps')
  handleGetMaps(@ConnectedSocket() client: Socket) {
    // const maps = this.gameService.getAvailableMaps();
    // client.emit('availableMaps', maps);
  }

  @SubscribeMessage('loadMap')
  async handleLoadMap(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { mapId: string },
  ) {
    // const success = await this.gameService.loadMap(data.mapId);
    //
    // if (success) {
    //   const mapInfo = this.gameService.getCurrentMapInfo();
    //   // Broadcast to all clients that map changed
    //   if (this.server) {
    //     this.server.emit('mapChanged', mapInfo);
    //   }
    // } else {
    //   client.emit('mapLoadError', { mapId: data.mapId });
    // }
  }
}