<template>
  <div class="gobang-board">
    <div class="gobang-info">
      <div class="player-label" :class="{ active: currentTurn === 0 }">
        <span class="stone-icon stone-icon-black"></span>
        <span>{{ playerNames[0] || '玩家 1' }}</span>
      </div>
      <div class="turn-text">{{ statusText }}</div>
      <div class="player-label" :class="{ active: currentTurn === 1 }">
        <span class="stone-icon stone-icon-white"></span>
        <span>{{ playerNames[1] || '玩家 2' }}</span>
      </div>
    </div>

    <div class="gobang-grid">
      <div
        v-for="(_, i) in 225"
        :key="i"
        class="gobang-cell"
        :class="{ 'star-point': isStarPoint(i) }"
        @click="handleClick(i)"
      >
        <div v-if="cellValue(i) === 'B'" class="stone-black"></div>
        <div v-else-if="cellValue(i) === 'W'" class="stone-white"></div>
        <div
          v-else-if="!disabled && isMyTurn && cellValue(i) === ''"
          class="stone-hover"
          :class="myStone === 'B' ? 'stone-hover-black' : 'stone-hover-white'"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  board: { type: Array, required: true },
  myStone: { type: String, required: true },
  currentTurn: { type: Number, required: true },
  isMyTurn: { type: Boolean, required: true },
  disabled: { type: Boolean, default: false },
  playerNames: { type: Array, default: () => [] },
})

const emit = defineEmits(['place-stone'])

const statusText = computed(() => {
  if (props.disabled) return '游戏结束'
  return props.isMyTurn ? '轮到你了' : '等待对手...'
})

const starPoints = new Set([
  3 * 15 + 3,   // (3,3)
  3 * 15 + 11,  // (3,11)
  7 * 15 + 7,   // (7,7)
  11 * 15 + 3,  // (11,3)
  11 * 15 + 11, // (11,11)
])

function cellValue(index) {
  const y = Math.floor(index / 15)
  const x = index % 15
  return props.board[y]?.[x] ?? ''
}

function isStarPoint(index) {
  return starPoints.has(index)
}

function handleClick(index) {
  if (props.disabled || !props.isMyTurn) return
  const y = Math.floor(index / 15)
  const x = index % 15
  if (props.board[y]?.[x] !== '') return
  emit('place-stone', { x, y })
}
</script>
