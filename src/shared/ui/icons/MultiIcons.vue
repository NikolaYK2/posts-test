<script setup lang="ts">
import { computed } from 'vue'
import { type IconsId, iconsType } from './IconsType' // путь к index.ts внутри папки icons

const props = defineProps<{
  iconId: IconsId
}>()

const IconComponent = computed(() => {
  return iconsType[props.iconId] ?? null
})
</script>

<template>
  <component :is="IconComponent" v-if="IconComponent" v-bind="$attrs" />
</template>
