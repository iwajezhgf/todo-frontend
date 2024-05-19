import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useApp from '../hook/useApp'
import AppProvider from './AppProvider'

const pagesWithNoAuth = ['/login', '/register']

const AppRedirect = ({ children }) => {
  const { app } = useApp()
  const location = useLocation()

  if (!app.user) {
    if (!pagesWithNoAuth.includes(location.pathname))
      return <Navigate to="/login" state={{ from: location }} replace />
  } else {
    if (pagesWithNoAuth.includes(location.pathname)) {
      if (location.state?.from)
        return <Navigate to={location.state.from} replace />
      return <Navigate to="/" replace />
    }
  }

  return children
}

const Root = () => {
  return <AppProvider>
    <AppRedirect>
      <Outlet />
    </AppRedirect>
  </AppProvider>
}

export default Root