import {useContext} from 'react'
import { Context } from './contexts/context';

export default function Div(){
  const {text, setText} = useContext(Context);
  
  function handleClick(){
    const newText = Math.floor(Math.random() * 10).toString();
    setText(newText);
  }
  
  return (<>
    <h1>{text}</h1>
    <button
      onClick={handleClick}
    >
      Change text
    </button>
  </>);
}
