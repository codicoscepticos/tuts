import PropTypes from 'prop-types';
import { TodoItem } from "./TodoItem";

export function TodoList({todos, deleteTodo, toggleTodo}){
  return (
    <ul className="list">
      {todos.length === 0 && "No todods"}
      {todos.map(todo=>(
          <TodoItem
            key={todo.id}
            todo={todo}
            deleteTodo={deleteTodo}
            toggleTodo={toggleTodo}
          />
      ))}
    </ul>
  );
}
TodoList.propTypes = {
  todos: PropTypes.array.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  toggleTodo: PropTypes.func.isRequired,
}
