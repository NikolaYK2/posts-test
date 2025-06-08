<script setup lang="ts">
import { ref, watch, onMounted, computed, defineProps, defineEmits, onUnmounted } from 'vue'
import { apiPosts } from '@/feature/posts/model/api'
import type { Article, Comment } from '@/feature/posts/model/types'
import { apiUsers } from '@/feature/users/model/api'

const props = defineProps<{ postId: number; allPosts: Article[] }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const currentId = ref(props.postId)
const postDetails = ref({ title: '', body: '', tags: [''] })
const authorName = ref('')
const authorCompany = ref('')
const comments = ref<Comment[]>([])
const isEditing = ref(false)
const editedTitle = ref('')
const editedBody = ref('')
const showComments = ref(false)
const isLoading = ref(false)
const error = ref<Error | null>(null)

const FIELDS = [
  { label: 'Тело поста:', item: editedBody },
  { label: 'Автор:', item: authorName },
  { label: 'Должность и отдел:', item: authorCompany },
] as const

// Загрузка деталей поста
const loadDetails = async (id: number) => {
  isLoading.value = true
  error.value = null
  try {
    const key = `postDetails_${id}`
    const stored = sessionStorage.getItem(key)
    if (stored) {
      const data = JSON.parse(stored)
      postDetails.value = data.post
      authorName.value = data.authorName
      authorCompany.value = data.authorCompany
      comments.value = data.comments
    } else {
      const post = await apiPosts.getPostsId(id)
      const user = await apiUsers.getUsers(id)
      const comm = await apiPosts.getComment(id)

      postDetails.value = post
      authorName.value = `${user.firstName} ${user.lastName}`
      authorCompany.value = `${user.company.title}, ${user.company.department}`
      comments.value = comm.comments

      sessionStorage.setItem(
        key,
        JSON.stringify({
          post,
          authorName: authorName.value,
          authorCompany: authorCompany.value,
          comments: comments.value,
        }),
      )
    }
    editedTitle.value = postDetails.value.title
    editedBody.value = postDetails.value.body
  } catch (err: unknown) {
    error.value = (err as Error) || new Error('Неизвестная ошибка')
  } finally {
    isLoading.value = false
  }
}
const load = () => loadDetails(currentId.value)

onMounted(load)
watch(
  () => props.postId,
  (id) => (currentId.value = id),
)
watch(currentId, load)

// Редактирование
const startEdit = () => {
  isEditing.value = true
  editedTitle.value = postDetails.value.title
  editedBody.value = postDetails.value.body
}

watch([editedTitle, editedBody], ([nt, nb]) => {
  isEditing.value = nt !== postDetails.value.title || nb !== postDetails.value.body
})

const saveEdit = async () => {
  isLoading.value = true
  error.value = null
  try {
    const res = await apiPosts.createPost({
      postId: currentId.value,
      title: editedTitle.value,
      body: editedBody.value,
    })
    postDetails.value = res
    sessionStorage.setItem(
      `postDetails_${currentId.value}`,
      JSON.stringify({
        post: res,
        authorName: authorName.value,
        authorCompany: authorCompany.value,
        comments: comments.value,
      }),
    )
    isEditing.value = false
  } catch (err: unknown) {
    error.value = (err as Error) || new Error('Неизвестная ошибка')
  } finally {
    isLoading.value = false
  }
}
// Навигация
const index = computed(() => props.allPosts.findIndex((p) => p.id === currentId.value))
const hasPrev = computed(() => index.value > 0)
const hasNext = computed(() => index.value < props.allPosts.length - 1)
const prevPost = () => {
  if (hasPrev.value) currentId.value = props.allPosts[index.value - 1].id
}
const nextPost = () => {
  if (hasNext.value) currentId.value = props.allPosts[index.value + 1].id
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
  }
}

