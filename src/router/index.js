import { createRouter, createWebHashHistory } from 'vue-router'
import meta from './meta.json'

const views = import.meta.glob('../views/**/*.vue')

const buildRouter = (routerMap) => {
  const routes = []
  const cns = Object.keys(routerMap)

  const findRouterTree = (target, nodes) => {
    if (target.length === 0) return nodes
    let foundNode = null
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].path === target[0]) {
        foundNode = nodes[i]
      }
    }
    if (!foundNode) {
      foundNode = {
        path: target[0],
        meta: {},
        children: [],
      }
      nodes.push(foundNode)
    }
    if (target.length === 1) return foundNode
    else return findRouterTree(target.slice(1), foundNode.children)
  }

  for (let i = 0; i < cns.length; i++) {
    let path = cns[i]
    const link = path.match(/\.\/views\/(.*)\.vue/)[1].split('/')

    link[0] = `/${link[0]}`

    const rec = (link) => {
      if (link[link.length - 1] == 'Index') {
        link.splice(link.length - 1, 1)
      }

      const pos = findRouterTree(link, routes)
      pos.component = routerMap[path]
    }
    rec(link)
  }

  return routes
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/Standard.vue'),
      children: buildRouter(views),
    },
  ],
})

const getMeta = (path) => {
  return meta[path]
}

export { router, getMeta }
