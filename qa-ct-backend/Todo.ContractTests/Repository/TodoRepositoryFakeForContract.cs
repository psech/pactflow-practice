using System.Collections.Generic;
using System.Linq;
using Todo.App.Models;
using Todo.App.Repository;

namespace Todo.ContractTests.Repository
{
  public class TodoRepositoryFakeForContract : ITodoRepository
  {
    private static readonly TodoRepositoryFakeForContract _instance = new TodoRepositoryFakeForContract();
    private List<TodoItem> _todos = new List<TodoItem>();

    public TodoRepositoryFakeForContract()
    { }

    public static TodoRepositoryFakeForContract GetInstance()
    {
      return _instance;
    }
    public void CreateTodoItem(TodoItem todo)
    {
      _todos.Add(todo);
    }

    public void DeleteTodoItem(long id)
    {
      var todo = GetTodoItem(id);
      _todos.Remove(todo);
    }

    public TodoItem GetTodoItem(long id)
    {
      return _todos.Where(todo => todo.Id == id).FirstOrDefault();
    }

    public IEnumerable<TodoItem> GetTodoItems()
    {
      return _todos.ToList();
    }

    public bool Save()
    {
      throw new System.NotImplementedException();
    }

    public bool TodoItemExists(long id)
    {
      return _todos.Any(todo => todo.Id == id);
    }

    public void UpdateTodoItem(long id, TodoItem todo)
    {
      var existingTodo = GetTodoItem(id);
      existingTodo.Text = todo.Text;
      existingTodo.Completed = todo.Completed;
    }
  }
}