<template>
  <header class="site-header">
    <div class="header-inner">
      <button class="channel-mark" type="button" @click="$emit('go-home')" aria-label="返回游戏频道首页">
        <span class="mark-icon" aria-hidden="true"></span>
        <span class="mark-text">游戏频道</span>
      </button>

      <label class="search-box">
        <span class="search-icon" aria-hidden="true"></span>
        <input
          :value="query"
          type="search"
          placeholder="Search games"
          aria-label="Search games"
          @input="$emit('search', $event.target.value)"
        />
      </label>

      <div class="user-pill" aria-label="当前积分">
        <span>120</span>
        <small>积分</small>
      </div>
    </div>

    <nav class="category-strip" aria-label="游戏分类">
      <button
        v-for="category in categories"
        :key="category"
        class="category-chip"
        :class="{ active: category === selectedCategory }"
        type="button"
        :aria-pressed="category === selectedCategory"
        @click="$emit('select-category', category)"
      >
        {{ category }}
      </button>
    </nav>
  </header>
</template>

<script setup>
defineProps({
  query: { type: String, required: true },
  selectedCategory: { type: String, required: true },
  categories: { type: Array, required: true },
})

defineEmits(['search', 'select-category', 'go-home'])
</script>
