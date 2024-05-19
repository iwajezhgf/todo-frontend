import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { AppContext } from '../hook/useApp'
import useTitle from '../hook/useTitle'
import { fetch0, getToken, setToken } from '../lib/fetch'

const Preloader = () => {
  useTitle('Loading...')
  return <div className="d-flex justify-content-center align-items-center min-vh-100">
    <Spinner variant="secondary" animation="grow" />
  </div>
}

const AppProvider = ({ children }) => {
  const [app, setApp] = useState(() => {
    return {
      theme: localStorage.getItem('theme')
    }
  })
  const [loading, setLoading] = useState(!!getToken())

  const updateApp = values => {
    setApp((prev) => {
      const clone = { ...prev, ...values }

      if (prev.theme !== clone.theme) {
        if (clone.theme)
          localStorage.setItem('theme', clone.theme)
        else
          localStorage.removeItem('theme')
      }

      return clone
    })
  }

  const auth = () => {
    fetch0('/auth')
      .then(r => r.json())
      .then(body => {
        if (body.ok) {
          updateApp({
            user: body.response
          })
          setLoading(false)
        } else {
          if (body.response.code === 'unauthorized') {
            setToken(undefined)
            updateApp({
              user: undefined
            })
            setLoading(false)
          } else {
            setLoading(false)
          }
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const logout = () => {
    fetch0('/logout', { method: 'POST' })
    setToken(undefined)
    updateApp({
      user: undefined
    })
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', app.theme)
  }, [app.theme])

  useEffect(() => {
    if (getToken()) {
      auth()
    }

    const localTheme = localStorage.theme
    if (localTheme) {
      updateApp({ theme: localTheme })
    }
  }, [])

  const value = { app, updateApp, auth, logout }

  if (loading)
    return <Preloader preloader />

  return <AppContext.Provider value={value}>
    {children}
  </AppContext.Provider>
}

export default AppProvider