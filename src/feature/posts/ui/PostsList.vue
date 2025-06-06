<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePosts } from '@/feature/posts/model/hooks'
import MultiIcons from '@/shared/ui/icons/MultiIcons.vue'

const { posts, isLoading, error, fetchUsers } = usePosts()

const idFilter = ref('')
const titleFilter = ref('')
const bodyFilter = ref('')
const likesFilter = ref('')
const dislikesFilter = ref('')

const fields = [
  { title: 'id', value: idFilter, placeholder: 'поиск id' },
  { title: 'title', value: titleFilter, placeholder: 'поиск title' },
  { title: 'body', value: bodyFilter, placeholder: 'поиск body' },
  { title: 'likes', value: likesFilter, placeholder: 'поиск likes' },
  { title: 'dislikes', value: dislikesFilter, placeholder: 'поиск dislikes' },
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
          <th
            v-for="field in fields"
            :key="field.title"
            :style="field.title === 'id' && 'width: 70px; text-align: center;'"
          >
            <h3
              :style="[
                field.title === 'dislikes' && { color: 'red' },
                field.title === 'likes' && { color: 'var(--vt-c-green)' },
              ]"
            >
              {{ field.title }}
            </h3>
            <input v-model="field.value.value" :placeholder="field.placeholder" />
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
          <td style="text-align: center; color: var(--vt-c-green)">
            <div style="display: flex; align-items: center; justify-content: center; gap: 4px 8px">
              {{ post.reactions.likes }}
              <MultiIcons icon-id="like" width="20" height="20" />
            </div>
          </td>
          <td style="color: red">
            <div style="display: flex; align-items: center; justify-content: center; gap: 4px 8px">
              {{ post.reactions.dislikes }}
              <MultiIcons icon-id="dislike" width="20" height="20" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <button @click="fetchUsers">Обновить список</button>
  </div>
</template>

<style scoped>
h2,
h3 {
  color: var(--vt-c-white);
  text-transform: uppercase;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border-bottom: 1px solid var(--vt-c-green);
  padding: 1% 5px;
}

tbody tr:hover {
  background: var(--vt-c-divider-dark-1);
  cursor: pointer;
  transition: background 0.3s ease;
}

input {
  padding: 4px;
  width: 100%;
  font-size: 0.9rem;
  background: transparent;
  border: none;
  border-top: 1px solid var(--color-text);
  color: var(--vt-c-green);

  &:focus {
    outline: none;
  }
}
</style>
