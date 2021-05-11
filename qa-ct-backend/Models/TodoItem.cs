using System;

namespace qa_ct_backend.Models
{
  public class TodoItem
  {
    public long Id { get; set; }
    public string Name { get; set; }
    public bool IsComplete { get; set; }
    public DateTime DateAdded { get; set; }
  }
}