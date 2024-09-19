import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useAuth } from "../auth/useAuth"
import { Link } from 'react-router-dom';

export default function Categories() {
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
        {categories.map(category => (
          <li key={category.id}>
            <Link to={`/quiz/${category.id}`}>{category.name}</Link>
          </li>
        ))
        }
      </ul>
    </div>
  );
}