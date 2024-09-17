import { Link } from "react-router-dom";

export default function Login() {

    function handleSubmit(event) {
        event.preventDefault()
        fetch('http://localhost:8080/signin', {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                username: "glayson",
                password: "glayson"
            })
        })
    }

    return (
        <div>
            <h1>Entrar</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" />
                </div>
                <div>
                    <label>Senha</label>
                    <input type="password" />
                </div>
                <button type="submit">Entrar</button>
            </form>
            <div>
                <p>Não possui conta ainda? <Link to="/register">Cadastrar</Link></p>
            </div>
        </div>
    );
}