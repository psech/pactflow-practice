import { FC, PropsWithChildren } from 'react';
import Footer from './Footer';
import TodoList from './TodoList';
import {
  completeAllTodos,
  clearCompletedTodos,
  getCompletedCount,
} from '../stores/todo';

import { ITodo } from '../api/type';

interface IMainSectionProps {
  todos: ITodo[];
  handleDeleteTodo: (arg0: number) => void;
  handleEditTodo: (arg0: ITodo, arg1: string) => void;
  handlecompleteTodo: (arg0: ITodo) => void;
}

const MainSection: FC<IMainSectionProps> = (
  props: PropsWithChildren<IMainSectionProps>,
) => {
  const { todos } = props;
  const todosCount = todos.length;
  const completedCount = getCompletedCount(todos);
  return (
    <section className="main">
      {!!todosCount && (
        <span>
          <input
            className="toggle-all"
            type="checkbox"
            defaultChecked={completedCount === todosCount}
          />
          <label onClick={completeAllTodos} />
        </span>
      )}
      <TodoList
        todos={todos}
        handleDeleteTodo={props.handleDeleteTodo}
        handleEditTodo={props.handleEditTodo}
        handlecompleteTodo={props.handlecompleteTodo}
      />
      {!!todosCount && (
        <Footer
          completedCount={completedCount}
          activeCount={todosCount - completedCount}
          onClearCompleted={clearCompletedTodos}
        />
      )}
    </section>
  );
};

export default MainSection;
