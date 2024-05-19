import { useEffect } from 'react'

// https://stackoverflow.com/a/55415722/21711976
const useTitle = (title: string) => {
  useEffect(() => {
    const oldTitle = document.title
    title && (document.title = title.trim() + ' - Todo')
    // following line is optional, but will reset title when component unmounts
    return () => {
      document.title = oldTitle
    }
  }, [title])
}

export default useTitle