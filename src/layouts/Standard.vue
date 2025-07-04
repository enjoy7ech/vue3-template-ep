<template>
  <el-container class="theme-standard">
    <el-header class="d-flex a-center standard-header">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style="font-size: 40px; cursor: pointer; margin-right: 20px"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        @click="toggleSideBar"
      >
        <path
          fill="currentColor"
          d="M18 3a3 3 0 0 1 2.995 2.824L21 6v12a3 3 0 0 1-2.824 2.995L18 21H6a3 3 0 0 1-2.995-2.824L3 18V6a3 3 0 0 1 2.824-2.995L6 3zm0 2H9v14h9a1 1 0 0 0 .993-.883L19 18V6a1 1 0 0 0-.883-.993zm-2.293 4.293a1 1 0 0 1 .083 1.32l-.083.094L14.415 12l1.292 1.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083l-2-2a1 1 0 0 1-.083-1.32l.083-.094l2-2a1 1 0 0 1 1.414 0"
        />
      </svg>

      <span style="font-size: 2.6em; font-weight: bold">VUE3-TEMPLATE-EP</span>

      <div class="ml-a LD-switch" @click="onChangeDL">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <g fill="none">
            <path
              fill="currentColor"
              d="M12 19a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1m6.364-2.05l.707.707a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 0 1 1.414-1.414m-12.728 0a1 1 0 0 1 1.497 1.32l-.083.094l-.707.707a1 1 0 0 1-1.497-1.32l.083-.094zM12 6a6 6 0 1 1 0 12a6 6 0 0 1 0-12m-8 5a1 1 0 0 1 .117 1.993L4 13H3a1 1 0 0 1-.117-1.993L3 11zm17 0a1 1 0 1 1 0 2h-1a1 1 0 1 1 0-2zM4.929 4.929a1 1 0 0 1 1.32-.083l.094.083l.707.707a1 1 0 0 1-1.32 1.497l-.094-.083l-.707-.707a1 1 0 0 1 0-1.414m14.142 0a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0M12 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1"
            />
          </g>
        </svg>
      </div>
    </el-header>

    <el-container class="standard-container">
      <el-aside class="standard-aside">
        <el-scrollbar
          :view-style="{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }"
        >
          <el-menu
            router
            :default-active="$route.path"
            :collapse="isCollapse"
            style="flex: 1; border-right: none"
          >
            <template v-for="(item, index) in menus" :key="index">
              <el-sub-menu :index="'sub-menu' + index" v-if="item?.children">
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
                <el-icon v-if="item.icon">
                  <component :is="item.icon"></component>
                </el-icon>
                <template #title>
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
            <el-popover
              trigger="hover"
              :width="tabWidth"
              :disabled="route.path == tab.path"
              :persistent="false"
              :show-after="500"
            >
              <div
                :style="{
                  height: tabWidth * 0.6 + 'px',
                  overflow: 'hidden',
                }"
              >
                <el-scrollbar
                  :view-style="{ height: '100%', display: 'flex', flexDirection: 'column' }"
                >
                  <div class="d-flex f-col f-1" :style="{ zoom: 0.3 }">
                    <component :is="getRouteComp(tab, true)"></component>
                  </div>
                </el-scrollbar>
              </div>
              <template #reference>
                <div :class="['effect-tab-content']">
                  <svg
                    class="effect-tab-content-before"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M 24 0 L 24 24 L 0 24 Q 24 24 24 0 Z" fill="currentColor" />
                  </svg>
                  <div class="effect-tab-content-wrapper">
                    <div class="effect-tab-title">
                      {{ tab.meta?.name }}
                    </div>
                    <EpClose
                      class="ml-a effect-tab-close"
                      @mousedown.stop
                      @click.stop="closeTab(tab)"
                    ></EpClose>
                  </div>
                  <svg
                    class="effect-tab-content-after"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M 0 0 L 0 24 L 24 24 Q 0 24 0 0 Z" fill="currentColor" />
                  </svg>
                </div>
              </template>
            </el-popover>
          </div>
        </div>
        <div class="standard-router-view-body">
          <div
            class="standard-router-view-body-wrapper"
            v-for="tab in tabs"
            :key="tab.path"
            :style="{ zIndex: route.path === tab.path ? 1 : -1 }"
          >
            <el-scrollbar
              :view-style="{ height: '100%', display: 'flex', flexDirection: 'column' }"
            >
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
import { useDark, useToggle } from '@vueuse/core'
import { gsap } from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
gsap.registerPlugin(MorphSVGPlugin)

