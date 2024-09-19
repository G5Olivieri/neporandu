import { useState } from "react"
import { useCategory } from "./useCategory"

export default function SinglePlayer() {
    const category = useCategory()
    const [guesses, setGuesses] = useState({})
    const [submitted, setSubmitted] = useState(false)

    function onSubmit(event) {
        event.preventDefault()
        setSubmitted(true)
    }

    return (
        <form onSubmit={onSubmit}>
            {category.questions.map(q => (
                <div key={q.id}>
                    <h2>{q.question}
                        {submitted && (
                            <span>
                                {guesses[q.id] ? (
                                    q.options.find(o => o.id.toString() === guesses[q.id]).correct ? (
                                        '✅'
                                    ) : '❌'
                                ) : '⚠️'}
                            </span>
                        )}
                    </h2>
                    {q.options.map(o => (
                        <div key={o.id}>
                            <input type="radio"
                                disabled={submitted}
                                name={q.id}
                                id={o.id}
                                defaultValue={o.id}
                                onChange={e => setGuesses({ ...guesses, [q.id]: e.target.value })}
                            />
                            <label htmlFor={o.id}>{o.value}</label>
                        </div>
                    ))}
                </div>
            ))}

            <button type="submit">enviar</button>
        </form>
    )
}