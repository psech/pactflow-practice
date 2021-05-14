import React, { FC } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useStore } from 'laco-react';
import { TodoStore, setVisibilityFilter } from '../stores/todo';

interface ILinkProps {
  children: any;
  filter: string;
}

const Link: FC<ILinkProps> = ({ children, filter }) => {
  const { visibilityFilter } = useStore(TodoStore);

  return (
    <a
      href="/#"
      className={classnames({ selected: filter === visibilityFilter })}
      style={{ cursor: 'pointer' }}
      onClick={() => setVisibilityFilter(filter)}
    >
      {children}
    </a>
  );
};

Link.propTypes = {
  children: PropTypes.node.isRequired,
  filter: PropTypes.string.isRequired,
};

export default Link;
