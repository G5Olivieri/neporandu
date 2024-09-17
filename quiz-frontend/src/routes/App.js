import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/login">
                Entrar
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <Typography variant="h1" gutterBottom>
        Quiz
      </Typography>
    </div>
  );
}

export default App;
