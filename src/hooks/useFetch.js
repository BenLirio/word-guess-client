import { useState, useEffect } from 'react'
import axios from 'axios'

function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(url)
        setData(response.data)
        setError(null)
      } catch (err) {
        setError(err.message || 'Something went wrong')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    if (url) {
      fetchData()
    }

    return () => {
      // Cleanup if needed
    }
  }, [url])

  return { data, loading, error }
}

export default useFetch
