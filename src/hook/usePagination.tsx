import { useEffect, useState } from 'react'
import Pagination from '../component/Pagination'

interface Pagination {
  prev: Array<number>
  next: Array<number>
}

interface PaginationResponse {
  pagination: Pagination
  items: Array<object>
}

const hasPages = (pagination?: Pagination) => {
  return !!pagination && (pagination.prev.length > 0 || pagination.next.length > 0)
}

const usePagination = (request: (page: number) => Promise<Response>) => {
  const [page, setPage] = useState(0)
  const [data, setData] = useState<PaginationResponse | null>(null)
  const [items, setItems] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = () => {
    if (loading) return
    setLoading(true)

    request(page)
      .then(res => {
        if (res.ok) return res.json()
        else throw new Error('Invalid response')
      })
      .then(body => {
        setError(null)
        setData(body.response)
        setItems(body.response.items)
      })
      .catch(e => {
        setError(e)
        setData(null)
        setItems(null)
      })
      .finally(() => setLoading(false))
  }

  useEffect(load, [page])

  return {
    page,
    setPage,
    items,
    setItems,
    error,
    loading,
    load,
    hasPages: hasPages(data?.pagination),
    component: <Pagination
      pagination={data?.pagination}
      onChange={setPage}
      loading={loading}
    />
  }
}

export default usePagination