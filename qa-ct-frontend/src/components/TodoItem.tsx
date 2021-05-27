import { FC, useState, PropsWithChildren } from 'react';
import classnames from 'classnames';
import TodoTextInput from './TodoTextInput';
import { ITodo } from '../api/type';

interface ITodoItemProps {
  todo: any;
  handleDeleteTodo: (arg0: number) => void;
  handleEditTodo: (arg0: ITodo, arg1: string) => void;
  handleCompleteTodo: (arg0: ITodo) => void;
}

const TodoItem: FC<ITodoItemProps> = (
  props: PropsWithChildren<ITodoItemProps>,
) => {
  const [editing, setEditing] = useState<boolean>(false);

  const handleDoubleClick = (): void => setEditing(true);

  const handleSave = (todo: ITodo, text: string) => {
    if (todo.text.length === 0) {
      props.handleDeleteTodo(todo.id);
    } else {
      props.handleEditTodo(todo, text);
    }
    setEditing(false);
  };

  const { todo } = props;

  let element = editing ? (
    <TodoTextInput
      text={todo.text}
      editing={editing}
      onSave={(text: string) => handleSave(todo, text)}
    />
  ) : (
    <div className="view">
      <input
        className="toggle"
        type="checkbox"
        checked={todo.completed}
        onChange={() => props.handleCompleteTodo(todo)}
      />
      <label onDoubleClick={handleDoubleClick}>{todo.text}</label>
      <button
        className="destroy"
        onClick={() => props.handleDeleteTodo(todo.id)}
      />
    </div>
  );

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
