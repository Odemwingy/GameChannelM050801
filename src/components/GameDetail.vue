<template>
  <section class="detail-page">
    <button class="back-link" type="button" @click="$emit('back')">
      <span aria-hidden="true">‹</span>
      View all Games
    </button>

    <div class="detail-layout">
      <article class="game-stage">
        <div class="play-surface">
          <img :src="game.hero || game.image" :alt="game.title" />
          <div class="play-overlay">
            <h1>{{ game.title }}</h1>
            <p>{{ game.genre }} · {{ game.likes }}</p>
            <button class="play-button" type="button" @click="$emit('play', game.id)">Play</button>
          </div>
        </div>

        <div class="detail-body">
          <div class="game-icon">
            <img :src="game.image" :alt="game.title" />
          </div>
          <div>
            <h2>{{ game.title }}</h2>
            <p>{{ game.description || fallbackDescription }}</p>
          </div>
        </div>
      </article>

      <aside class="right-rail" aria-label="推荐游戏">
        <h2>More games</h2>
        <div class="rail-list">
          <button
            v-for="item in recommendedGames"
            :key="item.id"
            class="rail-card"
            type="button"
            @click="$emit('open-game', item.id)"
          >
            <img :src="item.image" :alt="item.title" loading="lazy" />
            <span>
              <strong>{{ item.title }}</strong>
              <small>{{ item.genre }} · {{ item.likes }}</small>
            </span>
          </button>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
defineProps({
  game: { type: Object, required: true },
  recommendedGames: { type: Array, required: true },
})

defineEmits(['back', 'open-game', 'play'])

const fallbackDescription =
  'Jump into a fast, casual browser game designed for short sessions. The game area is ready to be connected to the packaged iframe runtime in the next integration step.'
</script>
