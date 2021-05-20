import type { ITodo } from './type';

export enum FilterTitlesEnum {
  All = 'All',
  Completed = 'Completed',
  Active = 'Active',
}

export const getFilteredTodos = (todos: ITodo[], visibilityFilter: string) => {
  switch (visibilityFilter) {
    case FilterTitlesEnum.All:
      return todos;
    case FilterTitlesEnum.Completed:
      return todos.filter((t) => t.completed);
    case FilterTitlesEnum.Active:
      return todos.filter((t) => !t.completed);
    default:
      throw new Error('Unknown filter: ' + visibilityFilter);
  }
};
