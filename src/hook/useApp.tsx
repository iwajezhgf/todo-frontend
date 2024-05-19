import { createContext, useContext } from 'react'

interface AppContextWrapper {
  app: App
  updateApp: (values: App) => void
  auth: () => Promise<void>
  logout: () => Promise<void>
}

interface App {
  user?: User
  theme: 'dark' | 'light' | null
}

interface User {
  id: number
  email: string
}

export const AppContext = createContext<AppContextWrapper>(null!)

export default () => useContext(AppContext)