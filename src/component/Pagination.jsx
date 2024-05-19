import { Button, ButtonGroup } from 'react-bootstrap'

const Pagination = ({ pagination, onChange, loading }) => {
  if (!pagination)
    return <></>

  const { next, prev } = pagination

  const isPrevDisabled = prev.length === 0 || loading
  const isNextDisabled = next.length === 0 || loading

  const handlePrevClick = () => {
    if (!isPrevDisabled)
      onChange(prev[prev.length - 1])
  }

  const handleNextClick = () => {
    if (!isNextDisabled)
      onChange(next[next.length - 1])
  }

  return <ButtonGroup aria-label="Pagination">
    <Button
      variant="outline-primary"
      onClick={handlePrevClick}
      disabled={isPrevDisabled}
    >
      Prev
    </Button>
    <Button
      variant="outline-primary"
      onClick={handleNextClick}
      disabled={isNextDisabled}
    >
      Next
    </Button>
  </ButtonGroup>
}

export default Pagination