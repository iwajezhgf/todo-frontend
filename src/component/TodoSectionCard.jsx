import { useEffect, useState } from 'react'
import usePagination from '../hook/usePagination'
import { EVENT_UPDATE_TODOS, EventBus } from '../lib/eventbus'
import { fetch0 } from '../lib/fetch'
import { textNormalizer } from '../lib/util'

const TodoSectionCard = ({ showEdit, setEdit, onComplete, onDelete }) => {
  const pagination = usePagination(page => fetch0('/todo?limit=3&page=' + page))
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (pagination.page !== 0 || !pagination.items)
      return
    return EventBus.on(EVENT_UPDATE_TODOS, () => pagination.load())
  }, [pagination.page, pagination.items])

  return <div>
    {pagination.items?.length === 0 && <div className="text-center">
      You dont have any records yet...
    </div>}

    {pagination.error && !pagination.loading && <div>
      <div className="text-center text-danger">
        <p>An error occurred during the download process</p>
        <button className="btn btn-outline-secondary" onClick={() => pagination.load()}>Try again</button>
      </div>
    </div>}

    {pagination.items?.map(item => {
      const status = item.status
      const isCompleted = status === 'completed'

      let color = 'primary'
      if (status === 'overdue') color = 'danger'
      else if (isCompleted) color = 'success'

      const icon = isCompleted ? 'bi bi-check-circle' : 'bi bi-circle'

      return <div key={item.id} className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center flex-column flex-sm-row">
          <div className="mb-2 mb-sm-0 me-sm-3">
            <h6 className="mb-0">
              {item.title} <span className={`badge bg-${color}`}>{item.status.toUpperCase()}</span>
            </h6>
          </div>
          <div className="d-flex align-items-center">
          <span
            className="c-pointer px-2"
            onClick={() => {
              onComplete(item.id)
              pagination.load()
            }}
          >
            <i className={icon} />
          </span>
            <span
              className="c-pointer px-2"
              onClick={() => {
                showEdit(true)
                setEdit(item)
              }}
            >
            <i className="bi bi-pencil-square" />
          </span>
            <span
              className="c-pointer text-danger px-2"
              onClick={() => {
                onDelete(item.id)
                pagination.load()
              }}
            >
            <i className="bi bi-trash" />
          </span>
          </div>
        </div>
        <div className="card-body">
          <p
            className="c-pointer"
            onClick={() => setShow(!show)}
          >
            {!show ? textNormalizer(item.note, 50) : item.note}
          </p>
          <span
            className="text-muted float-end fst-italic"
          >Expires on {new Date(item.expire).toLocaleString()}</span>
        </div>
      </div>
    })}

    {pagination.hasPages &&
      <div className="card-body text-center mb-3">
        {pagination.component}
      </div>}
  </div>
}

export default TodoSectionCard