import { useState } from 'react'
import { FloatingLabel, Form, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Wrapper from '../component/Wrapper'
import useApp from '../hook/useApp'
import useTitle from '../hook/useTitle'
import { fetch0, setToken } from '../lib/fetch'
import Notifications from '../lib/notifications'

const LoginPage = () => {
  useTitle('Authorization')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const { updateApp } = useApp()

  const submit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    setLoading(true)

    try {
      const response = await fetch0('/login', {
        method: 'POST',
        body: {
          email,
          password
        }
      })
      const body = await response.json()

      if (body.ok) {
        setToken(body.response.token)
        updateApp({
          user: body.response.auth
        })
        navigate('/')
      } else {
        switch (body.response.code) {
          case 'invalid_credentials':
            Notifications.error('Incorrect email or password')
            break
          default:
            Notifications.error(body.response.message)
        }
      }
    } catch (e) {
      Notifications.error('Unable to connect to server')
    }

    setLoading(false)
  }

  return <Wrapper>
    <Form onSubmit={submit}>
      <h4 className="text-center mb-4">Authorization</h4>

      <FloatingLabel
        controlId="email"
        label="Email"
        className="mb-3"
      >
        <Form.Control
          type="email"
          placeholder=""
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </FloatingLabel>

      <FloatingLabel
        controlId="password"
        label="Password"
        className="mb-3"
      >
        <Form.Control
          type="password"
          placeholder=""
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </FloatingLabel>

      <button className="btn btn-lg btn-primary w-100 mt-2 mb-4" type="submit" disabled={loading}>
        {loading && <Spinner className="align-baseline" as="span" size="sm" aria-hidden="true" />}
        {loading ? ' Loading...' : 'Submit'}
      </button>

      <p className="text-center">Not registered yet? <Link to="/register">Register</Link></p>
    </Form>
  </Wrapper>
}

export default LoginPage