<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
      <h2 class="text-2xl font-bold mb-4 text-violet-600">You're logged out!</h2>
      <p class="mb-4 text-violet-600">Do you want to login again?</p>
      <button
        @click="loginAgain"
        class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
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
      console.log("Redirecting to login page...");
      this.$router.push( "/login" ); // Assuming the login route is named 'login'
    }   
  },
};
</script>
