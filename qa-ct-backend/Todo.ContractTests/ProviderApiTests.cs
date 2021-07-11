using System;
using System.Collections.Generic;
using dotenv.net;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using PactNet;
using PactNet.Infrastructure.Outputters;
using Todo.ContractTests.Helpers;
using Todo.ContractTests.Middleware;
using Xunit;
using Xunit.Abstractions;

namespace Todo.ContractTests
{
  public class ProviderApiTests : IDisposable
  {
    private string _providerName { get; }
    private string _providerVersion { get; }
    private string _consumerName { get; }
    private string _providerUrl { get; }
    private string _pactServerUri { get; }
    private IHost _webHost { get; }
    private IHost _webHostProvider { get; }
    private ITestOutputHelper _outputHelper { get; }
    private PactVerifierConfig _config;
    private IConfiguration Configuration { get; set; }

    private static IConfigurationRoot CreateConfiguration()
    {
      return new ConfigurationBuilder()
        .AddEnvironmentVariables()
        .Build();
    }

    public ProviderApiTests(ITestOutputHelper output)
    {
      _outputHelper = output;
      _providerName = "qa-ct-backend";
      _providerVersion = "0.1.2";
      _consumerName = "qa-ct-frontend";
      _providerUrl = "http://localhost:5012";
      _pactServerUri = "http://localhost:9012";

      Configuration = CreateConfiguration();

      if (_webHost == null)
      {
        _webHost = Host.CreateDefaultBuilder()
          .ConfigureWebHostDefaults(builder =>
          {
            builder
              .UseStartup<TestStartup>()
              .Configure(ConfigureWithCustomMiddleware)
              .UseUrls(_pactServerUri)
              .UseKestrel(o => o.AllowSynchronousIO = true);
          })
          .Build();
        _webHost.Start();
      }

      if (_webHostProvider == null)
      {
        _webHostProvider = Host.CreateDefaultBuilder()
          .ConfigureWebHostDefaults(builder =>
          {
            builder
              .UseStartup<TestStartup>()
              .Configure(Configure)
              .UseUrls(_providerUrl)
              .UseKestrel(o => o.AllowSynchronousIO = true);
          })
          .Build();
        _webHostProvider.Start();
      }

      _config = new PactVerifierConfig
      {
        Outputters = new List<IOutput> {
          new XUnitOutput(_outputHelper)
        },
        Verbose = true,
        ProviderVersion = _providerVersion,
        PublishVerificationResults = true
      };

      DotEnv.Fluent().WithExceptions().WithProbeForEnv().Load();
    }

    private void Configure(IApplicationBuilder app)
    {
      app.UseMvc();
    }

    private void ConfigureWithCustomMiddleware(IApplicationBuilder app)
    {
      app.UseMiddleware<ProviderStateMiddleware>();
      Configure(app);
    }

    [Fact]
    public void EnsureProviderHonoursPactWithConsumer()
    {
      IPactVerifier _pactVerifier = new PactVerifier(_config)
        .ProviderState($"{_pactServerUri}/provider-states")
        .ServiceProvider(_providerName, _providerUrl)
        .HonoursPactWith(_consumerName);
      var pactBaseUrl = System.Environment.GetEnvironmentVariable("PACT_BROKER_BASE_URL");
      var pactUrl = $"{pactBaseUrl}/pacts/provider/{_providerName}/consumer/{_consumerName}/version/{_providerVersion}";
      var pactToken = System.Environment.GetEnvironmentVariable("PACT_BROKER_TOKEN");
      _pactVerifier.PactUri(pactUrl, new PactUriOptions(pactToken));

      _pactVerifier.Verify();
    }

    #region IDisposable Support
    private bool disposedValue = false; // To detect redundant calls

    protected virtual void Dispose(bool disposing)
    {
      if (!disposedValue)
      {
        if (disposing)
        {
          _webHost.StopAsync().GetAwaiter().GetResult();
          _webHost.Dispose();

          _webHostProvider.StopAsync().GetAwaiter().GetResult();
          _webHostProvider.Dispose();
        }

        disposedValue = true;
      }
    }

    // This code added to correctly implement the disposable pattern.
    public void Dispose()
    {
      // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
      Dispose(true);
    }
    #endregion
  }
}
