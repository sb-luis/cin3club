<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRequestStore } from '../stores/RequestStore';

const requestStore = useRequestStore();

onMounted(() => requestStore.getRequests());
</script>

<template>
  <div>
    <div class="pb-2">
      <button @click="requestStore.postRequest()" class="bg-green-800 mr-2 px-2 rounded">
        POST
      </button>
      <button @click="requestStore.deleteRequests()" class="bg-red-800 px-2 rounded">DELETE</button>
    </div>
    <div>
      <h2 v-if="requestStore.isLoading">Loading...</h2>
      <h2 class="py-2" v-else>Requests:</h2>
      <table>
        <tr>
          <th>Timestamp</th>
          <th>From</th>
          <th>To</th>
          <th>Path</th>
        </tr>
        <tr v-for="(request, i) in requestStore.requests" :key="i">
          <td>{{ request.time }}</td>
          <td>{{ request.clientIp }}</td>
          <td>{{ request.serverHost }}</td>
          <td>{{ request.path }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
.endpoint-box {
  border: 5px solid grey;
  border-top: 0;
  border-bottom: 0;
  border-radius: 0.5rem;
  padding: 1rem 1.45rem;
  width: 440px;
  margin: auto;
}

/* TABLES */
table {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

table td,
table th {
  border: 0;
  padding: 8px;
}

tr {
  background: #222222;
}
table tr:nth-child(even) {
  background-color: #333333;
}
table tr:hover {
  color: white;
}

table th {
  padding-top: 4px;
  padding-bottom: 4px;
  text-align: left;
  background: #111111;
  color: grey;
  text-transform: uppercase;
  font-weight: 800;
}
</style>
