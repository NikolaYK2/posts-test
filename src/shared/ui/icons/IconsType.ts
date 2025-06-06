import LikeSvg from '@/shared/ui/icons/LikeSvg.vue'
import DislikeSvg from '@/shared/ui/icons/DislikeSvg.vue'

export const iconsType = {
  like: LikeSvg,
  dislike: DislikeSvg,
} as const

export type IconsId = keyof typeof iconsType