const isDark = useDark()
const toggleDark = useToggle(isDark)

const changeDL = async () => {
  await gsap
    .timeline()
    .to(
      '.LD-switch',
      {
        background: isDark.value ? '#515151' : '#abcce1',
        color: isDark.value ? '#cbd1d7' : '#f5cb32',
      },
      0,
    )
    .to(
      '.LD-switch svg',
      {
        marginLeft: isDark.value ? 'auto' : '0',
        background: isDark.value ? '#28293c' : '#fff',
      },
      0,
    )
    .to(
      '.LD-switch svg path',
      {
        morphSVG: {
          type: 'linear',
          shape: isDark.value
            ? 'M12 3.5a8.5 8.5 0 1 0 8.46 9.32a.5.5 0 0 0-.812-.435a5 5 0 1 1-6.137-7.893a.5.5 0 0 0-.225-.895A8.6 8.6 0 0 0 12 3.5'
            : 'M12 19a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1m6.364-2.05l.707.707a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 0 1 1.414-1.414m-12.728 0a1 1 0 0 1 1.497 1.32l-.083.094l-.707.707a1 1 0 0 1-1.497-1.32l.083-.094zM12 6a6 6 0 1 1 0 12a6 6 0 0 1 0-12m-8 5a1 1 0 0 1 .117 1.993L4 13H3a1 1 0 0 1-.117-1.993L3 11zm17 0a1 1 0 1 1 0 2h-1a1 1 0 1 1 0-2zM4.929 4.929a1 1 0 0 1 1.32-.083l.094.083l.707.707a1 1 0 0 1-1.32 1.497l-.094-.083l-.707-.707a1 1 0 0 1 0-1.414m14.142 0a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0M12 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1',
        },
      },
      0,
    )
}

const onChangeDL = async () => {
  document.startViewTransition(async () => {
    toggleDark()
    changeDL()
  })
}

const router = useRouter()
const route = useRoute()

const tabsContainer = ref()

const isCollapse = ref(localStorage.getItem('tabIsCollapse') === 'true')

const loadRouteMap = new Map()
const getRouteComp = (tab, loadAsyncComponent = false) => {
  if (loadRouteMap.has(tab.path)) return loadRouteMap.get(tab.path)
  if (route.path !== tab.path && !loadAsyncComponent)
    return {
      render: () =>
        h(
          'div',
          { class: 'd-flex f-1 a-center j-center', style: { fontSize: '50px' } },
          'Loading...',
        ),
    }
  const matched = router.resolve(tab.path)?.matched
  if (matched) {
    const component = matched[matched.length - 1]?.components?.default ?? {
      render: () =>
        h('div', { class: 'd-flex f-1 a-center j-center', style: { fontSize: '50px' } }, '404'),
    }
    const syncComponent =
      component instanceof Function ? defineAsyncComponent(component) : component
    loadRouteMap.set(tab.path, syncComponent)
    return syncComponent
  }
}

router.beforeEach((to, from, next) => {
  /**
   * 处理特殊参数
   * replaceTab=true，替换当前tab
   * returnUrl=xxx, 进行setTab
   *
   */
  if (to.matched.length) {
    setTab(to.path)
    next()
  } else {
    setTab('/404')
    next('/404')
  }
})

