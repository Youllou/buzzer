
import { createApp } from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import app from './App.vue'

import './assets/main.css'
import Entry from "@/components/Entry.vue";
import Host from "@/components/Host.vue";
import Player from "@/components/Player.vue";

const routes = [
    { name:"entry", path: '/', component: Entry },
    { name:"host", path: '/host/:room(\\d+)', component: Host },
    { name:"player", path: '/player/:room(\\d+)', component: Player},
]

const router = createRouter({
    routes: routes,
    history: createWebHistory()
});


createApp(app).use(router).mount('#app')