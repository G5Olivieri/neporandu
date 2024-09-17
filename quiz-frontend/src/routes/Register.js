import { Link } from "react-router-dom";

export default function Register() {
    return (
        <div>
            <h1>Cadastrar</h1>
            <form>
                <div>
                    <label>Email</label>
                    <input type="email" />
                </div>
                <div>
                    <label>Senha</label>
                    <input type="password" />
                </div>
                <button type="submit">Cadastrar</button>
            </form>
            <div>
                <p>Já possui conta? <Link to="/login">Entrar</Link></p>
            </div>
        </div>
    );
}