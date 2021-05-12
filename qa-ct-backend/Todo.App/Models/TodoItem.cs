using System;

namespace Todo.App.Models
{
  public class TodoItem
  {
    public long Id { get; set; }
    public string Name { get; set; }
    public bool IsComplete { get; set; }
    public DateTime DateAdded { get; set; }
  }
}