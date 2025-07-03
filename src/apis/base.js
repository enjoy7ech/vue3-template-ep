import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

class BaseAPI {
  constructor(baseURL = '/') {
    this.axios = axios.create({
      baseURL,
      timeout: 1000 * 60,
    })

    const user = useUserStore()
    const route = useRoute()
    const router = useRouter()

    this.axios.interceptors.request.use((config) => {
      config.headers['Authorization'] = user.JWT.value
      return config
    })

    this.axios.interceptors.response.use((response) => {
      const { data } = response
      if (data.code == 401) {
        ElMessage.error(data.msg)
        router.replace(`/login?returnUrl=${route.path}`)
      }
    })
  }
}

export default BaseAPI
