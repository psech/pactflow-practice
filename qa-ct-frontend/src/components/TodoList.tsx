import React, { FC, PropsWithChildren } from 'react';
import TodoItem from './TodoItem';

import { FilterTitlesEnum, getFilteredTodos } from '../api/helpers';
import { ITodo } from '../api/type';

interface ITodoListProps {
  todos: ITodo[];
}

const TodoList: FC<ITodoListProps> = (
  props: PropsWithChildren<ITodoListProps>,
) => {
  // const { visibilityFilter } = useStore(TodoStore);
  const visibilityFilter = FilterTitlesEnum.All;

  return (
    <ul className="todo-list">
      {getFilteredTodos(props.todos, visibilityFilter).map(
        (todo: { id: React.Key }) => (
          <TodoItem key={todo.id} todo={todo} />
        ),
      )}
    </ul>
  );
};

export default TodoList;
