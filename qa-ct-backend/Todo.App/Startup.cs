using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Todo.App.Models;
using System;
using Microsoft.OpenApi.Models;
using Todo.App.Repository;

namespace Todo.App
{
  public class Startup
  {
    readonly string CorsAllowAllOrigins = "allowAllOrigins";

    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public virtual void ConfigureServices(IServiceCollection services)
    {
      services.AddDbContext<TodoContext>(opt => opt.UseInMemoryDatabase("TodoList"));
      services.AddSwaggerGen(c =>
      {
        c.EnableAnnotations();
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Todo Application", Version = "v1" });
      });

      services.AddCors(options =>
      {
        options.AddPolicy(name: CorsAllowAllOrigins, builder =>
        {
          builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        });
      });

      services.AddScoped<ITodoRepository, TodoRepository>();
      services.AddMvc(option => option.EnableEndpointRouting = false);
      services.AddControllers();
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
      app.UseCors(CorsAllowAllOrigins);
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
          Text = "Test all the things",
          Completed = false,
          DateAdded = DateTime.Now.AddDays(-1)
        });

        dbContext.TodoItems.Add(new TodoItem()
        {
          Id = 2,
          Text = "Feed the cat",
          Completed = true,
          DateAdded = DateTime.Now
        });

        dbContext.SaveChanges();
      }
    }
  }
}
