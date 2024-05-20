import { EVENT_NOTIFICATIONS, EventBus } from './eventbus'

let data: any[] = []

let id = 0
const getNextId = (): number => id++

interface NotificationOptions {
  ttl?: number
  type?: 'info' | 'error' | 'success'
}

const defaultOptions: NotificationOptions = {
  ttl: 5000,
  type: 'info'
}

interface Notification extends NotificationOptions {
  id: number
  message: string
}

const Notifications = {
  add(message: string, options: NotificationOptions = {}): Notification {
    const n = {
      id: getNextId(),
      message: message,
      ...defaultOptions,
      ...options
    }
    data.push(n)
    EventBus.emit(EVENT_NOTIFICATIONS, data)
    return n
  },
  info(message: string, options: NotificationOptions = {}): Notification {
    return this.add(message, {
      type: 'info',
      ...options
    })
  },
  error(message: string, options: NotificationOptions = {}): Notification {
    return this.add(message, {
      type: 'error',
      ...options
    })
  },
  success(message: string, options: NotificationOptions = {}): Notification {
    return this.add(message, {
      type: 'success',
      ...options
    })
  },
  remove(n: Notification) {
    data = data.filter(n0 => n0.id !== n.id)
    EventBus.emit(EVENT_NOTIFICATIONS, data)
  }
}

export default Notifications