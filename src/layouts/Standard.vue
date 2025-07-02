<template>
  <el-container class="theme-standard">
    <el-header class="d-flex a-center standard-header">
      <span style="font-size: 2.6rem; font-weight: bold">信号分析工具</span>
    </el-header>
    <el-container class="standard-container">
      <el-aside class="standard-aside" width="200px">
        <el-scrollbar>
          <el-menu router :default-active="$route.path">
            <template v-for="(item, index) in menus" :key="index">
              <el-sub-menu :index="index" v-if="item?.children">
                <template #title>
                  <el-icon v-if="item.icon">
                    <component :is="item.icon"></component>
                  </el-icon>
                  <span>{{ item.title }}</span>
                </template>
                <el-menu-item
                  v-for="(item, index) in item.children"
                  :key="`cd-${index}`"
                  :index="item.path"
                >
                  <template #title>
                    <el-icon v-if="item.icon">
                      <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ item.title }}</span>
                  </template>
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="item.path">
                <template #title>
                  <el-icon v-if="item.icon">
                    <component :is="item.icon"></component>
                  </el-icon>
                  <span>{{ item.title }}</span>
                </template>
              </el-menu-item>
            </template>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main class="standard-router-view">
        <div class="standard-router-view-header" ref="tabsContainer">
          <div
            :class="['effect-tab', route.path === tab.path ? 'active-tab' : '']"
            :data-drag-index="tab.path"
            @mousedown="$router.push(tab.path)"
            v-for="(tab, index) in tabs"
            :key="index"
          >
            <div :class="['effect-tab-content']">
              {{ tab.meta?.name }}
              <EpClose
                class="ml-a effect-tab-close"
                style="cursor: pointer"
                @mousedown.stop
                @click.stop="closeTab(tab)"
              ></EpClose>
            </div>
          </div>
        </div>
        <div class="standard-router-view-body">
          <div
            class="standard-router-view-body-wrapper"
            v-for="tab in tabs"
            :key="tab.path"
            :style="{ zIndex: route.path === tab.path ? 1 : -1 }"
          >
            <el-scrollbar>
              <component :is="getRouteComp(tab)"></component>
            </el-scrollbar>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { getMeta } from '@/router'
import useDraggable from '@/composables/useDraggable'

const router = useRouter()
const route = useRoute()

const tabsContainer = ref()

const getRouteComp = (tab) => {
  const matched = router.resolve(tab.path)?.matched
  if (matched) {
    return matched[matched.length - 1].components.default
  }
}

router.beforeEach((to, from, next) => {
  next()
  setTab(to.path)
})

const setTab = (path) => {
  if (tabs.value.find((tab) => tab.path === path)) return
  if (getMeta(path)) {
    tabs.value.push({
      path: path,
      meta: getMeta(path),
    })
    refreshDragTabs()
    localStorage.setItem('seqTabs', JSON.stringify(tabs.value.map((o) => o.path)))
  }
}

const closeTab = (tab) => {
  for (let i = 0; i < tabs.value.length; i++) {
    if (tabs.value[i].path === tab.path) {
      tabs.value.splice(i, 1)
      if (route.path === tab.path) {
        router.push(tabs.value[Math.max(i - 1, 0)].path)
      }
      return
    }
  }
}

const initTabs = () => {
  const seqTabs = localStorage.getItem('seqTabs')
  try {
    const tabsInfo = JSON.parse(seqTabs)
    if (Array.isArray(tabsInfo)) {
      tabsInfo.forEach((path) => {
        setTab(path)
      })
    }
  } catch (error) {
    console.warn('读取tabs失败', error)
  }
  setTab(route.path)
}

const menus = reactive([
  {
    title: '总览',
    icon: IconEpHomeFilled,
    path: '/a',
  },
  {
    title: '元数据管理',
    icon: IconEpList,
    children: [
      {
        title: '设备组织管理',
        path: '/b',
      },
    ],
  },
  {
    title: '数据处理',
    icon: IconEpHistogram,
    children: [
      {
        title: '可视化诊断分析',
        path: '/DataAnalyze/Visualization',
      },
      {
        title: '算子管理',
        path: '/404',
      },
      {
        title: '模板管理',
        path: '/404',
      },
      {
        title: '任务管理',
        path: '/404',
      },
    ],
  },
  {
    title: '日志管理',
    icon: IconEpHistogram,
    children: [
      {
        title: '操作日志',
        path: '/404',
      },
      {
        title: '运行日志',
        path: '/404',
      },
    ],
  },
])

