using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Todo.App.Controllers;
using Todo.App.Repository;
using Todo.ContractTests.Repository;

namespace Todo.ContractTests
{
  public class TestStartup
  {
    public IConfiguration Configuration { get; }
    public TestStartup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
      services.AddMvc(option =>
      {
        option.EnableEndpointRouting = false;
      }).AddNewtonsoftJson()
        .AddApplicationPart(typeof(TodoItemsController).Assembly);

      services.AddSingleton<ITodoRepository>(TodoRepositoryFakeForContract.GetInstance());
    }

    // Asp.netcore runtime requires a public method named Configure when startup class is used.
    public void Configure(IApplicationBuilder app)
    {
    }
  }
}