using System;

namespace Todo.App.Models
{
  public class TodoItem
  {
    public long Id { get; set; }
    public string Text { get; set; }
    public bool Completed { get; set; }
    public DateTime DateAdded { get; set; }
  }
}