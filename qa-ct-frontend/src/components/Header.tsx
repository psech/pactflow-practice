import { FC, PropsWithChildren } from 'react';
import TodoTextInput from './TodoTextInput';
import { ITodo } from '../api/type';

interface IHeaderProps {
  handleAddTodos: Function;
}

const Header: FC<IHeaderProps> = (props: PropsWithChildren<IHeaderProps>) => (
  <header className="header">
    <h1>todos</h1>
    <TodoTextInput
      newTodo
      onSave={(text: string) => {
        if (text.length !== 0) {
          const todo: Omit<ITodo, 'id'> = {
            text: text,
            completed: false,
          };
          props.handleAddTodos(todo);
        }
      }}
      placeholder="What needs to be done?"
    />
  </header>
);

export default Header;
