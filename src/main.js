import { createApp } from "vue";
import './style.css';
import App from "./App.vue";
import Login from "./login.vue";
import RootApp from "./root.vue";
import { createRouter, createWebHistory } from "vue-router";
import { initKeycloak, isAdmin } from './keycloak';

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { 
    path: "/cms", 
    component: App, 
    beforeEnter: async (to, from, next) => {
      try {
        const keycloak = await initKeycloak();
        if (isAdmin()) {
          next();  // Proceed to /cms if the user is an admin
        } else {
          next('/login');  // Redirect to login if not an admin
        }
      } catch (error) {
        next('/login');  // Redirect to login on failure
      }
    } 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(RootApp);
app.use(router);
app.mount("#app");
