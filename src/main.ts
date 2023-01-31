import './style.css';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createApp } from 'vue';
import App from './App.vue';


import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import router from "./router";
import { store } from "./states";

// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(store)
app.use(router)
app.use(ElementPlus, { locale: zhCn })
app.mount('#app')
