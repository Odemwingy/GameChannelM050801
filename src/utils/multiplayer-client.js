import { io } from 'socket.io-client'

export class MultiplayerClient {
  constructor({ url, auth, autoConnect = false }) {
    this.playerId = auth.playerId
    this.socket = io(url, {
      transports: ['websocket'],
      autoConnect,
      auth,
    })
  }

  connect() {
    if (this.socket.connected) return Promise.resolve()
    return new Promise((resolve, reject) => {
      const onConnect = () => { cleanup(); resolve() }
      const onError = (err) => { cleanup(); reject(err) }
      const cleanup = () => {
        this.socket.off('connect', onConnect)
        this.socket.off('connect_error', onError)
        clearTimeout(timer)
      }
      // 超时 10 秒
      const timer = setTimeout(() => {
        cleanup()
        reject(new Error('连接超时，请检查服务是否启动 (ws://localhost:3001)'))
      }, 10000)

      this.socket.once('connect', onConnect)
      this.socket.once('connect_error', onError)
      this.socket.connect()
    })
  }

  disconnect() {
    this.socket.disconnect()
  }

  createRoom(gameId) {
    this.socket.emit('room:create', { gameId, playerId: this.playerId })
  }

  joinRoom(roomId) {
    this.socket.emit('room:join', { roomId, playerId: this.playerId })
  }

  leaveRoom() {
    this.socket.emit('room:leave')
  }

  reconnectRoom(roomId) {
    this.socket.emit('room:reconnect', { roomId, playerId: this.playerId })
  }

  ready() {
    this.socket.emit('game:ready')
  }

  requestFullSync() {
    this.socket.emit('room:sync_full')
  }

  sendAction(action) {
    this.socket.emit('game:action', action)
  }

  onRoomSync(handler) {
    this.socket.on('room:sync', handler)
    return () => this.socket.off('room:sync', handler)
  }

  onGameStart(handler) {
    this.socket.on('game:start', handler)
    return () => this.socket.off('game:start', handler)
  }

  onGameUpdate(handler) {
    this.socket.on('game:update', handler)
    return () => this.socket.off('game:update', handler)
  }

  onGameOver(handler) {
    this.socket.on('game:over', handler)
    return () => this.socket.off('game:over', handler)
  }

  onGameError(handler) {
    this.socket.on('game:error', handler)
    return () => this.socket.off('game:error', handler)
  }

  onFullSync(handler) {
    this.socket.on('game:sync_full', handler)
    return () => this.socket.off('game:sync_full', handler)
  }
}

export function buildDevAuth(playerId) {
  return { playerId, token: `dev_${playerId}` }
}
