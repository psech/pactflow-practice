import React, { FC, PropsWithChildren, useState } from 'react';
import classnames from 'classnames';

interface ITodoTextInputProps {
  text?: string;
  newTodo?: boolean;
  editing?: boolean;
  placeholder?: string;
  onSave: Function;
}

const TodoTextInput: FC<ITodoTextInputProps> = (
  props: PropsWithChildren<ITodoTextInputProps>,
) => {
  const [text, setText] = useState(props.text || '');

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const text = (e.target as HTMLInputElement).value.trim();
    if (e.which === 13) {
      props.onSave(text);
      if (props.newTodo) {
        setText('');
      }
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleBlur = (e) => {
    if (!props.newTodo) {
      props.onSave(e.target.value);
    }
  };

  return (
    <input
      className={classnames({
        edit: props.editing,
        'new-todo': props.newTodo,
      })}
      type="text"
      placeholder={props.placeholder}
      autoFocus={true}
      value={text}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleSubmit}
    />
  );
};

export default TodoTextInput;
