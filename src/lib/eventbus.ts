export type EventHandler = (payload?: any) => void
export type EventType = string | symbol

type Events = Record<EventType, Array<EventHandler>>

export const EventBus = {
  events: {} as Events,

  on(event: EventType, handler: EventHandler) {
    if (!this.events[event])
      this.events[event] = [handler]
    else
      this.events[event]?.push(handler)

    return () => this.off(event, handler)
  },
  off(event: EventType, handler: EventHandler) {
    if (this.events[event])
      this.events[event] = this.events[event].filter(h => h !== handler)
  },
  emit(event: EventType, payload?: any) {
    this.events[event]?.forEach(h => h(payload))
  }
}

export const EVENT_UPDATE_TODOS = Symbol('update.todo')
export const EVENT_NOTIFICATIONS = Symbol('notifications')