// Закрыть модал
const close = () => emit('close')

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <section class="overlay" tabindex="-1" @click="close">
    <section class="containerModal" @click.stop>
      <section v-if="isLoading" class="loading">Загрузка...</section>
      <section v-if="error" style="color: red; text-align: center; margin: 10px">
        Ошибка: {{ error.message }}
      </section>
      <section class="modalHeader">
        <h2>{{ postDetails.title }}</h2>
        <button class="btnClose" @click="close">✖</button>
      </section>

      <section>
        <section class="field" v-for="field in FIELDS" :key="field.label">
          <label>{{ field.label }}</label>
          <textarea
            v-if="field.label === 'Тело поста:'"
            v-model="field.item.value"
            :disabled="!isEditing"
          />
          <input v-else type="text" :value="field.item.value" disabled />
        </section>

        <section class="field">
          <label>Теги:</label>
          <section class="tags">
            <span v-for="tag in postDetails.tags" :key="tag" class="tag">{{ tag }}</span>
          </section>
        </section>

        <section class="accordion">
          <button @click="showComments = !showComments" class="accordionButton">
            Комментарии ({{ comments.length }})
          </button>
          <section v-if="showComments" class="accordionContent">
            <div v-for="c in comments" :key="c.id" class="comment">
              <p>{{ c.body }}</p>
              <small>Автор: {{ c.user.username }}</small>
            </div>
          </section>
        </section>
      </section>

      <div class="modalFooter">
        <button v-if="!isEditing" @click="startEdit">Редактировать</button>
        <button v-if="isEditing" @click="saveEdit" class="save">Сохранить</button>
        <button class="prevBtn" @click="prevPost" :disabled="!hasPrev">Предыдущий</button>
        <button @click="nextPost" :disabled="!hasNext">Следующий</button>
      </div>
    </section>
  </section>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--vt-c-darck-opacity);
}

.containerModal {
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  max-width: 800px;
  width: 100%;
  background: var(--vt-c-black);
  color: var(--vt-c-white);
  border: 1px solid var(--vt-c-green);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 8px var(--vt-c-black);
  max-height: 90vh;
  overflow-x: auto;
  z-index: 1000;
}

.modalHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--vt-c-green);
}

.btnClose {
  background: transparent;
  color: var(--color-text);
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.btnClose:hover {
  color: var(--vt-c-error);
  transition: color 0.3s ease;
}

.field {
  margin-bottom: 12px;
}

.field label {
  display: block;
  margin-bottom: 4px;
  color: var(--color-text);
}

input,
textarea {
  width: 100%;
  padding: 6px;
  background: var(--vt-c-darck);
  border: 1px solid var(--color-text);
  border-radius: 4px;
  color: var(--vt-c-white);
  resize: none;
}

textarea {
  height: 100px;
}

input:disabled,
textarea:disabled {
  background: transparent;
  color: var(--color-text);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag {
  color: var(--vt-c-green);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.accordion {
  margin-top: 12px;
}

.accordionButton {
  width: 100%;
  text-align: left;
  background: var(--vt-c-darck);
  color: #eee;
  border: none;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background 0.3s ease,
    color 0.3s ease;
}

.accordionButton:hover {
  background: var(--vt-c-green);
  color: var(--vt-c-black);
  transition: all 0.3s ease;
}

.accordionContent {
  margin-top: 8px;
  background: #2a2a2a;
  padding: 8px;
  border-radius: 4px;
  overflow-y: auto;
  max-height: 200px;
}

.comment {
  border-bottom: 1px solid #444;
  padding: 4px 0;
}

.modalFooter {
  display: flex;
  margin-top: 16px;
}

.modalFooter button {
  padding: 6px 12px;
  border: none;
  background: var(--vt-c-green);
  color: var(--vt-c-black);
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.prevBtn {
  margin: 0 20px 0 auto;
}

.modalFooter button:hover:not(:disabled) {
  background: var(--vt-c-green-hover);
}

.modalFooter button:disabled {
  background: var(--vt-c-darck-disabled);
  cursor: not-allowed;
}

.modalFooter .save {
  background: var(--vt-c-blue);
  color: var(--vt-c-white);
}
</style>
