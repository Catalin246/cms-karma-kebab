<template>
  <div id="app">
    <h1>API Gateway Status</h1>
    <p v-if="status">Status: {{ status.status }}</p>
    <p v-else-if="error">Error: {{ error }}</p>
    <p v-else>Loading...</p>
  </div>
</template>

<script>
import axios from 'axios';
import process from 'process';

export default {
  data() {
    return {
      status: null,
      error: null
    };
  },
  mounted() {
    this.fetchHealthStatus();
  },
  methods: {
    async fetchHealthStatus() {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + '/health'
        );
        this.status = response.data;
      } catch (err) {
        this.error = 'Unable to reach the API Gateway';
        console.error(err);
      }
    }
  }
};
</script>

<style>
/* You can add your styles here */
</style>
