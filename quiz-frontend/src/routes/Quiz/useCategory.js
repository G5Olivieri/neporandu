import { createContext, useContext } from "react";

export const CategoryContext = createContext()

export function useCategory() {
    const context = useContext(CategoryContext)
    return context
}

export function CategoryProvider({ children, value }) {
    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    )
}