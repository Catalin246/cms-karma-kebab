<template>
  <div v-if="!keycloak">
    <p>Loading...</p>
  </div>

  <div v-else>
    <h1 class="text-2xl font-bold mb-6 text-gray-800 text-center">Login</h1>
    <p v-if="error" class="error text-red-500 text-sm mt-2">{{ error }}</p>
  </div>
</template>

<script>
import { initKeycloak, isAdmin, getToken } from './keycloak.js';

export default {
  data() {
    return {
      error: "",
      keycloak: null,
    };
  },
  created() {
    this.initializeKeycloak();
  },
  methods: {
    async initializeKeycloak() {
      try {
        this.keycloak = await initKeycloak();
        if (isAdmin()) {
          // Redirect to /cms if the user is an admin
          this.$router.push("/cms");
        } else {
          this.$router.push("/user-login-attempt");
          this.error = "You do not have permission to access this CMS.";
        }
      } catch (error) {
        this.error = "Login failed: " + error;
      }
    },
  },
};
</script>

<style scoped>
  .login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .error {
    color: red;
    margin-top: 10px;
  }
</style>