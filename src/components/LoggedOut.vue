<!-- LoggedOut.vue -->
<template>
    <div class="h-screen w-full flex items-center justify-center bg-gray-800">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-red-500 mb-4">Logged Out</h1>
        <p class="text-xl mb-4 text-white">You have been logged out successfully.</p>
        <button 
          @click="loginAgain" 
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login Again
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      loginAgain() {
        // Redirect to the login page to initiate the Keycloak login flow
        this.$router.push('/login');
      }
    }
  }
  </script>
  
  <style scoped>
  /* The background color has been changed to dark grey (bg-gray-800) */
  </style>
  