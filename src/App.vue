<template>
  <div id="app">
    <h1>Моё Vue-приложение</h1>
    <router-view />
    <Posts />
  </div>
</template>

<script setup lang="ts">

import Posts from '@/feature/posts/ui/Posts.vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 20px;
}
</style>
