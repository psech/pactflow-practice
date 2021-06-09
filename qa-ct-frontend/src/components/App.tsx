import { FC, useEffect, useMemo, useState } from 'react';
import Header from './Header';
import MainSection from './MainSection';
import 'todomvc-app-css/index.css';

import { ITodo } from '../api/type';
import { API } from '../api/api';
import { FilterTitlesEnum, getFilteredTodos } from '../api/helpers';

const App: FC = () => {
  const [todos, setTodos] = useState<ITodo[]>([]);

  const api = useMemo(() => new API(), []);

  useEffect(() => {
    api
      .getTodos()
      .then((todos: ITodo[]) => setTodos(todos))
      .catch((error: Error) => console.log(console.log(error)));
  }, [api]);

  const handleAddTodos = (todo: ITodo) => {
    api
      .addTodo(todo)
      .then((response) => {
        setTodos((prev: ITodo[]) => prev.concat(response.data));
      })
      .catch((error: Error) => console.log(error));
  };

  const handleDeleteTodo = (id: number) => {
    api
      .deleteTodo(id)
      .then(() =>
        setTodos((prev: ITodo[]) =>
          prev.filter((todo: ITodo) => todo.id !== id),
        ),
      )
      .catch((error: Error) => console.log(error));
  };

  const handleEditTodo = (todo: ITodo, text: string) => {
    todo = { ...todo, text: text };
    api
      .updateTodo(todo)
      .then(() =>
        setTodos((prev: ITodo[]) =>
          prev.map((el: ITodo) => (el.id === todo.id ? todo : el)),
        ),
      )
      .catch((error: Error) => console.log(error));
  };

  const handleCompleteTodo = (todo: ITodo) => {
    todo = { ...todo, completed: !todo.completed };
    api
      .updateTodo(todo)
      .then(() =>
        setTodos((prev: ITodo[]) =>
          prev.map((el: ITodo) => (el.id === todo.id ? todo : el)),
        ),
      )
      .catch((error: Error) => console.log(error));
  };

  const handleClearCompletedTodos = () => {
    const todosToClear: ITodo[] = getFilteredTodos(
      todos,
      FilterTitlesEnum.Completed,
    );
    const todossToKeep: ITodo[] = getFilteredTodos(
      todos,
      FilterTitlesEnum.Active,
    );
    Promise.all(todosToClear.map((todo) => api.deleteTodo(todo.id)))
      .then(() => setTodos(todossToKeep))
      .catch((error: Error) => console.log(error));
  };

  const handleCompleteAllTodos = () => {
    const newTodos: ITodo[] = todos.map((todo: ITodo) => ({
      ...todo,
      completed: true,
    }));
    Promise.all(newTodos.map((todo: ITodo) => api.updateTodo(todo)))
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
