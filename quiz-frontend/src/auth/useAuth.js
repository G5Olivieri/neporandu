import { createContext, useContext, useState } from "react";

export const AuthContext = createContext()

export function useAuth() {
    const context = useContext(AuthContext)
    return context
}

function useAuthService() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))

    function isLogged() {
        return !!accessToken
    }

    async function register(username, password) {
        const response = await fetch('http://localhost:8080/signup', {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        if (response.ok) {
            const data = await response.json()
            localStorage.setItem('accessToken', data.accessToken)
            setAccessToken(data.accessToken)
            return data
        }
        throw Error("Usuário ou senha inválidos")
    }

    async function login(username, password) {
        const response = await fetch('http://localhost:8080/signin', {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        if (response.ok) {
            const data = await response.json()
            localStorage.setItem('accessToken', data.accessToken)
            setAccessToken(data.accessToken)
            return data
        }
        throw Error("Usuário ou senha inválidos")
    }

    return {
        accessToken,
        register,
        login,
        isLogged,
    }
}

export function AuthProvider({ children }) {
    const auth = useAuthService()
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}