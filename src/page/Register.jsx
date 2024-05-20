import { useState } from 'react'
import { FloatingLabel, Form, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Wrapper from '../component/Wrapper'
import useTitle from '../hook/useTitle'
import { fetch0 } from '../lib/fetch'
import Notifications from '../lib/notifications'

const RegisterPage = () => {
  useTitle('Registration')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirm_password: ''
    }
  })

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (data) => {
    setLoading(true)

    try {
      const response = await fetch0('/register', {
        method: 'POST',
        body: {
          email: data.email,
          password: data.password
        }
      })
      const body = await response.json()

      if (body.ok) {
        navigate('/login')
      } else {
        switch (body.response.code) {
          case 'already_exists':
            Notifications.error('User with this email already exists')
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
    <Form onSubmit={handleSubmit(submit)}>
      <h4 className="text-center mb-4">Registration</h4>

      <FloatingLabel
        controlId="email"
        label="Email"
        className="mb-3"
      >
        <Form.Control
          type="email"
          placeholder=""
          {...register('email', {
            required: 'Fill in this field',
            validate: (val) => {
              if (!/^[0-9a-zA-Z_\-.@]+$/.test(val))
                return 'Email contains invalid characters'
              if (!/^[0-9a-zA-Z_-]+(?:\.[0-9a-zA-Z_-]+)*@[0-9a-z-]+(?:\.[0-9a-z-]+)+$/.test(val))
                return 'Incorrect email address'
            }
          })}
          isInvalid={!!errors.email}
        />
        {errors.email && <Form.Control.Feedback type="invalid">{errors.email.message}</Form.Control.Feedback>}
      </FloatingLabel>

      <FloatingLabel
        controlId="password"
        label="Password"
        className="mb-3"
      >
        <Form.Control
          type="password"
          placeholder=""
          {...register('password', {
            required: 'Fill in this field',
            minLength: {
              value: 8,
              message: 'Minimum password length - 6 characters'
            },
            maxLength: {
              value: 40,
              message: 'Maximum password length - 40 characters'
            },
            deps: ['password_confirm']
          })} isInvalid={!!errors.password}
        />
        {errors.password && <Form.Control.Feedback type="invalid">{errors.password.message}</Form.Control.Feedback>}
      </FloatingLabel>

      <FloatingLabel
        controlId="password_confirm"
        label="Confirm password"
        className="mb-3"
      >
        <Form.Control
          type="password"
          placeholder=""
          {...register('password_confirm', {
            validate: (val) => {
              if (watch('password') !== val)
                return 'Passwords must match'
            }
          })} isInvalid={!!errors.password_confirm}
        />
        {errors.password_confirm &&
          <Form.Control.Feedback type="invalid">{errors.password_confirm.message}</Form.Control.Feedback>}
      </FloatingLabel>

      <button className="btn btn-lg btn-primary w-100 mt-2 mb-4" type="submit" disabled={loading}>
        {loading && <Spinner className="align-baseline" as="span" size="sm" aria-hidden="true" />}
        {loading ? ' Loading...' : 'Submit'}
      </button>
    </Form>
  </Wrapper>
}

export default RegisterPage