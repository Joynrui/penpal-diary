# Spring Boot Pen Pal Diary Platform

- 基于Spring Boot的笔友日记平台BS软件项目， 项目整体采用前后端分离框架，本项目为配套的前端项目。

## 项目技术

基本项目技术暂定为为以下框架：

1. Vue 做项目front-end的基础架构
2. element-ui 做页面元素的基础构建
3. less做CSS框架
4. CORS做项目的跨域资源共享策略
5. 项目产生的一切request 都由Axios提供的Ajax请求构成
6. 前后端数据交互格式为json
7. icon gallery 为 Fontawesome4
8. 页面切换使用 Vue Router
9. 状态管理使用 Vuex
10. front-end test 使用 MockJS

## 工具版本

- Vue.js  version 2.0
- element-ui 基于 Vue 2
- Fontawesome icon gallery 6

## 软件架构

前台设计由element-ui 为基础进行开发，后台设计基于 vue-element-admin修改而成。

## 目录说明

### src

api                    // 所有请求
assets                 // 主题 字体等静态资源
components             // 全局公用组件
directive              // 全局指令
filtres                // 全局 filter
icons                  // 项目所有 svg icons
lang                   // 国际化 language
mock                   // 项目mock 模拟数据
router                 // 路由
store                  // 全局 store管理
styles                 // 全局样式
utils                  // 全局公用方法，工具
vendor                 // 公用vendor
views                   // view

## 样式设计

### 主题色

基调色：

- famale: rgb(255,238,240)， #FFEEF0
- male: rgb(229,217,255) ， #E5D9FF
- base: rgb(214, 240, 238), #D6F0EE
