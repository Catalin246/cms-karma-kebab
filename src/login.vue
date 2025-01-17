<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 class="text-4xl font-bold mb-4 text-violet-600">KARMA KEBAB ADMIN CMS</h2>
      <h2 class="text-2xl font-bold mb-4 text-violet-600">Login</h2>

      <!-- Display error message if login failed -->
      <div v-if="errorMessage" class="bg-red-100 text-red-700 p-2 rounded mb-4">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input type="text" id="username" v-model="username"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" id="password" v-model="password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required />
        </div>
        <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import keycloakService from "./keycloak.js";
import { jwtDecode } from "jwt-decode";

export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: null,  // This will store any error message
    };
  },
  methods: {
    async login() {
      console.log("Login attempt:", this.username);

      try {
        const response = await keycloakService.authenticate(
          this.username,
          this.password
        );

        if (response && response.data) {
          console.log("Login successful");

          // Clear any previous error message
          this.errorMessage = null;

          // Store the credentials in localStorage or Vuex
          const accessToken = response.data.access_token;
          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("refresh_token", response.data.refresh_token);

          // Decode the access token to extract roles
          const decodedToken = jwtDecode(accessToken);
          console.log("Decoded Token:", decodedToken);

          const roles = decodedToken.realm_access?.roles || [];
          console.log("Extracted Roles:", roles);

          // Store roles in localStorage
          localStorage.setItem("roles", JSON.stringify(roles));

          // Redirect based on role
          if (roles.includes("admin")) {
            console.log("User is authorized to log in as an admin.");
            this.$router.push({ path: "/cms" });
          } else {
            console.log("User is not authorized to log in as an admin.");
            this.errorMessage =
              "You do not have the necessary permissions to login to this CMS. Admin role is required.";
          }
        }
      } catch (error) {
        console.log("Login failed:", error);

        // Set error message for invalid credentials or other login issues
        this.errorMessage = "Invalid username or password."; // Show error message to user
      }
    },
  },
};
</script>

<style scoped>
/* Add any custom styling if needed */
</style>
