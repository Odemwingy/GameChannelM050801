<template>
  <div class="game-play">
    <!-- 连接中 / 连接失败 -->
    <div v-if="!connected" class="game-loading">
      <p v-if="!error">正在连接服务器...</p>
      <template v-else>
        <p class="error-text">{{ error }}</p>
        <button class="btn-primary" @click="handleRetry">重试连接</button>
        <button class="btn-secondary" @click="$emit('back')">返回</button>
      </template>
    </div>

    <!-- 房间大厅（未指定 roomId 时显示） -->
    <RoomLobby
      v-else-if="!roomId && !mp.roomId"
      :game-id="gameId"
      :game-title="gameMeta.title"
      :max-players="gameMeta.maxPlayers"
      @back="$emit('back')"
      @create-room="handleCreateRoom"
      @join-room="handleJoinRoom"
    />

    <!-- 等待房间 -->
    <div v-else-if="roomState === 'WAITING'" class="waiting-room">
      <h2>等待玩家加入</h2>
      <div class="room-id-box">
        <span class="room-id-label">房间号</span>
        <span class="room-id-value">{{ roomId }}</span>
        <button class="copy-btn" @click="copyRoomId">复制</button>
      </div>
      <div class="player-list">
        <div v-for="p in players" :key="p.playerId" class="player-seat">
          <span class="seat-icon" :class="{ 'seat-ready': p.ready }">
            {{ p.ready ? '✓' : '○' }}
          </span>
          <span>{{ p.playerId }}</span>
        </div>
        <div v-for="i in emptySeats" :key="'empty-' + i" class="player-seat seat-empty">
          <span class="seat-icon">-</span>
          <span>等待加入...</span>
        </div>
      </div>
      <button class="btn-primary" :disabled="isReady" @click="handleReady">
        {{ isReady ? '已准备' : '准备' }}
      </button>
      <button class="btn-secondary" @click="$emit('back')">返回</button>
    </div>

    <!-- 游戏中 -->
    <div v-else-if="roomState === 'PLAYING' || (roomState === 'SETTLED' && gameView)" class="playing-area">
      <GobangBoard
        v-if="gameId === 'gobang' && gameView"
        :board="gameView.board"
        :my-stone="myStone"
        :current-turn="gameView.turn"
        :is-my-turn="isMyTurn"
        :disabled="!!gameOver"
        :player-names="playerNames"
        @place-stone="handlePlaceStone"
      />
      <DoudizhuTable
        v-if="gameId === 'doudizhu' && gameView"
        :game-view="gameView"
        :my-player-id="mp.myPlayerId"
        :players="players"
        :disabled="!!gameOver"
        :last-action="mp.lastAction"
        @play-card="handlePlayCard"
        @pass="handlePass"
      />
      <div v-if="error" class="error-banner">{{ error }}</div>
    </div>

    <!-- 游戏结束 -->
    <div v-if="gameOver" class="game-result-overlay">
      <div class="game-result">
        <h2>{{ isWinner ? '你赢了！' : '游戏结束' }}</h2>
        <p v-if="gameOver.winners.length">
          获胜者: {{ gameOver.winners.join(', ') }}
        </p>
        <p v-if="pointsEarned > 0" class="points-earned">获得 {{ pointsEarned }} 积分</p>
        <div class="result-actions">
          <button class="btn-primary" @click="handleReady">再来一局</button>
          <button class="btn-secondary" @click="$emit('back')">返回大厅</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import GobangBoard from './GobangBoard.vue'
import DoudizhuTable from './DoudizhuTable.vue'
import RoomLobby from './RoomLobby.vue'
import { useAuth } from '../composables/useAuth'
import { useMultiplayer } from '../composables/useMultiplayer'
import { apiPost } from '../utils/api'
import { findGame } from '../data/games'

const props = defineProps({
  gameId: { type: String, required: true },
  roomId: { type: String, default: null },
})

const emit = defineEmits(['back'])

const auth = useAuth()
const mp = useMultiplayer()

const isReady = ref(false)
const pointsEarned = ref(0)

