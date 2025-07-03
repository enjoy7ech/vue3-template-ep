import { BaseAPI } from './base'

/**
 * @proxy /api/eap
 * target http://192.168.15.103:201/
 * changeOrigin true
 * ws true
 * @endProxy
 * rewrite (path)=>path.replace(/^\/api/, '')
 */
class EAP_API extends BaseAPI {
  constructor() {
    super('/api/eap')
  }

  async queryPermission() {
    return await this.get('/menu/queryPermission')
  }
}

export const eapAPI = new EAP_API()
