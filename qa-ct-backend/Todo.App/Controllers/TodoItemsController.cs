using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;
using Todo.App.Models;

namespace Todo.App.Controllers
{
  [Route("api/TodoItems")]
  [ApiController]
  public class TodoItemsController : ControllerBase
  {
    private readonly TodoContext _context;

    public TodoItemsController(TodoContext context)
    {
      _context = context;
    }

    // GET: api/TodoItems
    [SwaggerOperation(Summary = "Retrieve all the items")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItemDTO>>> GetTodoItems()
    {
      return await _context.TodoItems
        .Select(x => ItemToDTO(x))
        .ToListAsync();
    }

    // GET: api/TodoItems/5
    [SwaggerOperation(Summary = "Retrieve the specific item")]
    [HttpGet("{id}")]
    public async Task<ActionResult<TodoItemDTO>> GetTodoItem(long id)
    {
      var todoItem = await _context.TodoItems.FindAsync(id);

      if (todoItem == null)
      {
        return NotFound();
      }

      return ItemToDTO(todoItem);
    }

    // PUT: api/TodoItems/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [SwaggerOperation(Summary = "Update the specific item")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTodoItem(long id, TodoItemDTO todoItemDTO)
    {
      if (id != todoItemDTO.Id)
      {
        return BadRequest();
      }

      var todoItem = await _context.TodoItems.FindAsync(id);
      if (todoItem == null)
      {
        return NotFound();
      }

      todoItem.Name = todoItemDTO.Name;
      todoItem.IsComplete = todoItemDTO.IsComplete;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException) when (!TodoItemExists(id))
      {
        return NotFound();
      }

      return NoContent();
    }

    // POST: api/TodoItems
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [SwaggerOperation(Summary = "Create an item")]
    [HttpPost]
    public async Task<ActionResult<TodoItem>> CreateTodoItem(TodoItemDTO todoItemDTO)
    {
      var todoItem = new TodoItem
      {
        IsComplete = todoItemDTO.IsComplete,
        Name = todoItemDTO.Name,
        DateAdded = DateTime.Now
      };

      _context.TodoItems.Add(todoItem);
      await _context.SaveChangesAsync();

      return CreatedAtAction(
          nameof(GetTodoItem),
          new { id = todoItem.Id },
          ItemToDTO(todoItem));
    }

    // DELETE: api/TodoItems/5
    [SwaggerOperation(Summary = "Delete the specific item")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodoItem(long id)
    {
      var todoItem = await _context.TodoItems.FindAsync(id);
      if (todoItem == null)
      {
        return NotFound();
      }

      _context.TodoItems.Remove(todoItem);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    // GET: api/TodoItems/ditchDto
    [ApiExplorerSettings(IgnoreApi = true)]
    [HttpGet("ditchDto")]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetAllTodoItems() =>
      await _context.TodoItems.ToListAsync();

    private bool TodoItemExists(long id) =>
      _context.TodoItems.Any(e => e.Id == id);

    private static TodoItemDTO ItemToDTO(TodoItem todoItem) => new TodoItemDTO
    {
      Id = todoItem.Id,
      Name = todoItem.Name,
      IsComplete = todoItem.IsComplete
    };
  }
}
