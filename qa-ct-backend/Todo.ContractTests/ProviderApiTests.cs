using System;
using System.Collections.Generic;
using dotenv.net;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using PactNet;
using PactNet.Infrastructure.Outputters;
using Todo.App.Repository;
using Todo.ContractTests.Helpers;
using Todo.ContractTests.Repository;
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
    private IWebHost _webHost { get; }
    private IWebHost _webHostProvider { get; }
    private ITestOutputHelper _outputHelper { get; }
    private PactVerifierConfig _config;

    public ProviderApiTests(ITestOutputHelper output)
    {
      _outputHelper = output;
      _providerName = "qa-ct-backend";
      _providerVersion = "0.1.2";
      _consumerName = "qa-ct-frontend";
      _providerUrl = "http://localhost:5001";
      _pactServerUri = "http://localhost:9001";

      _webHost = WebHost.CreateDefaultBuilder().UseUrls(_pactServerUri).UseStartup<TestStartup>().Build();
      _webHost.Start();

      // Starting the provider service; it could be done also in pipeline using dotnet run
      // If removed please remember to also ament the Dispose(bool disposing) method
      _webHostProvider = WebHost.CreateDefaultBuilder().UseUrls(_providerUrl).UseStartup<App.Startup>().Build();
      _webHostProvider.Start();

      _config = new PactVerifierConfig
      {
        // NOTE: We default to using a ConsoleOutput,
        // however xUnit 2 does not capture the console output,
        // so a custom outputter is required.
        Outputters = new List<IOutput> {
          new XUnitOutput(_outputHelper)
        },
        // Output verbose verification logs to the test output
        Verbose = true,
        ProviderVersion = _providerVersion,
        PublishVerificationResults = true
      };

      DotEnv.Fluent().WithExceptions().WithProbeForEnv().Load();
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
      // _pactVerifier.Verify(description: "a request to get todo id=102", providerState: "todo id=102 exists");
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
