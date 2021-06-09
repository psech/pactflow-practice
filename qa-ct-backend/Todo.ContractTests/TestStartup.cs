using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Todo.ContractTests.Middleware;

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
      services.AddControllers();
      services.Configure<KestrelServerOptions>(options =>
      {
        options.AllowSynchronousIO = true;
      });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      app.UseRouting();
      app.UseMiddleware<ProviderStateMiddleware>();
      app.UseEndpoints(endpoints => endpoints.MapControllers());
    }
  }
}