import { reactive, readonly } from 'vue'
import { getDeviceFingerprint } from '../utils/fingerprint.js'
import { apiGet, apiPost } from '../utils/api.js'

const state = reactive({
  user: null,
  token: localStorage.getItem('ife_token') || '',
  loading: false,
  error: null,
})

export function useAuth() {
  async function init() {
    if (state.user) return
    state.loading = true
    state.error = null

    try {
      const fp = getDeviceFingerprint()
      console.log('[useAuth] fingerprint:', fp)

      // 尝试用已有 token 获取 profile
      if (state.token) {
        console.log('[useAuth] trying existing token...')
        try {
          state.user = await apiGet('/user/profile')
          console.log('[useAuth] profile loaded:', state.user)
          return
        } catch (e) {
          console.log('[useAuth] token invalid, clearing:', e.message)
          state.token = ''
          localStorage.removeItem('ife_token')
        }
      }

      // 注册新用户
      const nickname = 'Player_' + fp.slice(0, 6)
      console.log('[useAuth] registering with:', { deviceFp: fp, nickname })
      const user = await apiPost('/user/register', { deviceFp: fp, nickname })
      console.log('[useAuth] registered:', user)
      state.user = user
      state.token = `dev_${user.id}`
      localStorage.setItem('ife_user_id', user.id)
      localStorage.setItem('ife_token', state.token)
    } catch (err) {
      console.error('[useAuth] init failed:', err)
      state.error = err.message
    } finally {
      state.loading = false
    }
  }

  async function refreshProfile() {
    try {
      state.user = await apiGet('/user/profile')
    } catch {
      // ignore
    }
  }

  return {
    ...readonly(state),
    init,
    refreshProfile,
  }
}
