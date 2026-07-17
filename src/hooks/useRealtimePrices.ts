import { useEffect, useRef, useCallback } from 'react'
import { useValuoStore } from '../store/valuoStore'

export function useRealtimePrices(refreshInterval: number = 10000) {
  const fetchAllPrices = useValuoStore((s) => s.fetchAllPrices)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const retryCountRef = useRef(0)
  const maxRetries = 5

  const fetchWithRetry = useCallback(async () => {
    let retries = 0
    while (retries < maxRetries) {
      try {
        await fetchAllPrices()
        retryCountRef.current = 0
        return
      } catch (error) {
        retries++
        retryCountRef.current = retries
        if (retries >= maxRetries) {
          console.error('Max retries reached for price fetch')
          return
        }
        const delay = Math.min(1000 * Math.pow(2, retries), 30000)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }, [fetchAllPrices])

  useEffect(() => {
    if (!navigator.onLine) {
      const handleOnline = () => {
        fetchWithRetry()
        window.removeEventListener('online', handleOnline)
      }
      window.addEventListener('online', handleOnline)
      return () => window.removeEventListener('online', handleOnline)
    }

    fetchWithRetry()

    intervalRef.current = setInterval(() => {
      if (navigator.onLine) {
        fetchWithRetry()
      }
    }, refreshInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [refreshInterval, fetchWithRetry])
}
