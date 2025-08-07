import GameMap from "@/map/entities/map.entity";
import RAPIER from "@dimforge/rapier3d-compat";
import {Vector3} from "three";

export default class Game {
    map: GameMap
    private world?: RAPIER.World;
    private gameLoop?: NodeJS.Timeout;
    private players: Map<string, any> = new Map();
    private mapColliders: RAPIER.Collider[] = [];

    constructor(map: GameMap) {
        this.map = map;
    }

    async init() {
        const gravity = { x: 0, y: -9.81, z: 0 };
        this.world = new RAPIER.World(gravity);
        await this.map.init(this.world);
        // this.loadCurrentMap();
        // this.startGameLoop();
    }

    async destroy() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        if (this.world) {
            this.world.free();
        }
    }

    async start() {
        this.gameLoop = setInterval(() => {
            if (!this.world) {
                throw new Error('World is not initialized');
            }
            this.world.step();
        }, 1000 / 60); // 60 FPS
    }

    addPlayer(playerId: string, position?: { x: number; y: number; z: number }) {
        if (!this.world) {
            throw new Error('World is not initialized');
        }

        const spawnPosition = position || new Vector3();

        const playerBody = this.world.createRigidBody(
            RAPIER.RigidBodyDesc.dynamic().setTranslation(spawnPosition.x, spawnPosition.y, spawnPosition.z)
        );
        const playerCollider = this.world.createCollider(
            RAPIER.ColliderDesc.capsule(0.5, 0.3),
            playerBody
        );

        this.players.set(playerId, {
            rigidBody: playerBody,
            collider: playerCollider,
        });
    }

    removePlayer(playerId: string) {
        if (!this.world) {
            throw new Error('World is not initialized');
        }
        const player = this.players.get(playerId);
        if (player) {
            this.world.removeCollider(player.collider, false);
            this.world.removeRigidBody(player.rigidBody);
            this.players.delete(playerId);
        }
    }

    getPlayerPosition(playerId: string) {
        const player = this.players.get(playerId);
        if (player) {
            const position = player.rigidBody.translation();
            return { x: position.x, y: position.y, z: position.z };
        }
        return null;
    }

    movePlayer(playerId: string, direction: { x: number; z: number }) {
        const player = this.players.get(playerId);
        if (player) {
            const force = { x: direction.x * 5, y: 0, z: direction.z * 5 };
            player.rigidBody.addForce(force, true);
        }
    }
}