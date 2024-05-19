let tkn = localStorage.token ?? ''

// https://stackoverflow.com/a/8511350/21711976
const isObject = (obj: unknown): boolean => {
  return typeof obj === 'object' &&
    !Array.isArray(obj) &&
    obj !== null
}

interface FetchOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>
}

const setHeader = (header: string, value: string, options: FetchOptions = {}): void => {
  options.headers = { ...(options.headers || {}), [header]: value }
}

export const getToken = (): string => tkn

export const setToken = (token?: string): void => {
  tkn = token
  if (token)
    localStorage.token = token
  else
    localStorage.removeItem('token')
}

export const fetch0 = async (path: string, options: FetchOptions = {}): Promise<Response> => {
  if (tkn)
    setHeader('Authorization', `Bearer ${tkn}`, options)

  if (isObject(options.body) && !(options.body instanceof FormData)) {
    setHeader('Content-Type', 'application/json', options)
    options.body = JSON.stringify(options.body)
  }

  const url = import.meta.env.VITE_API_ENDPOINT + path
  return await fetch(url, options)
}