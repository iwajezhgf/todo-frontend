import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import useApp from '../hook/useApp'

const UserCard = () => {
  const { logout } = useApp()
  return <Nav>
    <Nav.Link className="text-danger" onClick={logout}>
      <i className="bi bi-power" /> Logout
    </Nav.Link>
  </Nav>
}

const MainMenu = () => {
  return <Navbar bg="body" expand="md" className="shadow-sm">
    <Container>
      <Navbar.Brand className="p-0 me-0 me-md-4 fs-4 fw-bold">
        <Link
          to="/"
          className="text-primary text-decoration-none"
        >
          TODO
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="main-nav-offcanvas" className="border-0">
        <i className="bi bi-list" style={{ fontSize: '130%' }} />
      </Navbar.Toggle>
      <Navbar.Offcanvas
        id="main-nav-offcanvas"
        aria-labelledby="main-nav-offcanvas-label"
        placement="end"
        scroll={false}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title id="main-nav-offcanvas-label">
            Shop
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="align-items-center">
          <Nav className="flex-grow-1">
            <Nav.Link href="https://github.com/iwajezhgf" target="_blank">Repository</Nav.Link>
          </Nav>

          <UserCard />
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </Container>
  </Navbar>
}

export default MainMenu