const setTab = (path, replace = false) => {
  if (tabs.value.find((tab) => tab.path === path)) return
  if (replace) {
    const index = tabs.value.findIndex((tab) => tab.path === route.path)
    tabs.value.splice(index, 1, {
      path: path,
      meta: getMeta(path) || {
        name: path,
      },
    })
  } else {
    tabs.value.push({
      path: path,
      meta: getMeta(path) || {
        name: path,
      },
    })
  }

  reCalcTabWidth()
  refreshDragTabs()
  localStorage.setItem('seqTabs', JSON.stringify(tabs.value.map((o) => o.path)))
}

const closeTab = (tab) => {
  for (let i = 0; i < tabs.value.length; i++) {
    if (tabs.value[i].path === tab.path) {
      tabs.value.splice(i, 1)
      if (route.path === tab.path) {
        router.push(tabs.value[Math.max(i - 1, 0)].path)
      }
      reCalcTabWidth()
      refreshDragTabs()
      return
    }
  }
}

const SIDEBAR_WIDTH = 280

const toggleSideBar = (e) => {
  isCollapse.value = !isCollapse.value
  nextTick(() => {
    gsap
      .timeline()
      .to(
        e.currentTarget.querySelector('path'),
        {
          morphSVG: {
            type: 'linear',
            shape: isCollapse.value
              ? 'M18 3a3 3 0 0 1 2.995 2.824L21 6v12a3 3 0 0 1-2.824 2.995L18 21H6a3 3 0 0 1-2.995-2.824L3 18V6a3 3 0 0 1 2.824-2.995L6 3zm0 2H9v14h9a1 1 0 0 0 .993-.883L19 18V6a1 1 0 0 0-.883-.993zm-4.387 4.21l.094.083l2 2a1 1 0 0 1 .083 1.32l-.083.094l-2 2a1 1 0 0 1-1.497-1.32l.083-.094L13.585 12l-1.292-1.293a1 1 0 0 1-.083-1.32l.083-.094a1 1 0 0 1 1.32-.083'
              : 'M18 3a3 3 0 0 1 2.995 2.824L21 6v12a3 3 0 0 1-2.824 2.995L18 21H6a3 3 0 0 1-2.995-2.824L3 18V6a3 3 0 0 1 2.824-2.995L6 3zm0 2H9v14h9a1 1 0 0 0 .993-.883L19 18V6a1 1 0 0 0-.883-.993zm-2.293 4.293a1 1 0 0 1 .083 1.32l-.083.094L14.415 12l1.292 1.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083l-2-2a1 1 0 0 1-.083-1.32l.083-.094l2-2a1 1 0 0 1 1.414 0',
          },
        },
        0,
      )
      .to(
        '.standard-aside',
        {
          width: isCollapse.value ? 64 : SIDEBAR_WIDTH,
        },
        0,
      )
  })
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

const TAB_WIDTH = 220
const tabWidth = ref(TAB_WIDTH)
const tabGap = ref(8)

const reCalcTabWidth = () => {
  tabWidth.value = Math.min(
    (tabsContainer.value.clientWidth - 100) / tabs.value.length - tabGap.value,
    TAB_WIDTH,
  )
}

const refreshDragTabs = () => {
  nextTick(() => {
    useDraggable(tabsContainer.value, {
      type: 'x',
      // bounds: tabsContainer.value,
      width: tabWidth.value,
      gapX: tabGap.value,
      onChange: (newSeq) => {
        localStorage.setItem('seqTabs', JSON.stringify(newSeq))
      },
    })
  })
}

let observe = new ResizeObserver(
  _.throttle(() => {
    reCalcTabWidth()
    refreshDragTabs()
  }, 200),
)
onMounted(() => {
  initTabs()
  refreshDragTabs()
  changeDL()
  observe.observe(tabsContainer.value)
})

onUnmounted(() => {
  observe.disconnect()
})
</script>

<style>
.theme-standard {
  --tab-bg: v-bind(isDark? '#202020': '#edf2fa');
  --tab-fg: v-bind(isDark? '#292929': '#fff');
  --tab-hover: v-bind(isDark? '#979797': '#d3e3fd');
  --tab-close-hover: v-bind(isDark? '#616161': '#edf2fa');

  display: flex;
  flex: 1;
  overflow: hidden;

  .effect-tab {
    font-size: 15px;
    line-height: 15px;
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
      background-color: var(--tab-bg);
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
        background-color: var(--tab-bg);
        z-index: 13001;
      }

      .effect-tab-content:hover {
        background-color: var(--tab-hover);
      }
    }

    .effect-tab-content-before {
      position: absolute;
      bottom: -0.5em;
      color: transparent;
      width: 0;
    }

    .effect-tab-content-after {
      position: absolute;
      bottom: -0.5em;
      color: transparent;
      width: 0;
    }

    &.active-tab {
      background-color: var(--tab-fg);
      border-radius: 9px 9px 0 0;
      --dec-size: 15px;
      box-shadow: 0 9px 0 0 var(--tab-fg);
      .effect-tab-content:hover {
        background-color: var(--tab-fg);
      }
      &::after {
        content: '';
        position: absolute;
        top: 20%;
        bottom: 20%;
        width: 2px;
        left: v-bind(-tabGap / 2 - 1 + 'px');
        background-color: var(--tab-bg);
        z-index: 3001;
      }
      .effect-tab-content-before {
        left: calc(-1 * var(--dec-size));
        width: var(--dec-size);
        height: var(--dec-size);
        background-color: transparent;
        color: var(--tab-fg);
      }
      .effect-tab-content-after {
        right: calc(-1 * var(--dec-size));
        width: var(--dec-size);
        height: var(--dec-size);
        background-color: transparent;
        color: var(--tab-fg);
      }
    }

    .effect-tab-content {
      padding: 0.3em 0.6em 0.3em 0.8em;
      border-radius: 0.6em;
      flex: 1;
      display: flex;

      .effect-tab-content-wrapper {
        width: 100%;
        display: flex;
        align-items: center;
        position: relative;
        overflow: hidden;
        .effect-tab-title {
          flex: 1;
          width: 0;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .effect-tab-close {
          cursor: pointer;
          padding: 0.15em;
          flex-shrink: 0;
          &:hover {
            background-color: var(--tab-close-hover);
            border-radius: 50%;
          }
        }
      }
    }
  }

  .LD-switch {
    font-size: 2rem;
    border-radius: 1em;
    width: 2.4em;
    padding: 0.1em 0.2em;
    display: flex;
    align-items: center;
    display: flex;
    align-items: center;

    & svg {
      cursor: pointer;
      border-radius: 50%;
    }
  }
}

