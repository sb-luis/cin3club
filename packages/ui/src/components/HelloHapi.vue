<script setup>
import { onMounted, ref, computed } from 'vue';

// DATA
const props = defineProps({
    server:{
        type: String,
        required: true,
    }
});
const loading = ref(true);
const dummyData = ref([]);
const endpoint = computed(() => {
    return 'http://localhost:' + props.server ?? '';
});

// FUNCS
// handy async recursive func for calling the API
const api = async (options = {method: 'GET'}) => {
    loading.value = true;
    console.log(`${options.method} ${endpoint.value}`);

    const res = await fetch(endpoint.value, options);
    const data = await res.json();
    console.log(data);

    if(options.method !== 'GET'){
        api(); // GET items after POST, PATCH, PUT or DELETE
    }else{
        // update data
        dummyData.value = data;
        loading.value = false;
    }
}
const handleCreateItem = () => api({method: 'POST'});
const handleDeleteItem = () => api({method: 'DELETE'});

onMounted(() => api()); // GET items when component is mounted 
</script>

<template>
    <div>
        <section class="endpoint-box">
            <h2>endpoint: <a :href="endpoint">{{endpoint}}</a></h2>
            <button @click="handleCreateItem" class="post-btn">POST</button>
            <button @click="handleDeleteItem" class="delete-btn">DELETE</button>
        </section>
        <section>
            <h2 v-if="loading">Loading...</h2>
            <h2 v-else="loading">Data:</h2>
            <table>
                <tr>
                    <th>Timestamp</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Path</th>
                </tr>
                <tr v-for="(item, i) in dummyData" :key="i">
                    <td>{{item.time}}</td>
                    <td>{{item.clientIp}}</td>
                    <td>{{item.serverHost}}</td>
                    <td>{{item.path}}</td>
                </tr>
            </table>
        </section>
    </div>
</template>

<style scoped>
.endpoint-box{
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

table td, table th {
    border: 0;
    padding: 8px;
}

tr{background: #222222;}
table tr:nth-child(even){background-color: #333333;}
table tr:hover {color: white;}

table th {
    padding-top: 4px;
    padding-bottom: 4px;
    text-align: left;
    background: #111111;
    color: grey;
    text-transform: uppercase;
    font-weight: 800;
}

/* BUTTONS */
button{
    padding: 0.50rem 1rem;
    margin-right: 0.95rem;
    border: 0;
    border-radius: 0.5rem;
    cursor: pointer;
    color: black;
}
.post-btn{background: #558866;}
.delete-btn{background: #AA4444;}
.post-btn:hover{background: #55BB66; color: white;}
.delete-btn:hover{background: #FF4444; color: white;}
</style>
