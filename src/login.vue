<template>
      <router-view v-if="$route.path === '/login'"></router-view>
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="username">Username:</label>
          <input v-model="username" id="username" type="text" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input v-model="password" id="password" type="password" required />
        </div>
        <button type="submit">Login</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: "",
        password: "",
        error: "",
      };
    },
    methods: {
  handleLogin() {
    const hardcodedUsername = "admin";
    const hardcodedPassword = "password123";

    // Check if the entered username and password match the hardcoded values
    if (this.username === hardcodedUsername && this.password === hardcodedPassword) {
      // Redirect to the /cms page
      this.$router.push("/cms"); // Push to CMS route
    } else {
      // Set an error message if the credentials are incorrect
      this.error = "Invalid username or password!";
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
  