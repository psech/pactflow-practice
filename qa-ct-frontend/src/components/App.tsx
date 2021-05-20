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
    console.log(`Delete attmept, id=${id}`);
    deleteTodo(id)
      .then(() =>
        setTodos((prev: ITodo[]) =>
          prev.filter((todo: ITodo) => todo.id !== id),
        ),
      )
      .catch((error: Error) => console.log(error));
  };

  const handleEditTodo = (todo: ITodo, text: string) => {
    console.log(`Edit attmept, id=${todo.id}`);
    todo = { ...todo, text: text };
    updateTodo(todo)
      .then(() =>
        setTodos((prev: ITodo[]) =>
          prev.map((el: ITodo) => (el.id === todo.id ? todo : el)),
        ),
      )
      .catch((error: Error) => console.log(error));
  };

  const handlecompleteTodo = (todo: ITodo) => {
    console.log(`Edit attmept, id=${todo.id}`);
    todo = { ...todo, completed: !todo.completed };
    updateTodo(todo)
      .then(() =>
        setTodos((prev: ITodo[]) =>
          prev.map((el: ITodo) => (el.id === todo.id ? todo : el)),
        ),
      )
      .catch((error: Error) => console.log(error));
  };

  return (
    <div>
      <Header handleAddTodos={handleAddTodos} />
      <MainSection
        todos={todos}
        handleDeleteTodo={handleDeleteTodo}
        handleEditTodo={handleEditTodo}
        handlecompleteTodo={handlecompleteTodo}
      />
    </div>
  );
};

export default App;
