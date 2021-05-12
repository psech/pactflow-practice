using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Todo.App.Models;
using Xunit;

namespace Todo.Tests
{
  public class DbTests
  {
    [Fact]
    public void DataCanBeWrittenToTheDatabase()
    {
      var dbContextOptions = new DbContextOptionsBuilder<TodoContext>()
        .UseInMemoryDatabase("TodoListTest")
        .Options;
      using (var dbContext = new TodoContext(dbContextOptions))
      {
        dbContext.TodoItems.Add(new TodoItem()
        {
          Id = 10,
          Name = "Test all the things",
          IsComplete = false,
          DateAdded = DateTime.Parse("2021-05-11T18:46:37.727957+10:00")
        });
        dbContext.SaveChanges();
      }
      using (var dbContext = new TodoContext(dbContextOptions))
      {
        Assert.True(dbContext.TodoItems.Any());
      }
    }
  }
}