const gameMeta = computed(() => {
  const game = findGame(props.gameId)
  return {
    title: game?.title || props.gameId,
    maxPlayers: props.gameId === 'doudizhu' ? 3 : 2,
  }
})

const connected = computed(() => mp.connected)
const roomId = computed(() => mp.roomId)
const roomState = computed(() => mp.roomState)
const players = computed(() => mp.players)
const gameView = computed(() => mp.gameView)
const gameOver = computed(() => mp.gameOver)
const error = computed(() => mp.error)

const minPlayers = props.gameId === 'doudizhu' ? 3 : 2
const emptySeats = computed(() => Math.max(0, minPlayers - players.value.length))

const mySeatIndex = computed(() => {
  const idx = players.value.findIndex((p) => p.playerId === mp.myPlayerId)
  return idx >= 0 ? idx : 0
})

const myStone = computed(() => (mySeatIndex.value === 0 ? 'B' : 'W'))

const isMyTurn = computed(() => {
  if (!gameView.value || gameOver.value) return false
  if (props.gameId === 'doudizhu') {
    return gameView.value.turnPlayerId === mp.myPlayerId
  }
  return gameView.value.turn === mySeatIndex.value
})

const isWinner = computed(() => {
  if (!gameOver.value) return false
  return gameOver.value.winners.includes(mp.myPlayerId)
})

const playerNames = computed(() => players.value.map((p) => p.playerId))

function handleReady() {
  mp.ready()
  isReady.value = true
}

function handleCreateRoom() {
  mp.createRoom(props.gameId)
}

function handleJoinRoom(targetRoomId) {
  mp.joinRoom(targetRoomId)
}

async function handleRetry() {
  mp.clearError()
  if (auth.user) {
    await mp.connect(auth.user.id)
    if (props.roomId) {
      mp.joinRoom(props.roomId)
    }
  }
}

function handlePlaceStone({ x, y }) {
  mp.sendAction('PLACE_STONE', { x, y })
}

function handlePlayCard(cards) {
  mp.sendAction('PLAY_CARD', { cards })
}

function handlePass() {
  mp.sendAction('PASS', {})
}

function copyRoomId() {
  if (roomId.value) {
    navigator.clipboard?.writeText(roomId.value)
  }
}

// 监听游戏开始，重置 ready 状态
watch(() => mp.roomState, (newState) => {
  if (newState === 'PLAYING') {
    isReady.value = false
    pointsEarned.value = 0
  }
})

// 监听游戏结束，结算积分
watch(() => mp.gameOver, async (over) => {
  if (!over || !auth.user) return
  const sessionId = mp.roomId
  if (!sessionId) return
  try {
    // 参与奖励
    const playResult = await apiPost('/points/settle', { sessionId, reason: 'GAME_PLAY' })
    let earned = playResult.amount || 0
    // 获胜奖励
    if (over.winners.includes(mp.myPlayerId)) {
      const winResult = await apiPost('/points/settle', { sessionId, reason: 'GAME_WIN' })
      earned += winResult.amount || 0
    }
    pointsEarned.value = earned
    auth.refreshProfile()
  } catch {
    // 积分结算失败不影响游戏体验
  }
})

onMounted(async () => {
  try {
    await auth.init()
  } catch (e) {
    console.error('[GamePlay] auth.init failed:', e)
  }

  if (auth.user) {
    console.log('[GamePlay] connecting as', auth.user.id)
    await mp.connect(auth.user.id)
    if (props.roomId) {
      mp.joinRoom(props.roomId)
    }
  } else {
    console.error('[GamePlay] auth.user is null after init, error:', auth.error)
    // 回退：用设备指纹作为临时 ID 尝试连接
    const fp = localStorage.getItem('ife_device_fp')
    if (fp) {
      const fallbackId = 'guest_' + fp.slice(0, 8)
      console.log('[GamePlay] using fallback id:', fallbackId)
      await mp.connect(fallbackId)
      if (props.roomId) {
        mp.joinRoom(props.roomId)
      }
    }
  }
})

onBeforeUnmount(() => {
  mp.leaveRoom()
  mp.disconnect()
})
</script>
