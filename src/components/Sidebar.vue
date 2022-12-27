<template>
  <el-menu
      :style="{width: (width || MaxWidth) + 'px'}"
      active-text-color="#fff"
      background-color="#1e222d"
      text-color="#7c878e"
      class="border-0"
      :collapse="isCollapse"
      unique-opened
      :default-active="active"
      router
  >
    <template v-for="menu of menus">
      <el-menu-item v-if="!menu.children?.length" :index="menu.path">
        <el-icon v-if="menu.icon">
          <component :is="menu.icon"/>
        </el-icon>
        <template #title>{{ menu.title }}</template>
      </el-menu-item>
      <el-sub-menu v-else :index="menu.path || ''">
        <template #title>
          <el-icon v-if="menu.icon">
            <component :is="menu.icon"/>
          </el-icon>
          <span>{{ menu.title }}</span>
        </template>
        <template v-for="subMenu of (menu.children || [])">
          <el-menu-item v-if="!subMenu.children?.length" :index="subMenu.path">
            <el-icon v-if="subMenu.icon">
              <component :is="subMenu.icon"/>
            </el-icon>
            <template #title>{{ subMenu.title }}</template>
          </el-menu-item>
          <el-sub-menu v-else :index="subMenu.path || ''">
            <template #title>
              <el-icon v-if="subMenu.icon">
                <component :is="subMenu.icon"/>
              </el-icon>
              <span>{{ subMenu.title }}</span>
            </template>
            <el-menu-item v-for="grandSubMenu of (subMenu.children || [])" :index="grandSubMenu.path">
              <template #title>
                <el-icon v-if="grandSubMenu.icon">
                  <component :is="grandSubMenu.icon"/>
                </el-icon>
                <span>{{ grandSubMenu.title }}</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import {Menu} from "../models/menu";
import {MaxWidth, MinWidth} from "../consts/sidebar";

defineProps<{isCollapse: boolean, width?: number, active: string, menus: Array<Menu>}>()
</script>
