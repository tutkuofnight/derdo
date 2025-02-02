import { createClient } from "@redis/client";
import { ListenerUser, PlayerState, Room } from "@shared/types";

const client = createClient({ 
  url: process.env.REDIS_URL!,
  legacyMode: false // Changed from true to false for better compatibility
});

client.on('error', err => console.log('Redis Client Error', err));
client.connect();

class RedisService {  
  constructor() {}

  // Room Operations
  public async createRoom(data: Room) {
    return await client.set(`room:${data.id}`, JSON.stringify(data));
  }

  public async getRoom(roomId: string) {
    if (!roomId) throw new Error("Room ID not set");
    const result = await client.get(`room:${roomId}`);
    return result ? JSON.parse(result) as Room : null;
  }

  // Room Users Operations
  public async listRoomUsers(roomId: string) {
    if (!roomId) throw new Error("Room ID not set");
    const users = await client.hGetAll(`room:users:${roomId}`);
    if (!users || Object.keys(users).length === 0) {
      return [];
    }
    const list = Object.values(users).map(user => JSON.parse(user) as ListenerUser);
    return list
  }

  public async setUserToList(user: ListenerUser, roomId: string, socketId: string) {
    if (!roomId) throw new Error("Room ID or Socket ID not set");
    return await client.hSetNX(`room:users:${roomId}`, socketId, JSON.stringify(user))
  }

  public async removeUserFromList(socketId: string, roomId: string) {
    if (!roomId) throw new Error("Room ID not set");
    await client.hDel(`room:users:${roomId}`, socketId);
  }

  // Audio Current Time Operations
  public async setPlayerCurrentTime(value: number, roomId: string) {
    if (!roomId) throw new Error("Room ID not set");
    await client.set(
      `room:${roomId}:current-time`,
      value.toString(),
      { EX: 30 }
    );
  }

  public async getPlayerCurrentTime(roomId: string) {
    if (!roomId) throw new Error("Room ID not set");
    const result = await client.get(`room:${roomId}:current-time`);
    return result ? parseFloat(result) : 0;
  }

  // Player State Operations
  public async setPlayerState(state: PlayerState, roomId: string) {
    if (!roomId) throw new Error("Room ID not set");
    const currentState = await this.getPlayerState(roomId);
    await client.set(
      `room:${roomId}:player-state`,
      JSON.stringify({ ...currentState, state })
    );
  }

  public async getPlayerState(roomId: string) {
    if (!roomId) throw new Error("Room ID not set");
    const result = await client.get(`room:${roomId}:player-state`);
    return result ? JSON.parse(result) as PlayerState : null;
  }
}

export default RedisService;