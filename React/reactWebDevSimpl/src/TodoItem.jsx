import PropTypes from 'prop-types';

export function TodoItem({todo, deleteTodo, toggleTodo}){
  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={evt => toggleTodo(todo.id, evt.target.checked)}
        />
        {todo.title}
      </label>
      <button className="btn btn-danger" onClick={() => deleteTodo(todo.id)}>Delete</button>
    </li>
  );
}
TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  toggleTodo: PropTypes.func.isRequired,
}
