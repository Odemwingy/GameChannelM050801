<template>
  <div class="points-history">
    <div class="ph-header">
      <button class="btn-secondary" @click="$emit('back')">返回</button>
      <h2>积分记录</h2>
      <div class="ph-total">
        <span class="ph-total-label">当前积分</span>
        <span class="ph-total-value">{{ user?.points ?? 0 }}</span>
      </div>
    </div>

    <div v-if="loading" class="ph-loading">加载中...</div>
    <div v-else-if="logs.length === 0" class="ph-empty">暂无积分记录</div>
    <div v-else class="ph-list">
      <div v-for="log in logs" :key="log.id" class="ph-item">
        <div class="ph-item-left">
          <span class="ph-reason">{{ reasonLabel(log.reason) }}</span>
          <span class="ph-time">{{ formatTime(log.createdAt) }}</span>
        </div>
        <span class="ph-amount" :class="log.amount >= 0 ? 'ph-gain' : 'ph-loss'">
          {{ log.amount >= 0 ? '+' : '' }}{{ log.amount }}
        </span>
      </div>
    </div>

    <div v-if="rules" class="ph-rules">
      <h3>积分规则</h3>
      <div v-for="r in rules.reasons" :key="r.reason" class="ph-rule">
        <span>{{ r.description }}</span>
        <span>{{ r.points }} 分</span>
      </div>
      <div class="ph-cap">
        单局上限 {{ rules.caps.perSession }} · 单日上限 {{ rules.caps.perDay }} · 单航班上限 {{ rules.caps.perFlight }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { apiGet } from '../utils/api'
import { useAuth } from '../composables/useAuth'

defineEmits(['back'])

const { user } = useAuth()
const logs = ref([])
const rules = ref(null)
const loading = ref(true)

const reasonLabels = {
  GAME_PLAY: '参与游戏',
  GAME_WIN: '获胜奖励',
  MEMBER_BIND_BONUS: '会员绑定',
  OPS_GRANT: '运营补发',
}

function reasonLabel(reason) {
  return reasonLabels[reason] || reason
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

onMounted(async () => {
  try {
    const [historyData, rulesData] = await Promise.all([
      apiGet('/points/history?limit=50'),
      apiGet('/points/rules'),
    ])
    logs.value = historyData
    rules.value = rulesData
  } catch {
    // ignore
  } finally {
    loading.value = false
  }
})
</script>
