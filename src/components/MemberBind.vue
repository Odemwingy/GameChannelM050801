<template>
  <div class="member-bind">
    <div class="mb-header">
      <button class="btn-secondary" @click="$emit('back')">返回</button>
      <h2>会员绑定</h2>
    </div>

    <div v-if="user?.memberMasked" class="mb-bound">
      <p>已绑定会员号</p>
      <span class="mb-masked">{{ user.memberMasked }}</span>
    </div>

    <div v-else class="mb-form">
      <p class="mb-hint">绑定航空公司会员号，可获得 {{ bonusPoints }} 积分奖励</p>
      <div class="mb-input-row">
        <input
          v-model="memberNo"
          type="text"
          placeholder="请输入会员号（至少 4 位）"
          maxlength="32"
          class="mb-input"
        />
        <button
          class="btn-primary"
          :disabled="memberNo.length < 4 || submitting"
          @click="handleBind"
        >
          {{ submitting ? '绑定中...' : '绑定' }}
        </button>
      </div>
      <p v-if="error" class="mb-error">{{ error }}</p>
      <p v-if="success" class="mb-success">绑定成功！获得 {{ bonusPoints }} 积分</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { apiPost } from '../utils/api'
import { useAuth } from '../composables/useAuth'

defineEmits(['back'])

const { user, refreshProfile } = useAuth()

const memberNo = ref('')
const submitting = ref(false)
const error = ref('')
const success = ref(false)
const bonusPoints = ref(100)

async function handleBind() {
  error.value = ''
  success.value = false
  submitting.value = true
  try {
    await apiPost('/user/bind-member', { memberNo: memberNo.value })
    success.value = true
    await refreshProfile()
  } catch (err) {
    error.value = err.message || '绑定失败'
  } finally {
    submitting.value = false
  }
}
</script>
