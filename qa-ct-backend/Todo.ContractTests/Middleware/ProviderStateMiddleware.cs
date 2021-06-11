using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Todo.ContractTests.Middleware
{
  public class ProviderStateMiddleware
  {
    private const string ConsumerName = "qa-ct-frontend";
    private readonly RequestDelegate _next;
    private readonly IDictionary<string, Action> _providerStates;

    public ProviderStateMiddleware(RequestDelegate next)
    {
      _next = next;
      _providerStates = new Dictionary<string, Action> {
        {"Provider health chack", DoSomething}
      };
    }
    private void DoSomething()
    {
      // Test data
    }

    public async Task Invoke(HttpContext context)
    {
      if (context.Request.Path.Value == "/provider-states")
      {
        this.HandleProviderStatesRequest(context);
        await context.Response.WriteAsync(String.Empty);
      }
      else
      {
        await this._next(context);
      }
    }

    private void HandleProviderStatesRequest(HttpContext context)
    {
      context.Response.StatusCode = (int)HttpStatusCode.OK;

      if (context.Request.Method.ToUpper() == HttpMethods.Post.ToString().ToUpper() &&
        context.Request.Body != null)
      {
        string jsonRequestBody = String.Empty;
        using (var reader = new StreamReader(context.Request.Body, Encoding.UTF8))
        {
          jsonRequestBody = reader.ReadToEnd();
        }

        var providerState = JsonConvert.DeserializeObject<ProviderState>(jsonRequestBody);

        //A null or empty provider state key must be handled
        if (providerState != null &&
          !String.IsNullOrEmpty(providerState.State) &&
          providerState.Consumer == ConsumerName)
        {
          _providerStates[providerState.State].Invoke();
        }
      }
    }
  }
}