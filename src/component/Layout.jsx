import { DropdownButton, Dropdown } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import useApp from '../hook/useApp'
import MainMenu from './MainMenu'

const themes = {
  'light': {
    name: 'Light',
    icon: 'sun-fill'
  },
  'dark': {
    name: 'Dark',
    icon: 'moon-fill'
  }
}

const ThemeSelector = () => {
  const { app, updateApp } = useApp()

  const handleTheme = () => {
    const newTheme = app.theme === 'light' ? 'dark' : 'light'
    updateApp({ theme: newTheme })
  }

  return <DropdownButton
    title="Select theme"
    id="dropdown-theme-selector"
    variant="primary"
    className="position-fixed bottom-0 end-0 m-4"
  >
    {Object.keys(themes).map((themeKey) => (
      <Dropdown.Item
        key={themeKey}
        onClick={() => handleTheme(themeKey)}
        active={app.theme === themeKey}
      >
        <i className={`my-1 bi bi-${themes[themeKey].icon}`} /> {themes[themeKey].name}
      </Dropdown.Item>
    ))}
  </DropdownButton>
}

const Layout = () => {
  return <div className="d-flex flex-column min-vh-100">
    <MainMenu />
    <div className="container mt-4 flex-grow-1">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-12 col-12">
          <Outlet />
        </div>
      </div>
    </div>
    <ThemeSelector />
  </div>
}

export default Layout