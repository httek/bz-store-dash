export interface CacheItem {
  key: string
  value: any
  ttl: number
}

export class Cache {
  static readonly prefix: string = 'n4'

  /**
   * Fetch item
   *
   * @param key
   */
  static get(key: string): any {
    if (!this.has(key)) {
      return null
    }

    const rawCacheItem: string | null = window.localStorage.getItem(this.cacheKey(key))
    const cacheItem: CacheItem = JSON.parse(rawCacheItem as string)

    return cacheItem.value
  }

  /**
   * Set item.
   *
   * @param key
   * @param value
   * @param ttl
   */
  static set(key: string, value: any, ttl: number) {
    const cacheItem: CacheItem = {key: this.cacheKey(key), value, ttl: (new Date).getTime() + (ttl * 1000)}
    window.localStorage.setItem(cacheItem.key, JSON.stringify(cacheItem))

    return true;
  }

  /**
   * Check a key exists or invalid
   * - valid cache ttl: expired
   *
   * @param key
   */
  static has(key: string): boolean {
    const rawCacheItem: string | null = window.localStorage.getItem(this.cacheKey(key))
    if (!rawCacheItem) {
      return false
    }

    const cacheItem: CacheItem = JSON.parse(rawCacheItem as string)

    if (cacheItem.ttl < (new Date).getTime()) {
      this.forget(key)

      return false
    }

    return true
  }


  /**
   * Set item with ttl 365 day.
   *
   * @param key
   * @param value
   */
  static forever(key: string, value: any) {
    return this.set(key, value, (new Date).getTime() + (3600 * 24 * 365))
  }

  /**
   * Delete a key
   *
   * @param key
   */
  static forget(key: string): boolean {
    window.localStorage.removeItem(this.cacheKey(key))

    return true
  }

  /**
   * Make cache key.
   *
   * @param key
   */
  static cacheKey(key: string): string {
    return [this.prefix, key].join(':')
  }
}