const tabs = ref([])

const tabWidth = ref(250)
const tabGap = ref(8)

const refreshDragTabs = () => {
  nextTick(() => {
    useDraggable(tabsContainer.value, {
      type: 'x',
      bounds: tabsContainer.value,
      width: tabWidth.value,
      gapX: tabGap.value,
      onChange: (newSeq) => {
        localStorage.setItem('seqTabs', JSON.stringify(newSeq))
      },
    })
  })
}

onMounted(() => {
  initTabs()
  refreshDragTabs()
})
</script>

<style scoped>
.theme-standard {
  --color-primary: #083a73;
}
.standard-header {
  --el-header-height: 80px;
  background: var(--color-primary);
  color: #fff;
}

.standard-container {
  overflow: hidden;
  .standard-aside {
    --el-menu-bg-color: var(--color-primary);
    --el-menu-active-color: #fff;
    --el-menu-text-color: #fff;
    --el-menu-hover-text-color: #fff;
    --el-menu-hover-bg-color: #1684fc;
    background: var(--color-primary);

    .el-menu-item.is-active {
      background-color: #1684fc;
    }
  }
  .standard-router-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0 !important;
    background: #edf2fa;
    .standard-router-view-header {
      padding: 0.6rem 0.8rem;
      position: relative;
      height: 3.2rem;
    }
    .standard-router-view-body {
      flex: 1;
      overflow: hidden;
      background: #fff;
      position: relative;
      .standard-router-view-body-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 1rem;
      }
    }
  }
}

.effect-tab {
  font-size: 15px;
  position: absolute;
  width: v-bind(tabWidth + 'px');
  display: flex;

  &::after {
    content: '';
    position: absolute;
    top: 20%;
    bottom: 20%;
    width: 2px;
    right: v-bind(-tabGap / 2 - 1 + 'px');
    background-color: #dde3e9;
  }

  &:hover {
    z-index: 10000 !important;

    &::after {
      content: '';
      position: absolute;
      top: 20%;
      bottom: 20%;
      width: 2px;
      left: v-bind(-tabGap / 2 - 1 + 'px');
      background-color: #edf2fa;
      z-index: 13001;
    }

    .effect-tab-content:hover {
      background-color: #d3e3fd;
    }
  }

  &.active-tab {
    background-color: #fff;
    border-radius: 0.6rem 0.6rem 0 0;
    --dec-size: 1rem;
    box-shadow: 0 0.5rem 0 0 #fff;
    .effect-tab-content:hover {
      background-color: #fff;
    }
    &::after {
      content: '';
      position: absolute;
      top: 20%;
      bottom: 20%;
      width: 2px;
      left: v-bind(-tabGap / 2 - 1 + 'px');
      background-color: #edf2fa;
      z-index: 3001;
    }
    .effect-tab-content::before {
      content: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M 24 0 L 24 24 L 0 24 Q 24 24 24 0 Z' fill='white'/></svg>");
      position: absolute;
      bottom: -0.6rem;
      color: #fff;
      left: calc(-1 * var(--dec-size));
      width: var(--dec-size);
      height: var(--dec-size);
      background-color: transparent;
    }
    .effect-tab-content::after {
      content: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M 0 0 L 0 24 L 24 24 Q 0 24 0 0 Z' fill='white'/></svg>");
      position: absolute;
      bottom: -0.6rem;
      color: #fff;
      right: calc(-1 * var(--dec-size));
      width: var(--dec-size);
      height: var(--dec-size);
      background-color: transparent;
    }
  }

  .effect-tab-item {
    padding: 0.3rem 0.6rem;
    border-radius: 0.6rem;
    flex: 1;
    display: flex;
    align-items: center;
    position: relative;

    &:hover {
      background-color: #d3e3fd;
    }
  }

  .effect-tab-content {
    padding: 0.3rem 0.6rem;
    border-radius: 0.6rem;
    flex: 1;
    display: flex;
    align-items: center;
    position: relative;

    .effect-tab-close {
      cursor: pointer;
      padding: 0.15rem;
      &:hover {
        background-color: #edf2fa;
        border-radius: 50%;
      }
    }
  }
}
</style>
