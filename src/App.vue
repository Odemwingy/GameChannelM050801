<template>
  <div class="app-shell" :data-arrangement="arrangement">
    <AppHeader
      :query="query"
      :selected-category="selectedCategory"
      :categories="categories"
      @search="query = $event"
      @select-category="selectCategory"
      @go-home="goHome"
    />

    <main class="page-frame">
      <GameDetail
        v-if="currentGameId"
        :game="currentGame"
        :recommended-games="recommendedGames"
        @back="goHome"
        @open-game="openGame"
      />

      <GameList
        v-else
        :games="filteredGames"
        :featured-games="featuredGames"
        @open-game="openGame"
      />
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import AppHeader from './components/AppHeader.vue'
import GameDetail from './components/GameDetail.vue'
import GameList from './components/GameList.vue'
import { categories, findGame, games } from './data/games'
import { getArrangement } from './utils/breakpoints'

const query = ref('')
const selectedCategory = ref('All')
const routeId = ref(readRouteId())
const arrangement = ref(getArrangement())

const currentGameId = computed(() => routeId.value)
const currentGame = computed(() => findGame(routeId.value))
const featuredGames = computed(() => games.slice(0, 7))

const filteredGames = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase()

  return games.filter((game) => {
    const matchesCategory = selectedCategory.value === 'All' || game.genre === selectedCategory.value
    const matchesQuery =
      !normalizedQuery ||
      game.title.toLowerCase().includes(normalizedQuery) ||
      game.genre.toLowerCase().includes(normalizedQuery)

    return matchesCategory && matchesQuery
  })
})

const recommendedGames = computed(() =>
  games.filter((game) => game.id !== currentGame.value.id).slice(1, 9),
)

function readRouteId() {
  const match = window.location.hash.match(/^#\/games\/([^/?#]+)/)
  return match?.[1] || ''
}

function openGame(gameId) {
  window.location.hash = `/games/${gameId}`
  routeId.value = gameId
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goHome() {
  window.location.hash = '/'
  routeId.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function selectCategory(category) {
  selectedCategory.value = category
  window.location.hash = '/'
  routeId.value = ''

  nextTick(() => {
    document.getElementById('all-games')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function handleHashChange() {
  routeId.value = readRouteId()
}

function handleResize() {
  arrangement.value = getArrangement()
}

onMounted(() => {
  window.addEventListener('hashchange', handleHashChange)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', handleHashChange)
  window.removeEventListener('resize', handleResize)
})
</script>
