import React, { FC } from 'react';
import TodoTextInput from './TodoTextInput';
import { addTodo } from '../stores/todo';

const Header: FC = () => (
  <header className="header">
    <h1>todos</h1>
    <TodoTextInput
      newTodo
      onSave={(text: string) => {
        if (text.length !== 0) {
          addTodo(text);
        }
      }}
      placeholder="What needs to be done?"
    />
  </header>
);

export default Header;
