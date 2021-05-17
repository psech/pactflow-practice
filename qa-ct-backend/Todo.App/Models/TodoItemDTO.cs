namespace Todo.App.Models
{
  public class TodoItemDTO
  {
    public long Id { get; set; }
    public string Text { get; set; }
    public bool Completed { get; set; }
  }
}