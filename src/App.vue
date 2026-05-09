<template>
  <div class="app-shell" :data-arrangement="arrangement">
    <AppHeader
      v-if="route.view !== 'play'"
      :query="query"
      :selected-category="selectedCategory"
      :categories="categories"
      @search="query = $event"
      @select-category="selectCategory"
      @go-home="goHome"
    />

    <main class="page-frame">
      <GamePlay
        v-if="route.view === 'play'"
        :game-id="route.gameId"
        :room-id="route.roomId"
        @back="goHome"
      />

      <GameDetail
        v-else-if="route.view === 'detail'"
        :game="currentGame"
        :recommended-games="recommendedGames"
        @back="goHome"
        @open-game="openGame"
        @play="openPlay"
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
import GamePlay from './components/GamePlay.vue'
import { categories, findGame, games } from './data/games'
import { getArrangement } from './utils/breakpoints'
import { useAuth } from './composables/useAuth'

const auth = useAuth()

const query = ref('')
const selectedCategory = ref('All')
const route = ref(readRoute())
const arrangement = ref(getArrangement())

const currentGame = computed(() => findGame(route.value.gameId))
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

function readRoute() {
  const hash = window.location.hash
  let match = hash.match(/^#\/play\/([^/?#]+)\/([^/?#]+)/)
  if (match) return { view: 'play', gameId: match[1], roomId: match[2] }
  match = hash.match(/^#\/play\/([^/?#]+)/)
  if (match) return { view: 'play', gameId: match[1], roomId: null }
  match = hash.match(/^#\/games\/([^/?#]+)/)
  if (match) return { view: 'detail', gameId: match[1] }
  return { view: 'home', gameId: null, roomId: null }
}

function openGame(gameId) {
  window.location.hash = `/games/${gameId}`
  route.value = { view: 'detail', gameId }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function openPlay(gameId, roomId) {
  const path = roomId ? `/play/${gameId}/${roomId}` : `/play/${gameId}`
  window.location.hash = path
  route.value = { view: 'play', gameId, roomId: roomId || null }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goHome() {
  window.location.hash = '/'
  route.value = { view: 'home', gameId: null, roomId: null }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function selectCategory(category) {
  selectedCategory.value = category
  window.location.hash = '/'
  route.value = { view: 'home', gameId: null, roomId: null }

  nextTick(() => {
    document.getElementById('all-games')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function handleHashChange() {
  route.value = readRoute()
}

function handleResize() {
  arrangement.value = getArrangement()
}

onMounted(() => {
  auth.init()
  window.addEventListener('hashchange', handleHashChange)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', handleHashChange)
  window.removeEventListener('resize', handleResize)
})
</script>
