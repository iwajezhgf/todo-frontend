import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import TodoSectionCard from '../component/TodoSectionCard'
import useTitle from '../hook/useTitle'
import { EVENT_UPDATE_TODOS, EventBus } from '../lib/eventbus'
import { fetch0 } from '../lib/fetch'
import Notifications from '../lib/notifications'

const NewTodo = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      note: '',
      expire: ''
    }
  })

  const [loading, setLoading] = useState(false)

  const submit = async (data) => {
    setLoading(true)

    try {
      const response = await fetch0('/todo', {
        method: 'POST',
        body: {
          title: data.title,
          note: data.note,
          expire: format(new Date(data.expire), 'yyyy-MM-dd HH:mm:ss')
        }
      })
      const body = await response.json()

      if (body.ok) {
        Notifications.success('To-do successfully added')
        EventBus.emit(EVENT_UPDATE_TODOS)
        reset()
      } else {
        switch (body.response.code) {
          default:
            Notifications.error(body.response.message)
        }
      }
    } catch (e) {
      Notifications.error('Unable to connect to server')
    }

    setLoading(false)
  }

  return <>
    <div className="card px-3 mb-4">
      <div className="card-header">
        <h4 className="mb-0">New</h4>
      </div>
      <div className="card-body">
        <Form onSubmit={handleSubmit(submit)}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              {...register('title', {
                required: 'Fill in this field'
              })}
              isInvalid={!!errors.title}
            />
            {errors.title && <Form.Control.Feedback type="invalid">{errors.title.message}</Form.Control.Feedback>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="note">
            <Form.Label>Note</Form.Label>
            <Form.Control
              as="textarea"
              {...register('note', {
                required: 'Fill in this field'
              })}
              isInvalid={!!errors.note}
            />
            {errors.note && <Form.Control.Feedback type="invalid">{errors.note.message}</Form.Control.Feedback>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="expire">
            <Form.Label>Expire</Form.Label>
            <Form.Control
              type="datetime-local"
              {...register('expire', {
                required: 'Fill in this field'
              })}
              isInvalid={!!errors.expire}
            />
            {errors.expire && <Form.Control.Feedback type="invalid">{errors.expire.message}</Form.Control.Feedback>}
          </Form.Group>

          <button className="btn btn-lg btn-primary mt-2" type="submit" disabled={loading}>
            {loading && <Spinner className="align-baseline" as="span" size="sm" aria-hidden="true" />}
            {loading ? ' Loading...' : 'Submit'}
          </button>
        </Form>
      </div>
    </div>
  </>
}

const PasswordModal = ({ show, close }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      old_password: '',
      new_password: '',
      new_password2: ''
    }
  })
  const [loading, setLoading] = useState(false)

  const submit = async (data) => {
    setLoading(true)

    try {
      const response = await fetch0('/settings/password', {
        method: 'POST',
        body: {
          old_password: data.old_password,
          new_password: data.new_password
        }
      })
      const body = await response.json()
      if (body.ok) {
        Notifications.success('Password has been successfully changed')
        close()
      } else {
        switch (body.response.code) {
          case 'invalid_credentials':
            Notifications.error('Current password is incorrect')
            break
          case 'password_equals':
            Notifications.error('Current and new passwords match')
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

  return <Modal show={show} onHide={close}>
    <Form onSubmit={handleSubmit(submit)}>
      <Modal.Header closeButton>
        <Modal.Title>Change password</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3" controlId="old_password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            {...register('old_password', {
              required: 'Fill in this field'
            })}
            isInvalid={!!errors.old_password}
            type="password"
          />
          {errors.old_password &&
            <Form.Control.Feedback type="invalid">{errors.old_password.message}</Form.Control.Feedback>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="new_password">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            {...register('new_password', {
              required: 'Fill in this field',
              minLength: {
                value: 8,
                message: 'Minimum password length - 8 characters'
              },
              maxLength: {
                value: 40,
                message: 'Maximum password length - 40 characters'
              },
              deps: ['new_password2']
            })}
            isInvalid={!!errors.new_password}
            type="password"
          />
          {errors.new_password &&
            <Form.Control.Feedback type="invalid">{errors.new_password.message}</Form.Control.Feedback>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="new_password2">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            {...register('new_password2', {
              validate: (val) => {
                if (watch('new_password') !== val)
                  return 'Passwords must match'
              }
            })}
            isInvalid={!!errors.new_password2}
            type="password"
          />
          {errors.new_password2 &&
            <Form.Control.Feedback type="invalid">{errors.new_password2.message}</Form.Control.Feedback>}
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading && <Spinner className="align-baseline" as="span" size="sm" aria-hidden="true" />}
          {loading ? ' Loading...' : 'Submit'}
        </Button>
      </Modal.Footer>
    </Form>
  </Modal>
}

const EditTodoModal = ({ show, close, item }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      note: '',
      expire: ''
    }
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const formatExpire = item?.expire ? format(new Date(item?.expire), 'yyyy-MM-dd HH:mm:ss') : ''
    setValue('title', item?.title)
    setValue('note', item?.note)
    setValue('expire', formatExpire)
  }, [item])

  const submit = async (data) => {
    setLoading(true)

    try {
      const response = await fetch0('/todo', {
        method: 'PUT',
        body: {
          id: item.id,
          title: data.title,
          note: data.note,
          expire: format(new Date(data.expire), 'yyyy-MM-dd HH:mm:ss')
        }
      })
      const body = await response.json()

      if (body.ok) {
        Notifications.success('To-do successfully changed')
        EventBus.emit(EVENT_UPDATE_TODOS)
        close()
      } else {
        switch (body.response.code) {
          default:
            Notifications.error(body.response.message)
        }
      }
    } catch (e) {
      Notifications.error('Unable to connect to server')
    }

    setLoading(false)
  }

  return <Modal show={show} onHide={close}>
    <Form onSubmit={handleSubmit(submit)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit todo</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            {...register('title', {
              required: 'Fill in this field'
            })}
            isInvalid={!!errors.title}
          />
          {errors.title && <Form.Control.Feedback type="invalid">{errors.title.message}</Form.Control.Feedback>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="note">
          <Form.Label>Note</Form.Label>
          <Form.Control
            as="textarea"
            {...register('note', {
              required: 'Fill in this field'
            })}
            isInvalid={!!errors.note}
          />
          {errors.note && <Form.Control.Feedback type="invalid">{errors.note.message}</Form.Control.Feedback>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="expire">
          <Form.Label>Expire</Form.Label>
          <Form.Control
            type="datetime-local"
            {...register('expire', {
              required: 'Fill in this field'
            })}
            isInvalid={!!errors.expire}
          />
          {errors.expire && <Form.Control.Feedback type="invalid">{errors.expire.message}</Form.Control.Feedback>}
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading && <Spinner className="align-baseline" as="span" size="sm" aria-hidden="true" />}
          {loading ? ' Loading...' : 'Submit'}
        </Button>
      </Modal.Footer>
    </Form>
  </Modal>
}

const HomePage = () => {
  useTitle('Home')

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showEditTodoModal, setShowEditTodoModal] = useState(false)
  const [itemToEdit, setItemToEdit] = useState(null)

  const onComplete = id => {
    fetch0(`/todo/${id}`, { method: 'POST' })
      .then(r => r.json())
      .then(body => {
        if (body.ok) {
          Notifications.success('To-do status has been changed')
          EventBus.emit(EVENT_UPDATE_TODOS)
        } else {
          switch (body.response.code) {
            default:
              Notifications.error(body.response.message)
          }
        }
      })
      .catch(() => Notifications.error('Unable to connect to server'))
  }

  const onDelete = id => {
    fetch0(`/todo/${id}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(body => {
        if (body.ok) {
          Notifications.success('To-do successfully deleted')
          EventBus.emit(EVENT_UPDATE_TODOS)
        } else {
          switch (body.response.code) {
            default:
              Notifications.error(body.response.message)
          }
        }
      })
      .catch(() => Notifications.error('Unable to connect to server'))
  }

  return <>
    <button
      className="btn btn-secondary mb-4"
      onClick={() => setShowPasswordModal(true)}
    >
      Change password
    </button>

    <div className="row mb-4">
      <div className="col-md-4 col-12">
        <NewTodo />
      </div>
      <div className="col-md-8 col-12">
        <TodoSectionCard
          showEdit={setShowEditTodoModal}
          setEdit={setItemToEdit}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      </div>
    </div>

    <PasswordModal
      show={showPasswordModal}
      close={() => setShowPasswordModal(false)}
    />

    <EditTodoModal
      show={showEditTodoModal}
      close={() => setShowEditTodoModal(false)}
      item={itemToEdit}
    />
  </>
}

export default HomePage