import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const auth = useAuth()
    const navigate = useNavigate()

    async function onSubmit(event) {
        event.preventDefault()
        try {
            await auth.register(username, password)
            navigate('/')
        } catch (e) {
            setError(e.toString())
        }
    }
    return (
        <div>
            <h1>Cadastrar</h1>
            <form onSubmit={onSubmit}>
                <div>{error}</div>
                <div>
                    <label>Usuário</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Senha</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Cadastrar</button>
            </form>
            <div>
                <p>Já possui conta? <Link to="/login">Entrar</Link></p>
            </div>
        </div>
    );
}