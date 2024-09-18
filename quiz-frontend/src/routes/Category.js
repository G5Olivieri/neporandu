import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function Category() {
    let { categoryId } = useParams();
    const auth = useAuth()
    const [guesses, setGuesses] = useState({})
    const [category, setCategory] = useState(null)
    const [submitted, setSubmitted] = useState(false)
    function onSubmit() {
        setSubmitted(true)
    }
    useEffect(() => {
        fetch(`http://localhost:8080/categories/${categoryId}`, {
            headers: {
                authorization: `Bearer ${auth.accessToken}`
            }
        }).then(res => {
            if (!res.ok) {
                return null
            }
            return res.json()
        }).then(data => {
            setCategory(data)
        })
    }, [auth.accessToken, categoryId])
    if (!category) {
        return null
    }
    return (
        <div>
            <h1>{category.name}</h1>
            {category.questions.map(q => (
                <div key={q.id}>
                    <h2>{q.question}</h2>
                    {submitted && (
                        <span>
                            {guesses[q.id] ? (
                                q.options.find(o => o.id.toString() === guesses[q.id]).correct ? (
                                    'ACERTOU'
                                ) : 'ERROU'
                            ) : 'NÃO RESPONDEU'}
                        </span>
                    )}
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
            <button type="submit" onClick={onSubmit}>enviar</button>
        </div>
    )
}