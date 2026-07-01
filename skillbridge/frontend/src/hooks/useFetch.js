import { useState, useEffect, useCallback } from 'react'

export function useFetch(fetchFn, deps = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      setData(result)
    } catch (e) {
      setError(e.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, deps)  // eslint-disable-line

  useEffect(() => { load() }, [load])

  return { data, loading, error, refetch: load }
}

export function useAsync(asyncFn) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const execute = async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFn(...args)
      return result
    } catch (e) {
      const msg = e.response?.data?.detail || 'Something went wrong'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { execute, loading, error }
}
