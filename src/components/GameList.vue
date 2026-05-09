<template>
  <section class="hero-heading" aria-label="游戏频道推荐">
    <h1>Need a quick break?</h1>
    <p>Jump into our most popular games</p>
  </section>

  <section class="landing-hero" aria-label="推荐游戏">
    <button class="hero-tile" type="button" @click="$emit('open-game', featuredGames[0].id)">
      <img :src="featuredGames[0].hero || featuredGames[0].image" :alt="featuredGames[0].title" />
      <span class="hero-copy">
        <span class="eyebrow">Featured game</span>
        <strong>{{ featuredGames[0].title }}</strong>
        <span>{{ featuredGames[0].genre }} · {{ featuredGames[0].likes }}</span>
      </span>
    </button>

    <div class="feature-rail-shell">
      <button
        v-if="canScrollBackward"
        class="feature-arrow feature-arrow-prev"
        type="button"
        aria-label="查看上一组推荐游戏"
        @click="scrollFeatureRail(-1)"
      >
        <span aria-hidden="true">&lsaquo;</span>
      </button>

      <div ref="featureRail" class="feature-rail" aria-label="推荐游戏列表" @scroll="syncRailScrollState">
        <button
          v-for="game in smallFeaturedGames"
          :key="game.id"
          class="immersive-card"
          type="button"
          :aria-label="game.title"
          @click="$emit('open-game', game.id)"
        >
          <img :src="game.image" :alt="game.title" loading="lazy" />
          <span class="immersive-overlay">
            <strong>{{ game.title }}</strong>
            <span class="likes"><span class="likes-icon" aria-hidden="true"></span>{{ game.likes }}</span>
          </span>
        </button>
      </div>

      <button
        v-if="canScrollForward"
        class="feature-arrow feature-arrow-next"
        type="button"
        aria-label="查看更多推荐游戏"
        @click="scrollFeatureRail(1)"
      >
        <span aria-hidden="true">&rsaquo;</span>
      </button>
    </div>
  </section>

  <section id="all-games" class="content-section">
    <div class="section-heading">
      <h1>All games</h1>
      <span>{{ games.length }} games</span>
    </div>

    <div class="game-grid">
      <GameCard v-for="game in games" :key="game.id" :game="game" @open="$emit('open-game', $event)" />
    </div>

    <p v-if="!games.length" class="empty-state">No games found.</p>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import GameCard from './GameCard.vue'

const props = defineProps({
  games: { type: Array, required: true },
  featuredGames: { type: Array, required: true },
})

defineEmits(['open-game'])

const featureRail = ref(null)
const canScrollBackward = ref(false)
const canScrollForward = ref(false)

const smallFeaturedGames = computed(() => props.featuredGames.slice(1, 7))

function syncRailScrollState() {
  const rail = featureRail.value

  if (!rail) {
    canScrollBackward.value = false
    canScrollForward.value = false
    return
  }

  const maxScrollLeft = rail.scrollWidth - rail.clientWidth
  canScrollBackward.value = rail.scrollLeft > 2
  canScrollForward.value = maxScrollLeft - rail.scrollLeft > 2
}

function scrollFeatureRail(direction) {
  const rail = featureRail.value

  if (!rail) {
    return
  }

  const firstCard = rail.querySelector('.immersive-card')
  const cardWidth = firstCard?.getBoundingClientRect().width || rail.clientWidth / 2
  const gap = Number.parseFloat(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap) || 16

  rail.scrollBy({
    left: direction * (cardWidth + gap),
    behavior: 'smooth',
  })
}

let resizeObserver

onMounted(() => {
  nextTick(syncRailScrollState)

  if ('ResizeObserver' in window && featureRail.value) {
    resizeObserver = new ResizeObserver(syncRailScrollState)
    resizeObserver.observe(featureRail.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

watch(smallFeaturedGames, () => nextTick(syncRailScrollState))
</script>
