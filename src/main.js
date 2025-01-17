import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Login from "./login.vue";
import RootApp from "./root.vue";
import LoggedOut from "./components/LoggedOut.vue";
import UserLoginAttempt from "./components/UserAttemptLogin.vue";
import { createRouter, createWebHistory } from "vue-router";
import {jwtDecode} from "jwt-decode"; // For decoding the JWT

// Define the routes
const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/logged-out", component: LoggedOut },
  { path: "/user-login-attempt", component: UserLoginAttempt },
  {
    path: "/cms",
    component: App,
    meta: { requiresAuth: true }, // Mark this route as requiring authentication
  },
];

// Create the router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard to Check Authentication and Authorization
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      try {
        // Decode the token and check for the "admin" role
        const decodedToken = jwtDecode(accessToken);
        const roles = decodedToken.realm_access?.roles || [];

        if (roles.includes("admin")) {
          console.log("User is an admin");
          next(); // User is an admin, allow access
        } else {
          console.log("User is not an admin");
          next("/login"); // Not an admin, redirect to login
        }
      } catch (error) {
        console.log("Error decoding token:");
        next("/login"); // If token is invalid, redirect to login
      }
    } else {
      console.log("No token found");
      next("/login"); // No token found, redirect to login
    }
  } else {
    next(); // Route doesn't require authentication, allow access
  }
});

// Create and mount the app
const app = createApp(RootApp);
app.use(router);
app.mount("#app");
