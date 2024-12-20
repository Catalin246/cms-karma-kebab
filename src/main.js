import { createApp } from "vue";
import './style.css';
import App from "./App.vue";
import Login from "./login.vue";
import RootApp from "./root.vue";  
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/cms", component: App },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(RootApp);
app.use(router);
app.mount("#app");