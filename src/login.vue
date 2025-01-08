<template>
      <router-view v-if="$route.path === '/login'"></router-view>
      <div class="login-container max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h1 class="text-2xl font-bold mb-6 text-gray-800 text-center">Login</h1>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username:</label>
            <input 
              v-model="username" 
              id="username" 
              type="text" 
              required 
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
            <input 
              v-model="password" 
              id="password" 
              type="password" 
              required 
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button 
            type="submit" 
            class="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Login
          </button>
          <p v-if="error" class="error text-red-500 text-sm mt-2">{{ error }}</p>
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
    const hardcodedPassword = "admin";

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
  