<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePosts } from '@/feature/posts/model/hooks'

const { posts, isLoading, error, fetchUsers } = usePosts()

const idFilter = ref('')
const titleFilter = ref('')
const bodyFilter = ref('')
const likesFilter = ref('')
const dislikesFilter = ref('')

const fields = ['id', 'title', 'body'] as const
const fieldsFilter = [
  { value: idFilter.value, placeholder: 'поиск id' },
  { value: titleFilter.value, placeholder: 'поиск title' },
  { value: bodyFilter.value, placeholder: 'поиск body' },
  { value: likesFilter.value, placeholder: 'поиск likes' },
  { value: dislikesFilter.value, placeholder: 'поиск dislikes' },
] as const

const filteredPosts = computed(() => {
  const fId = idFilter.value.trim().toLowerCase()
  const fTitle = titleFilter.value.trim().toLowerCase()
  const fBody = bodyFilter.value.trim().toLowerCase()
  const fLikes = likesFilter.value.trim().toLowerCase()
  const fDislikes = dislikesFilter.value.trim().toLowerCase()

  return posts.value.filter((post) => {
    const matchId = !fId || post.id.toString().toLowerCase().includes(fId)
    const matchTitle = !fTitle || post.title.toLowerCase().includes(fTitle)
    const matchBody = !fBody || post.body.toLowerCase().includes(fBody)
    const matchLikes = !fLikes || post.reactions.likes.toString().includes(fLikes)
    const matchDislikes = !fDislikes || post.reactions.dislikes.toString().includes(fDislikes)
    return matchId && matchTitle && matchBody && matchLikes && matchDislikes
  })
})
</script>

<template>
  <div>
    <h2>Список постов</h2>

    <div v-if="isLoading">Загрузка...</div>
    <div v-else-if="error">Ошибка: {{ error.message }}</div>

    <table v-else>
      <thead>
        <tr>
          <th v-for="field in fields" :key="field">{{ field }}</th>
          <th>likes</th>
          <th>dislikes</th>
        </tr>

        <tr>
          <th v-for="(fieldFilter, index) in fieldsFilter" :key="index">
            <input v-model="fieldFilter.value" :placeholder="fieldFilter.placeholder" />
          </th>
        </tr>
      </thead>

      <tbody>

        <tr v-for="post in filteredPosts" :key="post.id">
          <td>{{ post.id }}</td>
          <td>{{ post.title }}</td>
          <td>
            {{ post.body.length > 100 ? post.body.slice(0, 100) + '...' : post.body }}
          </td>
          <td>{{ post.reactions.likes }}</td>
          <td>{{ post.reactions.dislikes }}</td>
        </tr>
      </tbody>
    </table>

    <button @click="fetchUsers">Обновить список</button>
  </div>
</template>

<style scoped>
input {
    padding: 4px;
    font-size: 0.9rem;
}

</style>
