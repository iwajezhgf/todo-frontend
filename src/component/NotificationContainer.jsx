import { useEffect, useState } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import { EVENT_NOTIFICATIONS, EventBus } from '../lib/eventbus'
import Notifications from '../lib/notifications'
import { capitalizeFirstLetter } from '../lib/util'

const NotificationItem = ({ n }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

  const onClose = () => {
    if (!show)
      return

    setShow(false)

    setTimeout(() => {
      Notifications.remove(n)
    }, 1000)
  }

  let color = n.type
  if (color === 'error') color = 'danger'
  color = 'text-bg-' + color

  return <Toast
    show={show}
    className={'mb-3 border-0 ' + color}
    data-bs-theme="dark"
    onClose={onClose}
    delay={n.ttl}
    autohide
  >
    <Toast.Header>
      <strong className="me-auto">{capitalizeFirstLetter(n.type)}</strong>
    </Toast.Header>
    <Toast.Body>{n.message}</Toast.Body>
  </Toast>
}

const NotificationContainer = () => {
  let [data, setData] = useState([])

  useEffect(() => {
    return EventBus.on(EVENT_NOTIFICATIONS, d => setData([...d]))
  }, [setData])

  return <ToastContainer className="p-3" containerPosition="fixed" position="bottom-center">
    {data.map(n => <NotificationItem key={n.id} n={n} />)}
  </ToastContainer>
}

export default NotificationContainer