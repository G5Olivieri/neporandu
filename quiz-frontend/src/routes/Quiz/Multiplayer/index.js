import { Link } from "react-router-dom";

export default function MultiPlayer() {
    return (
        <div>
            <ul>
                <li><Link to="new">Criar uma nova sala</Link></li>
                <li><Link to="room">Entrar numa sala</Link></li>
            </ul>
        </div>
    )
}