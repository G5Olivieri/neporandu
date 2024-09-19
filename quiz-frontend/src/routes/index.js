import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Categories from './Categories'
import Login from './Login'
import PrivateRoute from './PrivateRoute'
import Quiz from './Quiz'
import Lobby from './Quiz/Lobby'
import Register from './Register'
import SinglePlayer from './Quiz/SinglePlayer'
import MultiPlayer from './Quiz/MultiPlayer'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/categories',
        element: <PrivateRoute><Categories /></PrivateRoute>
    },
    {
        path: '/quiz/:categoryId',
        element: <PrivateRoute><Quiz /></PrivateRoute>,
        children: [
            {
                path: '',
                index: true,
                element: <Lobby />
            },
            {
                path: 'singleplayer',
                element: <SinglePlayer />
            },
            {
                path: 'multiplayer',
                element: <MultiPlayer />
            }
        ]
    }
])
