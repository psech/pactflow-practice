using System;
using System.Collections.Generic;
using System.Linq;
using Todo.App.Models;

namespace Todo.App.Repository
{
  public class TodoRepository : ITodoRepository
  {
    private readonly TodoContext _context;

    public TodoRepository(TodoContext context)
    {
      _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public void CreateTodoItem(TodoItem todo) =>
      _context.Add(todo);

    public void DeleteTodoItem(long id) =>
      _context.Remove(GetTodoItem(id));

    public TodoItem GetTodoItem(long id) =>
      _context.TodoItems.Where(todo => todo.Id == id).FirstOrDefault();

    public IEnumerable<TodoItem> GetTodoItems() =>
      _context.TodoItems.OrderBy(todo => todo.DateAdded).ToList();

    public bool Save() =>
      (_context.SaveChanges() >= 0);

    public bool TodoItemExists(long id) =>
      _context.TodoItems.Any(e => e.Id == id);

    public void UpdateTodoItem(long id, TodoItem todo)
    {
      throw new NotImplementedException();
    }
  }
}