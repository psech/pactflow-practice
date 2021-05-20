import React, { FC, useEffect, useState } from 'react';
import Header from './Header';
import MainSection from './MainSection';
import 'todomvc-app-css/index.css';

import { ITodo } from '../api/type';
import { addTodo, getTodos } from '../api/api';

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

  return (
    <div>
      <Header handleAddTodos={handleAddTodos} />
      <MainSection todos={todos} />
    </div>
  );
};

export default App;
