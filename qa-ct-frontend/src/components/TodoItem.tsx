import { FC, useState, PropsWithChildren } from 'react';
import classnames from 'classnames';
import TodoTextInput from './TodoTextInput';

import { editTodo, deleteTodo, completeTodo } from '../stores/todo';

interface ITodoItemProps {
  todo: any;
}

const TodoItem: FC<ITodoItemProps> = (
  props: PropsWithChildren<ITodoItemProps>,
) => {
  const [editing, setEditing] = useState<boolean>(false);

  const handleDoubleClick = (): void => setEditing(true);

  const handleSave = (id: number, text: string) => {
    if (text.length === 0) {
      deleteTodo(id);
    } else {
      editTodo(id, text);
    }
    setEditing(false);
  };

  const { todo } = props;

  let element;
  if (editing) {
    element = (
      <TodoTextInput
        text={todo.text}
        editing={editing}
        onSave={(text: string) => handleSave(todo.id, text)}
      />
    );
  } else {
    element = (
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => completeTodo(todo.id)}
        />
        <label onDoubleClick={handleDoubleClick}>{todo.text}</label>
        <button className="destroy" onClick={() => deleteTodo(todo.id)} />
      </div>
    );
  }

  return (
    <li
      className={classnames({
        completed: todo.completed,
        editing: editing,
      })}
    >
      {element}
    </li>
  );
};

export default TodoItem;
