import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./useAuth"

export const UserContext = createContext()

export function useUser() {
    const context = useContext(UserContext)
    return context
}

export function useUserService() {
    const [user, setUser] = useState(null)
    const auth = useAuth()

    useEffect(() => {
        if (auth.accessToken) {
            fetch('http://localhost:8080/userinfo', {
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`
                }
            }).then(res => {
                if (!res.ok) {
                    return null
                }
                return res.json()
            }).then(data => setUser(data))
        } else {
            setUser(null)
        }
    }, [auth.accessToken])

    return user
}

export function UserProvider({ children }) {
    const user = useUserService()
    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}