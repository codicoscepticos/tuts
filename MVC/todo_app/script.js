// source: https://www.taniarascia.com/javascript-mvc-todo-app/

function Model(){
    let todos = [];
    
    this.getTodos = function(){
        return todos.slice();
    }
    
    this.bindTodoListChanged = function(callback){
        this.onTodoListChanged = callback;
    }
    
    this.addTodo = function(text){
        todos.push({
            text: text,
            complete: false
        });
        this.onTodoListChanged(todos);
    }
    
    this.editTodo = function(id, text){
        todos[id].text = text;
        this.onTodoListChanged(todos);
    }
    
    this.deleteTodo = function(id){
        todos.splice(id, 1);
        this.onTodoListChanged(todos);
    }
    
    this.toggleTodo = function(id){
        const todo = todos[id];
        todo.complete = !todo.complete
        this.onTodoListChanged(todos);
    }
}

function View(){
    this.createElement = function(tag, className){
        const element = document.createElement(tag);
        if (className) element.classList.add(className);
        return element;
    }
    
    this.getElement = function(selector){
        return document.querySelector(selector);
    }
    
    this.rootElem = this.getElement('#root');
    
    this.title = this.createElement('h1');
    this.title.textContent = 'Todos';
    
    this.form = this.createElement('form');
    
    this.input = this.createElement('input');
    const input = this.input;
    input.type = 'text';
    input.placeholder = 'Add todo';
    input.name = 'todo';
    
    this.submitButton = this.createElement('button');
    this.submitButton.textContent = 'Submit';
    
    this.todoList = this.createElement('ul', 'todo-list');
    const todoList = this.todoList;
    
    this.form.append(this.input, this.submitButton);
    
    this.rootElem.append(this.title, this.form, this.todoList);
    
    this._getTodoText = function(){
        return this.input.value;
    }
    
    this._resetInput = function(){
        this.input.value = '';
    }
    
    this.displayTodos = function(todos){
        while (todoList.firstChild) {
            todoList.removeChild(todoList.firstChild);
        }
        
        if (todos.length === 0) {
            const p = this.createElement('p');
            p.textContent = 'Nothing to do! Add a task?';
            this.todoList.append(p);
        } else {
            todos.forEach((todo, id)=>{
                const li = this.createElement('li');
                li.id = id;
                
                const checkbox = this.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = todo.complete;
                
                const span = this.createElement('span');
                span.contentEditable = true;
                span.classList.add('editable');
                
                if (todo.complete) {
                    const strike = this.createElement('s');
                    strike.textContent = todo.text;
                    span.append(strike);
                } else {
                    span.textContent = todo.text;
                }
                
                const deleteButton = this.createElement('button', 'delete');
                deleteButton.textContent = 'Delete';
                li.append(checkbox, span, deleteButton);
                
                this.todoList.append(li);
            });
        }
    }
    
    this.bindAddTodo = function(handler){
        this.form.addEventListener('submit', (event)=>{
            event.preventDefault();
            
            const text = this._getTodoText();
            if (text) {
                handler(text);
                this._resetInput();
            }
        })
    }
    
    this._getId = function(event){
        const li = event.target.parentElement;
        return parseInt(li.id);
    }
    
    this._evtListenerForTodoList = function(type, targetAttr, attrValue, handler){
        this.todoList.addEventListener(type, (event)=>{
            if (event.target[targetAttr] === attrValue) {
                handler(this._getId(event));
            }
        })
    }
    
    this.bindDeleteTodo = function(handler){
        this._evtListenerForTodoList('click', 'className', 'delete', handler);
    }
    
    this.bindToggleTodo = function(handler){
        this._evtListenerForTodoList('change', 'type', 'checkbox', handler);
    }
}

function Controller(model, view){
    this.model = model;
    this.view = view;
    
    this.onTodoListChanged = (todos)=>{
        this.view.displayTodos(todos);
    }
    
    this.onTodoListChanged(this.model.getTodos());
    
    this.handleAddTodo = (text)=>{
        this.model.addTodo(text);
    }
    
    this.handleEditTodo = (id, text)=>{
        this.model.editTodo(id, text);
    }
    
    this.handleDeleteTodo = (id)=>{
        this.model.deleteTodo(id);
    }
    
    this.handleToggleTodo = (id)=>{
        this.model.toggleTodo(id);
    }
    
    this.view.bindAddTodo(this.handleAddTodo);
    this.view.bindDeleteTodo(this.handleDeleteTodo);
    this.view.bindToggleTodo(this.handleToggleTodo);
    
    this.model.bindTodoListChanged(this.onTodoListChanged);
}

const app = new Controller(new Model(), new View());
