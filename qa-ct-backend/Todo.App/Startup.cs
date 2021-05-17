// Unused usings removed
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Todo.App.Models;
using System;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.OpenApi.Models;

namespace Todo.App
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
      services.AddSwaggerGen(c =>
      {
        c.EnableAnnotations();
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Todo Application", Version = "v1" });
      });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Todo Application v1"));
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
          Text = "Feed the cat",
          Completed = false,
          DateAdded = DateTime.Now
        });

        dbContext.SaveChanges();
      }
    }
  }
}