import { createClient, RedisClientType } from "redis"
import { ListenerUser, PlayerState, Room, Song } from "@shared/types"

class RedisService {
  private client: RedisClientType
  constructor() {
    this.client = createClient({ url: process.env.REDIS_URL })
    this.client.on('error', err => console.log('Redis Client Error', err))
    this.client.connect();
  }

  public async createRoom(roomId: string, data: any) {
    return await this.client.hSet("rooms", roomId, JSON.stringify(data))
  }

  public async getRoom(roomId: string) {
    return await this.client.hGet("rooms", roomId)
  }

  public async deleteRoom(roomId: string) {
    return await this.client.hDel("rooms", roomId)
  }

  public async saveRoomData(roomId: string, data: Room) {
    return await this.client.hSet("rooms", roomId, JSON.stringify(data))
  }

  public async getRoomMembers(roomId: string) {
    const data = await this.getRoom(roomId)
    if (!data) {
      return []
    }
    const room = JSON.parse(data) as Room
    return room.users
  }

  public async setRoomMember(roomId: string, user: ListenerUser) {
    const data = await this.getRoom(roomId)
    if (!data) {
      return false
    }
    const room = JSON.parse(data) as Room
    const findedUser = room.users.find(member => member.name == user.name)
    if (!findedUser) {
      room.users.push(user)
    }
    return await this.saveRoomData(roomId, room)
  }

  public async removeRoomMember(roomId: string, user: ListenerUser) {
    const data = await this.getRoom(roomId)
    if (!data) {
      return false
    }
    const room = JSON.parse(data) as Room
    room.users = room.users.filter(member => member.name != user.name)
    return await this.saveRoomData(roomId, room)
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

  public async setPlayState(roomId: string, state: PlayerState) {
    const data = await this.getRoom(roomId)
    if (!data) {
      return false
    }
    
    const room = JSON.parse(data) as Room
    if (!room.currentTrack) {
      return false
    }

    room.playerState = state
    return await this.saveRoomData(roomId, room)
  }

}

export default RedisService