<template>
  <div id="app">
    <h1>Моё <span>Vue</span>-приложение</h1>
    <router-view />
    <PostsList />
  </div>
</template>

<script setup lang="ts">
import PostsList from '@/feature/posts/ui/PostsList.vue'
import './assets/base.css'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 3%;
}

h1 span {
  color: var(--vt-c-green);
}
</style>
