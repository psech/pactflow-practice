// Unused usings removed
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using qa_ct_backend.Models;
using System;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace qa_ct_backend
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
      services.AddDbContext<TodoContext>(opt => opt.UseInMemoryDatabase("TodoList"));
      services.AddControllers();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }

      app.UseHttpsRedirection();
      app.UseRouting();

      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });

      // Seeding data
      using (var serviceScope = app.ApplicationServices.CreateScope())
      {
        var dbContext = serviceScope.ServiceProvider.GetService<TodoContext>();

        dbContext.TodoItems.Add(new TodoItem()
        {
          Id = 1,
          Name = "Feed the cat",
          IsComplete = false,
          DateAdded = DateTime.Now
        });

        dbContext.SaveChanges();
      }
    }
  }
}