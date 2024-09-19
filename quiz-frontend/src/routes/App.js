import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useUser } from '../auth/useUser';

function App() {
  const auth = useAuth()
  const user = useUser()
  return (
    <div>
      <header>
        <nav>
          <ul>
            {user ?
              (
                <li>Bem-vindo {user.username}!</li>
              ) : (
                <li>
                  <Link to="/login">
                    Entrar
                  </Link>
                </li>
              )}
            {auth.isLogged() && (
              <li>
                <Link to="/categories">
                  Categorias
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <Typography variant="h1" gutterBottom>
        Home
      </Typography>
    </div>
  );
}

export default App;
