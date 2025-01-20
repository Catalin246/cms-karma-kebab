<!-- UserLoginAttempt.vue -->
<template>
  <div class="h-screen w-full flex items-center justify-center bg-gray-800">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-yellow-500 mb-4">Access Denied</h1>
      <p class="text-xl text-white mb-4">You do not have permission to access this CMS as a regular user.</p>
      <p class="mb-4 text-white">If you believe you should have access, please contact an admin.</p>
      <button 
        @click="requestAccess" 
        class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        Request Access
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    requestAccess() {
      // Redirect to a page or form where the user can request access (you can customize this)
      alert("Please contact your admin to request higher access.");
    }
  }
}
</script>

<style scoped>
/* The background color has been changed to dark grey (bg-gray-800) */
</style>
