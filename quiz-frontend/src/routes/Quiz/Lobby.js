import { Link } from "react-router-dom";

export default function Lobby() {
    return (
        <div>
            <ul>
                <li><Link to="singleplayer">Single player</Link></li>
                <li><Link to="multiplayer">Multi player</Link></li>
            </ul>
        </div>
    )
}