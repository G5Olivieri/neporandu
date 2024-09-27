import { useEffect, useMemo, useState } from "react"
import { useAuth } from "../../../auth/useAuth"

export default function Room() {
    const [isLoading, setIsLoading] = useState(true)
    const [room, setRoom] = useState("")
    const auth = useAuth()
    const ws = useMemo(() => new WebSocket(`http://localhost:8080?token=${auth.accessToken}`), [auth.accessToken])
    useEffect(() => {
        ws.onclose = () => {
            console.log("FECHANDO")
        }
        ws.onmessage = (data) => {
            console.log(data)
            const event = JSON.parse(data.data)
            switch (event.type) {
                case "room.created":
                    setRoom(event.room)
                    setIsLoading(false)
                    break;
            }
        }
        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "room.new",
                room: crypto.randomUUID()
            }))
        }
    }, [ws])
    return (
        <div>
            {isLoading ? "Loading..." : <h1>Sua sala é {room}</h1>}
        </div>
    )

}