import React, { FC, PropsWithChildren } from 'react';
import TodoItem from './TodoItem';

import { getFilteredTodos } from '../api/helpers';
import { ITodo } from '../api/type';

interface ITodoListProps {
  todos: ITodo[];
  handleDeleteTodo: (arg0: number) => void;
  handleEditTodo: (arg0: ITodo, arg1: string) => void;
  handleCompleteTodo: (arg0: ITodo) => void;
  visibilityFilter: string;
}

const TodoList: FC<ITodoListProps> = (
  props: PropsWithChildren<ITodoListProps>,
) => {
  return (
    <ul className="todo-list">
      {getFilteredTodos(props.todos, props.visibilityFilter).map(
        (todo: { id: React.Key }) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            handleDeleteTodo={props.handleDeleteTodo}
            handleEditTodo={props.handleEditTodo}
            handleCompleteTodo={props.handleCompleteTodo}
          />
        ),
      )}
    </ul>
  );
};

export default TodoList;
