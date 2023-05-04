import {useState} from 'react'

import { Context } from './contexts/context';
import Div from './Div';

export default function App(){
  const [text, setText] = useState('');
  
  return (<>
    <Context.Provider value={{text, setText}}>
      <Div/>
    </Context.Provider>
  </>);
}
