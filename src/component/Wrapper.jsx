import useApp from '../hook/useApp'

const Wrapper = ({ children }) => {
  const { app } = useApp()

  let bc = ''
  let border = ''
  if (app.theme === 'dark')
    border = 'border border-primary'
  else
    bc = 'bg-grabient-fuchsia'

  return <section className={bc}>
    <div className="container d-flex align-items-center min-vh-100">
      <div className="row justify-content-center vw-100">
        <div className="col-md-6 col-lg-4">
          <div className={`card p-4 my-4 ${border}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  </section>
}

export default Wrapper