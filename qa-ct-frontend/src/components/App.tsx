import { FC, useEffect, useState } from 'react';
import Header from './Header';
import MainSection from './MainSection';
import 'todomvc-app-css/index.css';

import { ITodo } from '../api/type';
import { addTodo, deleteTodo, getTodos, updateTodo } from '../api/api';

const App: FC = () => {
  const [todos, setTodos] = useState<ITodo[]>([]);

  useEffect(() => {
    getTodos()
      .then(({ data }: ITodo[] | any) => setTodos(data))
      .catch((error: Error) => console.log(console.log(error)));
  }, []);

  const handleAddTodos = (todo: ITodo) => {
    addTodo(todo)
      .then((response) => {
        setTodos((prev: ITodo[]) => prev.concat(response.data));
      })
      .catch((error: Error) => console.log(error));
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodo(id)
      .then(() =>
        setTodos((prev: ITodo[]) =>
          prev.filter((todo: ITodo) => todo.id !== id),
        ),
      )
      .catch((error: Error) => console.log(error));
  };

  const handleEditTodo = (todo: ITodo, text: string) => {
    todo = { ...todo, text: text };
    updateTodo(todo)
      .then(() =>
        setTodos((prev: ITodo[]) =>
          prev.map((el: ITodo) => (el.id === todo.id ? todo : el)),
        ),
      )
      .catch((error: Error) => console.log(error));
  };

  const handleCompleteTodo = (todo: ITodo) => {
    todo = { ...todo, completed: !todo.completed };
    updateTodo(todo)
      .then(() =>
        setTodos((prev: ITodo[]) =>
          prev.map((el: ITodo) => (el.id === todo.id ? todo : el)),
        ),
      )
      .catch((error: Error) => console.log(error));
  };

  const handleClearCompletedTodos = () => {
    const todosToClear: ITodo[] = todos.filter((todo) => todo.completed);
    const todossToKeep: ITodo[] = todos.filter((todo) => !todo.completed);
    Promise.all(todosToClear.map((todo) => deleteTodo(todo.id)))
      .then(() => setTodos(todossToKeep))
      .catch((error: Error) => console.log(error));
  };

  const handleCompleteAllTodos = () => {
    const newTodos: ITodo[] = todos.map((todo: ITodo) => ({
      ...todo,
      completed: true,
    }));
    Promise.all(newTodos.map((todo: ITodo) => updateTodo(todo)))
      .then(() => setTodos(newTodos))
      .catch((error: Error) => console.log(error));
  };

  return (
    <div>
      <Header handleAddTodos={handleAddTodos} />
      <MainSection
        todos={todos}
        handleDeleteTodo={handleDeleteTodo}
        handleEditTodo={handleEditTodo}
        handleCompleteTodo={handleCompleteTodo}
        handleClearCompletedTodos={handleClearCompletedTodos}
        handleCompleteAllTodos={handleCompleteAllTodos}
      />
    </div>
  );
};

export default App;
