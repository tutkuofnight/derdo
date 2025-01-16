import { createClient, RedisClientType } from "@redis/client"
import { ListenerUser, PlayerState, Room, Song } from "@shared/types"

class RedisService {
  private client: RedisClientType
  constructor() {
    this.client = createClient({ url: process.env.REDIS_URL, legacyMode: true })
    this.client.on('error', err => console.log('Redis Client Error', err))
    this.client.connect();
  }

  public async createRoom(roomId: string, data: Room) {
    return await this.client.hSet("rooms", roomId, JSON.stringify(data))
  }

  public async getRoom(roomId: string) {
    return await this.client.hGet("rooms", roomId)
  }

  public async getRoomMembers(roomId: string){
    return await this.client.lRange(roomId, 0, -1)
  }

  public async setRoomMember(roomId: string, user: ListenerUser) {
    return await this.client.lPush(roomId, JSON.stringify(user))
  }

  public async removeRoomMember(roomId: string, user: ListenerUser) {
    const userString = JSON.stringify(user);
    return await this.client.lRem(roomId, 0, userString);
  }

  public async deleteRoom(roomId: string) {
    return await this.client.hDel("rooms", roomId)
  }

  public async saveRoomData(roomId: string, data: Room) {
    return await this.client.hSet("rooms", roomId, JSON.stringify(data))
  }

  public async setRoomCurrentTrack(roomId: string, track: Song) {
    const data = await this.getRoom(roomId)
    if (!data) {
      return false
    }
    const room = JSON.parse(data) as Room
    room.currentTrack = track
    return await this.saveRoomData(roomId, room)
  }

  public async setPlayerState(roomId: string, state: PlayerState) {
    const data = await this.getRoom(roomId)
    if (!data) {
      return false
    }
    
    const room = JSON.parse(data) as Room
    if (!room.currentTrack) {
      return false
    }

    room.playerState = { ...room.playerState, ...state }
    return await this.saveRoomData(roomId, room)
  }

}

export default RedisService