import {useEffect, useState} from 'react';

export function useLocalStorage<T>(key:string, initValue:T|(() => T)){
  const [value, setValue] = useState<T>(() => {
    const jsonValue = localStorage.getItem(key);
    
    if (jsonValue === null) {
      if (typeof initValue === 'function') {
        return (initValue as () => T)();
      }
      
      return initValue;
    }
    
    return JSON.parse(jsonValue);
  });
  
  useEffect(() => {
    const localValue = JSON.stringify(value);
    localStorage.setItem(key, localValue);
  }, [key, value]);
  
  return [value, setValue] as [T, typeof setValue];
}
