import { reactive, readonly } from 'vue'
import { MultiplayerClient, buildDevAuth } from '../utils/multiplayer-client.js'

const WS_URL = import.meta.env.VITE_WS_URL || `ws://${location.hostname}:3001`

const state = reactive({
  connected: false,
  roomId: null,
  gameId: null,
  roomState: null,
  players: [],
  gameView: null,
  stateVersion: 0,
  lastAction: null,
  gameOver: null,
  error: null,
  myPlayerId: '',
})

let client = null
let unsubs = []

function cleanup() {
  unsubs.forEach((fn) => fn())
  unsubs = []
}

function wireEvents() {
  cleanup()

  unsubs.push(
    client.onRoomSync((payload) => {
      state.roomId = payload.roomId
      state.gameId = payload.gameId
      state.roomState = payload.state
      state.players = payload.players
      state.stateVersion = payload.stateVersion
    }),
  )

  unsubs.push(
    client.onGameStart((payload) => {
      state.gameView = payload.view
      state.stateVersion = payload.stateVersion
      state.gameOver = null
      state.error = null
    }),
  )

  unsubs.push(
    client.onGameUpdate((payload) => {
      state.gameView = payload.view
      state.stateVersion = payload.stateVersion
      state.lastAction = payload.lastAction
    }),
  )

  unsubs.push(
    client.onGameOver((payload) => {
      state.gameOver = { winners: payload.winners }
      state.stateVersion = payload.stateVersion
    }),
  )

  unsubs.push(
    client.onGameError((payload) => {
      state.error = payload.message
    }),
  )

  unsubs.push(
    client.onFullSync((payload) => {
      state.gameView = payload.view
      state.stateVersion = payload.stateVersion
      state.error = null
    }),
  )
}

export function useMultiplayer() {
  async function connect(playerId) {
    state.myPlayerId = playerId
    client = new MultiplayerClient({
      url: WS_URL,
      auth: buildDevAuth(playerId),
    })
    wireEvents()

    client.socket.on('connect', () => {
      state.connected = true
      state.error = null
    })

    client.socket.on('disconnect', () => {
      state.connected = false
    })

    client.socket.on('connect_error', (err) => {
      state.error = err.message
    })

    // 自动重连后恢复房间
    client.socket.io.on('reconnect', () => {
      state.connected = true
      if (state.roomId) {
        client.reconnectRoom(state.roomId)
      }
    })

    await client.connect()
  }

  function createRoom(gameId) {
    client?.createRoom(gameId)
  }

  function joinRoom(roomId) {
    client?.joinRoom(roomId)
  }

  function leaveRoom() {
    client?.leaveRoom()
    resetRoomState()
  }

  function ready() {
    client?.ready()
  }

  function sendAction(type, payload) {
    if (!client) return
    client.sendAction({
      actionId: crypto.randomUUID(),
      type,
      payload,
      clientTs: Date.now(),
      stateVersion: state.stateVersion,
    })
  }

  function requestFullSync() {
    client?.requestFullSync()
  }

  function disconnect() {
    cleanup()
    client?.disconnect()
    client = null
    state.connected = false
    resetRoomState()
  }

  function resetRoomState() {
    state.roomId = null
    state.gameId = null
    state.roomState = null
    state.players = []
    state.gameView = null
    state.stateVersion = 0
    state.lastAction = null
    state.gameOver = null
    state.error = null
  }

  function clearError() {
    state.error = null
  }

  return {
    ...readonly(state),
    connect,
    createRoom,
    joinRoom,
    leaveRoom,
    ready,
    sendAction,
    requestFullSync,
    disconnect,
    clearError,
  }
}
