export interface Swiper {
  id?: number
  style?: string
  status?: number
  position?: number
  visible_begin?: string
  visible_ending?: string
  created_at?: string
  updated_at?: string
  items?: Array<SwiperItem>
}

export interface SwiperItem {
  image?: string
  target?: number
  resource?: string | null
}