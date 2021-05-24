import { FC, PropsWithChildren, useState } from 'react';
import Footer from './Footer';
import TodoList from './TodoList';

import { FilterTitlesEnum, getCompletedCount } from '../api/helpers';
import { ITodo } from '../api/type';

interface IMainSectionProps {
  todos: ITodo[];
  handleDeleteTodo: (arg0: number) => void;
  handleEditTodo: (arg0: ITodo, arg1: string) => void;
  handleCompleteTodo: (arg0: ITodo) => void;
  handleClearCompletedTodos: () => void;
  handleCompleteAllTodos: () => void;
}

const MainSection: FC<IMainSectionProps> = (
  props: PropsWithChildren<IMainSectionProps>,
) => {
  const [visibilityFilter, setVisibilityFilter] = useState(
    FilterTitlesEnum.All,
  );

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
          <label onClick={props.handleCompleteAllTodos} />
        </span>
      )}
      <TodoList
        todos={todos}
        handleDeleteTodo={props.handleDeleteTodo}
        handleEditTodo={props.handleEditTodo}
        handleCompleteTodo={props.handleCompleteTodo}
        visibilityFilter={visibilityFilter}
      />
      {!!todosCount && (
        <Footer
          completedCount={completedCount}
          activeCount={todosCount - completedCount}
          onClearCompleted={props.handleClearCompletedTodos}
          visibilityFilter={visibilityFilter}
          setVisibilityFilter={setVisibilityFilter}
        />
      )}
    </section>
  );
};

export default MainSection;
