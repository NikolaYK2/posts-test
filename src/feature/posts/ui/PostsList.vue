<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePosts, useSearchPosts } from '@/feature/posts/model/hooks'
import MultiIcons from '@/shared/ui/icons/MultiIcons.vue'
import type { Article } from '@/feature/posts/model/types'

const { posts, totalPages, currentPage, isLoading, error } = usePosts(10)

const filterByLikes = ref('')
const filterByDislikes = ref('')
const { filterById, titleQuery, bodyQuery, searchResults, explicitIdResult, idError } =
  useSearchPosts()

const fields = [
  { title: 'id', value: filterById, placeholder: 'поиск id' },
  { title: 'title', value: titleQuery, placeholder: 'поиск title' },
  { title: 'body', value: bodyQuery, placeholder: 'поиск body' },
  { title: 'likes', value: filterByLikes, placeholder: 'поиск likes' },
  { title: 'dislikes', value: filterByDislikes, placeholder: 'поиск dislikes' },
] as const

// Итоговый список
const filteredPosts = computed<Article[]>(() => {
  if (explicitIdResult.value) return [explicitIdResult.value]

  const base = searchResults.value ?? posts.value
  return base
    .filter((p) => {
      const v = filterByLikes.value.trim()
      if (!v) return true
      const n = Number(v)
      return !isNaN(n) && p.reactions.likes === n
    })
    .filter((p) => {
      const v = filterByDislikes.value.trim()
      if (!v) return true
      const n = Number(v)
      return !isNaN(n) && p.reactions.dislikes === n
    })
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []

  if (totalPages.value <= 3) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    if (currentPage.value <= 2) {
      pages.push(1, 2, 3, '...')
    } else if (currentPage.value >= totalPages.value - 1) {
      pages.push('...', totalPages.value - 2, totalPages.value - 1, totalPages.value)
    } else {
      pages.push('...', currentPage.value - 1, currentPage.value, currentPage.value + 1, '...')
    }
  }
  return pages
})
</script>

<template>
  <div>
    <h2>Список постов</h2>
    <span style="display: flex; color: var(--vt-c-error); height: 20px">{{ idError }}</span>

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

    <div
      v-if="totalPages > 1 && !isLoading"
      style="margin-top: 16px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap"
    >
      <button :disabled="currentPage === 1" @click="currentPage = 1">{{ '<<' }}</button>

      <button :disabled="currentPage === 1" @click="currentPage--">Prev</button>

      <button
        v-for="page in visiblePages"
        :key="page"
        :disabled="page === '...'"
        :style="[
          page === currentPage && { fontWeight: 'bold' },
          page === currentPage && { background: 'var(--vt-c-green)' },
        ]"
        @click="typeof page === 'number' && (currentPage = page)"
      >
        {{ page }}
      </button>

      <button :disabled="currentPage === totalPages" @click="currentPage++">Next</button>

      <button :disabled="currentPage === totalPages" @click="currentPage = totalPages">>></button>
    </div>
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

button {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  padding: 5px;
  cursor: pointer;
  background: transparent;
  transition: background 0.3s ease;

  &:not(:disabled):hover {
    background: var(--vt-c-green);
    transition: background 0.3s ease;
  }
}
</style>
