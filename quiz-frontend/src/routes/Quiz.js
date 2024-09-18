import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useAuth } from "../auth/useAuth"

export default function Quiz() {
  const [categories, setCategories] = useState([])
  const auth = useAuth()
  useEffect(() => {
    fetch('http://localhost:8080/categories', {
      headers: {
        'Authorization': `Bearer ${auth.accessToken}`
      }
    }).then(res => {
      if (res.ok) {
        return res.json()
      }
      return []
    }).then(data => setCategories(data))
  }, [auth.accessToken])
  return (
    <div>
      <Typography variant="h1" gutterBottom>
        Quiz
      </Typography>
      <ul>
        {categories.map(category => (<li key={category.id}>{category.name}</li>))}
      </ul>
    </div>
  );
}