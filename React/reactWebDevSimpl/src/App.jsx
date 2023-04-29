import "./styles.css";
import { useEffect, useState } from "react";
import { TodoForm } from "./TodoForm";
import { TodoList } from "./TodoList";

export default function App(){
  const [todos, setTodos] = useState(() => {
    const localTodos = localStorage.getItem('TODOS');
    return (localTodos !== null) ? JSON.parse(localTodos) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('TODOS', JSON.stringify(todos));
  }, [todos]);
  
  function addTodo(title){
    setTodos(curTodos=>{
      return [
        ...curTodos,
        {
          id: crypto.randomUUID(),
          title,
          completed: false
        }
      ];
    });
  }
  
  function deleteTodo(id){
    setTodos(curTodos => curTodos.filter(todo => (todo.id !== id)));
  }
  
  function toggleTodo(id, completed){
    setTodos(curTodos => curTodos.map(todo => (todo.id === id) ? {...todo, completed} : todo));
  }
  
  return (
    <>
    <TodoForm addTodo={addTodo} />
    <h1 className="header">Todo List</h1>
    <TodoList
      todos={todos}
      deleteTodo={deleteTodo}
      toggleTodo={toggleTodo}
    />
    </>
  );
}
