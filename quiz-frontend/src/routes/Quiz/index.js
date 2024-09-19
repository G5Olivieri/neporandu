import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useAuth } from '../..//auth/useAuth';
import { CategoryProvider } from './useCategory';

export default function Quiz() {
  const { categoryId } = useParams();
  const auth = useAuth()
  const [category, setCategory] = useState(null)


  useEffect(() => {
    fetch(`http://localhost:8080/categories/${categoryId}`, {
      headers: {
        authorization: `Bearer ${auth.accessToken}`
      }
    }).then(res => {
      if (!res.ok) {
        return null
      }
      return res.json()
    }).then(data => {
      setCategory(data)
    })
  }, [auth.accessToken, categoryId])
  if (!category) {
    return null
  }
  return (
    <div>
      <CategoryProvider value={category}>
        <h1>{category.name}</h1>
        <Outlet />
      </CategoryProvider>
    </div>
  )
}