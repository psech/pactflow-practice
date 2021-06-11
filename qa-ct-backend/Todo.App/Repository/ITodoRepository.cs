using System.Collections.Generic;
using Todo.App.Models;

namespace Todo.App.Repository
{
  public interface ITodoRepository
  {
    IEnumerable<TodoItem> GetTodoItems();
    TodoItem GetTodoItem(long id);
    void CreateTodoItem(TodoItem todo);
    void UpdateTodoItem(long id, TodoItem todo);
    void DeleteTodoItem(long id);
    bool TodoItemExists(long id);
    bool Save();

  }
}