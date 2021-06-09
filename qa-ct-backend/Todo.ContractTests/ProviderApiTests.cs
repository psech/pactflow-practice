using System;
using System.Collections.Generic;
using dotenv.net;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using PactNet;
using PactNet.Infrastructure.Outputters;
using Todo.ContractTests.Helpers;
using Xunit;
using Xunit.Abstractions;

namespace Todo.ContractTests
{
  public class ProviderApiTests : IDisposable
  {

    private string _providerName { get; }
    private string _consumerName { get; }
    private string _providerUrl { get; }
    private string _PactServerUri { get; }
    private IWebHost _webHost { get; }
    private ITestOutputHelper _outputHelper { get; }
    private PactVerifierConfig config;

    public ProviderApiTests(ITestOutputHelper output)
    {
      _outputHelper = output;
      _providerName = "qa-ct-backend";
      _consumerName = "qa-ct-frontend";
      _providerUrl = "http://localhost:9000";
      _PactServerUri = "http://localhost:9001";

      _webHost = WebHost.CreateDefaultBuilder().UseUrls(_PactServerUri).UseStartup<TestStartup>().Build();
      _webHost.Start();

      config = new PactVerifierConfig
      {
        // NOTE: We default to using a ConsoleOutput,
        // however xUnit 2 does not capture the console output,
        // so a custom outputter is required.
        Outputters = new List<IOutput> {
          new XUnitOutput(output)
        },
        // Output verbose verification logs to the test output
        Verbose = true,
        ProviderVersion = "0.1.0",
        PublishVerificationResults = true
      };

      DotEnv.Fluent().WithExceptions().WithProbeForEnv().Load();
    }

    [Fact]
    public void EnsureProviderHonoursPactWithConsumer()
    {
      IPactVerifier _pactVerifier = new PactVerifier(config)
        .ProviderState($"{_PactServerUri}/provider-states")
        .ServiceProvider(_providerName, _providerUrl)
        .HonoursPactWith(_consumerName);
      string pactUrl = System.Environment.GetEnvironmentVariable("PACT_BROKER_BASE_URL");
      string pactToken = System.Environment.GetEnvironmentVariable("PACT_BROKER_TOKEN");
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
