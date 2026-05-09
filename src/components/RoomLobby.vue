<template>
  <div class="room-lobby">
    <div class="lobby-header">
      <button class="btn-secondary" @click="$emit('back')">返回</button>
      <h2>{{ gameTitle }}</h2>
      <button class="btn-primary" @click="handleCreate">创建房间</button>
    </div>

    <button class="btn-primary btn-quick-match" @click="handleQuickMatch">
      快速匹配
    </button>

    <div class="room-section">
      <h3>可用房间</h3>
      <div v-if="loading" class="lobby-loading">加载中...</div>
      <div v-else-if="rooms.length === 0" class="lobby-empty">暂无房间，点击"创建房间"开始</div>
      <div v-else class="room-list">
        <div v-for="room in rooms" :key="room.id" class="room-item">
          <div class="room-info">
            <span class="room-owner">{{ room.ownerUserId }}</span>
            <span class="room-players">{{ room.players.length }}/{{ maxPlayers }} 人</span>
            <span class="room-state" :class="'state-' + room.state">{{ stateLabel(room.state) }}</span>
          </div>
          <button
            class="btn-primary btn-sm"
            :disabled="room.state !== 'WAITING' || room.players.length >= maxPlayers"
            @click="$emit('join-room', room.id)"
          >
            加入
          </button>
        </div>
      </div>
    </div>

    <p class="lobby-hint">房间号可分享给朋友直接加入</p>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { apiGet } from '../utils/api'

const props = defineProps({
  gameId: { type: String, required: true },
  gameTitle: { type: String, default: '游戏' },
  maxPlayers: { type: Number, default: 2 },
})

const emit = defineEmits(['back', 'create-room', 'join-room', 'quick-match'])

const rooms = ref([])
const loading = ref(true)
let timer = null

async function fetchRooms() {
  try {
    rooms.value = await apiGet(`/rooms?gameId=${props.gameId}`)
  } catch {
    // ignore fetch errors
  } finally {
    loading.value = false
  }
}

function handleCreate() {
  emit('create-room')
}

function handleQuickMatch() {
  // 找到第一个 WAITING 且有空位的房间加入，没有则创建
  const available = rooms.value.find(
    (r) => r.state === 'WAITING' && r.players.length < props.maxPlayers,
  )
  if (available) {
    emit('join-room', available.id)
  } else {
    emit('create-room')
  }
}

function stateLabel(state) {
  const labels = { WAITING: '等待中', PLAYING: '游戏中', SETTLED: '已结束', DISMISSED: '已解散' }
  return labels[state] || state
}

onMounted(() => {
  fetchRooms()
  timer = setInterval(fetchRooms, 5000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>
