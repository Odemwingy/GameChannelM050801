<template>
  <div class="doudizhu-table">
    <!-- 对手区域 -->
    <div class="opponent-area">
      <div
        v-for="opponent in opponents"
        :key="opponent.playerId"
        class="opponent-seat"
        :class="{ 'seat-active': gameView.turnPlayerId === opponent.playerId }"
      >
        <div class="opponent-avatar">{{ opponent.playerId.slice(0, 2) }}</div>
        <div class="opponent-info">
          <span class="opponent-name">{{ opponent.playerId }}</span>
          <span class="opponent-cards">{{ handCount[opponent.playerId] ?? '?' }} 张</span>
        </div>
      </div>
    </div>

    <!-- 出牌区 -->
    <div class="play-area">
      <div v-if="lastPlayedCards.length" class="played-cards">
        <span v-for="(card, i) in lastPlayedCards" :key="i" class="played-card">{{ card }}</span>
      </div>
      <p v-else class="play-area-hint">出牌区</p>
    </div>

    <!-- 我的手牌 -->
    <div class="my-area">
      <div class="my-hand">
        <button
          v-for="(card, index) in myHand"
          :key="index"
          class="hand-card"
          :class="{ 'card-selected': selectedIndices.has(index) }"
          :disabled="disabled"
          @click="toggleCard(index)"
        >
          {{ card }}
        </button>
      </div>
      <div class="action-bar">
        <span class="turn-hint" :class="{ 'my-turn': isMyTurn }">
          {{ isMyTurn ? '轮到你出牌' : '等待对手...' }}
        </span>
        <button
          class="btn-primary"
          :disabled="!isMyTurn || disabled || selectedIndices.size === 0"
          @click="handlePlayCard"
        >
          出牌
        </button>
        <button
          class="btn-secondary"
          :disabled="!isMyTurn || disabled"
          @click="handlePass"
        >
          不出
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  gameView: { type: Object, required: true },
  myPlayerId: { type: String, required: true },
  players: { type: Array, required: true },
  disabled: { type: Boolean, default: false },
  lastAction: { type: Object, default: null },
})

const emit = defineEmits(['play-card', 'pass'])

const selectedIndices = ref(new Set())

const myHand = computed(() => props.gameView?.myHand ?? [])
const handCount = computed(() => props.gameView?.handCount ?? {})
const isMyTurn = computed(() => props.gameView?.turnPlayerId === props.myPlayerId)

const opponents = computed(() =>
  props.players.filter((p) => p.playerId !== props.myPlayerId),
)

const lastPlayedCards = computed(() => {
  if (!props.lastAction) return []
  if (props.lastAction.type === 'PLAY_CARD') return props.lastAction.payload?.cards ?? []
  return []
})

// 重置选中（换手时）
watch(() => props.gameView?.turnPlayerId, () => {
  selectedIndices.value = new Set()
})

function toggleCard(index) {
  if (props.disabled || !isMyTurn.value) return
  const next = new Set(selectedIndices.value)
  if (next.has(index)) {
    next.delete(index)
  } else {
    next.add(index)
  }
  selectedIndices.value = next
}

function handlePlayCard() {
  if (selectedIndices.value.size === 0) return
  const cards = [...selectedIndices.value]
    .sort((a, b) => a - b)
    .map((i) => myHand.value[i])
  emit('play-card', cards)
  selectedIndices.value = new Set()
}

function handlePass() {
  emit('pass')
  selectedIndices.value = new Set()
}
</script>
