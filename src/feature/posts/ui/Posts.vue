<script setup lang="ts">
import { usePosts } from '@/feature/posts/model/hooks'

const { posts, isLoading, error, fetchUsers } = usePosts()

const fields = ['id', 'title', 'body'] as const
</script>

<template>
  <div>
    <h2>Список пользователей</h2>

    <div v-if="isLoading">Загрузка...</div>

    <div v-else-if="error">Ошибка: {{ error.message }}</div>

    <table v-else>
      <thead>
        <tr>
          <th v-for="field in fields" :key="field">{{ field }}</th>
          <th>likes</th>
          <th>dislikes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post.id">
          <td v-for="field in fields" :key="field">
            <template v-if="field === 'body'">
              {{ post.body.length > 100 ? post.body.slice(0, 100) + '...' : post.body }}
            </template>

            <template v-else>
              {{ post[field] }}
            </template>
          </td>
          <td>{{ post.reactions.likes }}</td>
          <td>{{ post.reactions.dislikes }}</td>
        </tr>
      </tbody>
    </table>
    <!-- Кнопка для ручного обновления -->
    <button @click="fetchUsers">Обновить список</button>
  </div>
</template>

<style scoped></style>
