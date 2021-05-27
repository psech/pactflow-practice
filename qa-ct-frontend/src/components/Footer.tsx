import React, { FC } from 'react';
import FilterLink from './Link';

import { FilterTitlesEnum } from '../api/helpers';

const FILTER_TITLES = Object.keys(FilterTitlesEnum);

interface IFooterProps {
  activeCount: number;
  completedCount: number;
  onClearCompleted: React.MouseEventHandler<HTMLButtonElement>;
  visibilityFilter;
  setVisibilityFilter;
}

const Footer: FC<IFooterProps> = (props) => {
  const { activeCount, completedCount, onClearCompleted } = props;
  const itemWord = activeCount === 1 ? 'item' : 'items';
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount || 'No'}</strong> {itemWord} left
      </span>
      <ul className="filters">
        {FILTER_TITLES.map((filter) => (
          <li key={filter}>
            <FilterLink
              filter={filter}
              visibilityFilter={props.visibilityFilter}
              setVisibilityFilter={props.setVisibilityFilter}
            >
              {filter}
            </FilterLink>
          </li>
        ))}
      </ul>
      {!!completedCount && (
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default Footer;
