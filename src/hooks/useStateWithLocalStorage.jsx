import { useState, useEffect } from "react"

export default function useStateWithLocalStorage(key, initialValue) {
    const [state, setState] = useState(() => {
      const value = localStorage.getItem(key)
  
      if (!value) {
        localStorage.setItem(key, JSON.stringify(initialValue))
        return initialValue
      }
  
      return JSON.parse(value)
    })
  
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state))
    }, [state])
  
    return [
      state,
      setState
    ]
}