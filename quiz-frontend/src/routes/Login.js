import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const auth = useAuth()

    async function handleSubmit(event) {
        event.preventDefault()
        try {
            await auth.login(username, password)
            navigate("/")
        } catch (e) {
            setError(e.toString())
        }
    }

    return (
        <div>
            <h1>Entrar</h1>
            <form onSubmit={handleSubmit}>
                <span>{error}</span>
                <div>
                    <label>Usuário</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Senha</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button type="submit">Entrar</button>
            </form>
            <div>
                <p>Não possui conta ainda? <Link to="/register">Cadastrar</Link></p>
            </div>
        </div>
    );
}