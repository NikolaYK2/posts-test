<template>
  <div id="app">
    <h1>Моё Vue-приложение</h1>
    <router-view />
    <PostsList />
  </div>
</template>

<script setup lang="ts">

import PostsList from '@/feature/posts/ui/PostsList.vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 20px;
}
</style>
