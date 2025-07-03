import fs from 'node:fs'

// vite插件，用于生成 router/meta.json
const META_REG = /defineOptions\([\s\S]+?meta[\s\S]+?(\{[\s\S]+?\})/

export default function generateMeta() {
  return {
    name: 'vite-plugin-generate-meta',
    // 修改 Vite 配置
    // config(config, env) {
    //   // config: 当前配置
    //   // env: { mode, command } (开发/生产模式，serve/build 命令)

    //   return {}
    // },

    configResolved(resolvedConfig) {
      this.config = resolvedConfig
    },

    // 监听文件变化，当文件变化时，更新 meta.json
    handleHotUpdate({ file }) {
      let viewsPath = file.match(/views\/(.*)\.vue/)?.[1]
      if (viewsPath) {
        viewsPath = `/${viewsPath}`
        const vueStr = fs.readFileSync(file, 'utf-8')
        const meta = vueStr.match(META_REG)?.[1]
        if (meta) {
          try {
            const metaRaw = JSON.parse(fs.readFileSync('src/router/meta.json', 'utf-8'))
            metaRaw[viewsPath] = new Function(`return ${meta}`)()
            fs.writeFileSync('src/router/meta.json', JSON.stringify(metaRaw, null, 2))
          } catch (error) {
            console.error(error)
            this.warn(`解析 ${viewsPath} meta 失败： ${error}`)
          }
        }
      }
    },

    buildStart() {
      // 构建时，生成 meta.json
      const newMeta = {}
      const globVue = (path) => {
        const files = fs.readdirSync(path)
        files.forEach((file) => {
          const filePath = `${path}${file}`
          if (fs.statSync(filePath).isDirectory()) {
            return globVue(`${filePath}/`)
          }
          if (filePath.endsWith('.vue')) {
            let viewsPath = filePath.match(/views\/(.*)\.vue/)?.[1]
            if (viewsPath) {
              viewsPath = `/${viewsPath}`
              const vueStr = fs.readFileSync(filePath, 'utf-8')
              const meta = vueStr.match(META_REG)?.[1]
              if (meta) {
                try {
                  newMeta[viewsPath] = new Function(`return ${meta}`)()
                } catch (error) {
                  console.error(error)
                  this.error(`解析 ${viewsPath} meta 失败`, error)
                }
              }
            }
          }
        })
      }

      globVue('src/views/')
      fs.writeFileSync('src/router/meta.json', JSON.stringify(newMeta, null, 2))
    },
  }
}
