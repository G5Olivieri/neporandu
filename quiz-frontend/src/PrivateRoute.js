import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth";

export default function PrivateRoute({ children }) {
    const navigate = useNavigate()
    const auth = useAuth()
    useEffect(() => {
        if (!auth.isLogged()) {
            navigate('/login')
            return
        }
    })
    if (!auth.isLogged()) {
        return null
    }
    return children
}