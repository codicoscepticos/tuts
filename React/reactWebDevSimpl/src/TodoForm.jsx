import { useState } from "react";
import PropTypes from 'prop-types';

export function TodoForm({addTodo}){
  const [newItem, setNewItem] = useState('');
  
  function handleSubmit(evt){
    evt.preventDefault();
    if (newItem === '') return;
    
    addTodo(newItem);
    
    setNewItem('');
  }
  
  return (
    <form className="new-item-form" onSubmit={handleSubmit}>
    <div className="form-row">
      <label htmlFor="item">New Item</label>
      <input
        type="text"
        id="item"
        value={newItem}
        onChange={evt => setNewItem(evt.target.value)}
      />
    </div>
    <button className="btn">Add</button>
  </form>
  );
}
TodoForm.propTypes = {
  addTodo: PropTypes.func.isRequired
}
