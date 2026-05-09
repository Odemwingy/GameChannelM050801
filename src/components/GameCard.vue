<template>
  <button
    class="game-card"
    :class="{ 'game-card-compact': compact }"
    type="button"
    :aria-label="game.title"
    @click="$emit('open', game.id)"
  >
    <span class="image-shell">
      <img :src="game.image" :alt="game.title" loading="lazy" />
    </span>
    <span class="game-info">
      <span class="game-title">{{ game.title }}</span>
      <span class="game-details">
        <span>{{ game.genre }}</span>
        <span class="dot" aria-hidden="true">·</span>
        <span class="likes"><span class="likes-icon" aria-hidden="true"></span>{{ game.likes }}</span>
      </span>
    </span>
  </button>
</template>

<script setup>
defineProps({
  game: { type: Object, required: true },
  compact: { type: Boolean, default: false },
})

defineEmits(['open'])
</script>
