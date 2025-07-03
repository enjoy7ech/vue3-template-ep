import fs from 'node:fs'
import _ from 'lodash'

// vite插件，提供简易的proxy定义，dev环境自动收集proxy
// 使用方法：在api文件中，使用@proxy和@endProxy包裹proxy配置，如：
/**
 * @proxy /api
 * target http://192.168.15.103:201
 * changeOrigin true
 * ws true
 * rewrite () => (path) => path.replace(/^\/api/, '')
 * @endProxy
 */
export default function generateMeta() {
  return {
    name: 'vite-plugin-auto-collect-proxy',
    // 修改 Vite 配置
    config(config, env) {
      // config: 当前配置
      // env: { mode, command } (开发/生产模式，serve/build 命令)
      // 暂时这些配置够用，不够手动加
      const stringType = ['target']
      const boolType = ['ws', 'changeOrigin']
      const funcType = ['rewrite']
      const globApis = (path) => {
        const files = fs.readdirSync(path)
        files.forEach((file) => {
          const filePath = `${path}${file}`
          if (fs.statSync(filePath).isDirectory()) {
            return globApis(`${filePath}/`)
          }
          if (filePath.endsWith('.js')) {
            const jsStr = fs.readFileSync(filePath, 'utf-8')
            const proxyRegex = /@proxy (.+?)\n([\s\S]+)@endProxy/
            const prefix = jsStr.match(proxyRegex)?.[1]
            const proxyCfg = jsStr.match(proxyRegex)?.[2]

            if (prefix && proxyCfg) {
              const proxy = {}
              stringType.forEach((key) => {
                const value = proxyCfg.match(new RegExp(`${key} (.+?)\n`))?.[1]
                if (value) proxy[key] = value
              })

              boolType.forEach((key) => {
                const value = proxyCfg.match(new RegExp(`${key} (.+?)\n`))?.[1]
                if (value) proxy[key] = Boolean(value)
              })

              funcType.forEach((key) => {
                const value = proxyCfg.match(new RegExp(`${key} (.+?)\n`))?.[1]
                if (value) proxy[key] = new Function(value)
              })
              if (!_.has(config, `server.proxy.${prefix}`)) {
                console.log(`[vite-plugin-auto-collect-proxy] add proxy for ${prefix}`, proxy)
                _.set(config, `server.proxy.${prefix}`, proxy)
              }
            }
          }
        })
      }

      if (env.mode === 'development') {
        globApis('./src/apis/')
      }
    },

    handleHotUpdate({ file }) {
      if (/\/src\/apis\//.test(file)) {
        this.info(
          'if you add proxy config, maybe you should enter R in terminal to restart vite server. :)',
        )
      }
    },
  }
}
