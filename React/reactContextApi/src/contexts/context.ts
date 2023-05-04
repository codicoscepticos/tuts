import {createContext} from 'react'

interface ContextProps{
  text: string,
  setText: (text: string) => void
}

export const Context = createContext<ContextProps>({
  text: '',
  setText: () => null
});