.standard-header {
  height: 80px;
  background: var(--header-bg);
  color: #fff;
}

.standard-aside {
  background: var(--side-bar-bg);
  color: var(--side-bar-text-color);
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: v-bind(SIDEBAR_WIDTH + 'px');
  .el-menu-item {
    &:not(.is-disabled):hover {
      color: var(--el-menu-hover-text-color);
      background-color: var(--el-menu-hover-bg-color);
    }
    &.is-active {
      color: var(--el-menu-active-color);
      background-color: var(--el-menu-active-bg-color);
    }
  }
  .standard-aside-menu-item {
    height: 56px;
    display: flex;
    align-items: center;
    padding: 0 var(--el-menu-base-level-padding);
    cursor: pointer;

    &:hover {
      background-color: var(--el-menu-hover-bg-color);
    }
  }
}

.standard-container {
  flex: 1;
  overflow: hidden;

  .standard-router-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0 !important;
    .standard-router-view-header {
      position: relative;
      height: 2.93em;
      overflow: hidden;
      padding: 0.6em 0.8em;

      background: var(--tab-bg);
    }
    .standard-router-view-body {
      flex: 1;
      overflow: hidden;
      background: var(--tab-fg);
      position: relative;
      .standard-router-view-body-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 1em;
      }
    }
  }
}
</style>
