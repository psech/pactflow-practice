# The challenge

The consumer recorded the pact in pactflow. See [here](https://domain-test.pactflow.io/overview/provider/qa-ct-backend/consumer/qa-ct-frontend)

![alt text](markdown-assets/pact.png 'Title')

## Option 1 - Application running from within the test

See uncomented lines 43-44 and 91-92 of [/ProviderApiTests.cs](ProviderApiTests.cs)

```cs
    public ProviderApiTests(ITestOutputHelper output)
    {
      _webHost = WebHost.CreateDefaultBuilder().UseUrls(_pactServerUri).UseStartup<TestStartup>().Build();
      _webHost.Start();

      // Starting the provider service; it could be done also in pipeline using dotnet run
      // If removed please remember to also ament the Dispose(bool disposing) method
      _webHostProvider = WebHost.CreateDefaultBuilder().UseUrls(_providerUrl).UseStartup<App.Startup>().Build();
      _webHostProvider.Start();
    }
```

### The result

It looks the first test, hitting `GET /api/TodoItems`, passes. :tada:

The second test, hitting `GET api/TodoItems/102` failes with

```
        expected: 200
             got: 404
```

despite test data should be set up in `qa-ct-backend/Todo.ContractTests/Middleware/ProviderStateMiddleware.cs`.

```cs
      _providerStates = new Dictionary<string, Action> {
        { "todos exists", AddTodos },
        { "todo id=102 exists", AddTodo }
      };
```

```cs
    private void AddTodo()
    {
      _todoRepository.CreateTodoItem(new TodoItem()
      {
        Id = 102,
        Completed = false,
        Text = "A todo task 1",
        DateAdded = DateTime.Now
      });
    }
```

Wirdely, although the app returns `{id, completed, text}` the actual keys are `{type, title, status, traceId}`

```
        Description of differences
        --------------------------------------
        * Could not find key "id" (keys present are: type, title, status, traceId) at $
```

**Full log**

```
Starting test execution, please wait...
A total of 1 test files matched the specified pattern.
warn: Microsoft.AspNetCore.HttpsPolicy.HttpsRedirectionMiddleware[3]
      Failed to determine the https port for redirect.
[xUnit.net 00:00:03.41]     Todo.ContractTests.ProviderApiTests.EnsureProviderHonoursPactWithConsumer [FAIL]
  Failed Todo.ContractTests.ProviderApiTests.EnsureProviderHonoursPactWithConsumer [2 s]
  Error Message:
   PactNet.PactFailureException : Pact verification failed. See output for details.
If the output is empty please provide a custom config.Outputters (IOutput) for your test framework, as we couldn't write to the console.
  Stack Trace:
     at PactNet.Core.PactCoreHost`1.Start()
   at PactNet.PactVerifier.Verify(String description, String providerState)
   at Todo.ContractTests.ProviderApiTests.EnsureProviderHonoursPactWithConsumer() in /Users/przemek.sech/Git/qa-contract-test-challenge/qa-ct-backend/Todo.ContractTests/ProviderApiTests.cs:line 75
  Standard Output Messages:
 INFO: Reading pact at https://domain-test.pactflow.io/pacts/provider/qa-ct-backend/consumer/qa-ct-frontend/version/0.1.2


 Verifying a pact between qa-ct-frontend and qa-ct-backend
   Given todos exists
     a request to get todos
       with GET /api/TodoItems
         returns a response which
 DEBUG: Setting up provider state 'todos exists' for consumer 'qa-ct-frontend' using provider state set up URL http://localhost:9001/provider-states
 I, [2021-06-17T14:34:13.616863 #88382]  INFO -- request: POST http://localhost:9001/provider-states
 D, [2021-06-17T14:34:13.616936 #88382] DEBUG -- request: User-Agent: "Faraday v0.17.3"
 Content-Type: "application/json"
 I, [2021-06-17T14:34:13.660007 #88382]  INFO -- response: Status 200
 D, [2021-06-17T14:34:13.660089 #88382] DEBUG -- response: connection: "close"
 date: "Thu, 17 Jun 2021 04:34:13 GMT"
 server: "Kestrel"
 transfer-encoding: "chunked"
           has status code 200
           has a matching body
           includes headers
             "Content-Type" which matches /application\/json;?.*/
   Given todo id=102 exists
     a request to get todo id=102
       with GET /api/TodoItems/102
         returns a response which
 DEBUG: Setting up provider state 'todo id=102 exists' for consumer 'qa-ct-frontend' using provider state set up URL http://localhost:9001/provider-states
 I, [2021-06-17T14:34:13.882235 #88382]  INFO -- request: POST http://localhost:9001/provider-states
 D, [2021-06-17T14:34:13.882263 #88382] DEBUG -- request: User-Agent: "Faraday v0.17.3"
 Content-Type: "application/json"
 I, [2021-06-17T14:34:13.884838 #88382]  INFO -- response: Status 200
 D, [2021-06-17T14:34:13.884868 #88382] DEBUG -- response: connection: "close"
 date: "Thu, 17 Jun 2021 04:34:13 GMT"
 server: "Kestrel"
 transfer-encoding: "chunked"
           has status code 200 (FAILED - 1)
           has a matching body (FAILED - 2)
           includes headers
             "Content-Type" which matches /application\/json;?.*/ (FAILED - 3)

 Failures:

   1) Verifying a pact between qa-ct-frontend and qa-ct-backend Given todo id=102 exists a request to get todo id=102 with GET /api/TodoItems/102 returns a response which has status code 200
      Failure/Error: expect(response_status).to eql expected_response_status

        expected: 200
             got: 404

        (compared using eql?)

   2) Verifying a pact between qa-ct-frontend and qa-ct-backend Given todo id=102 exists a request to get todo id=102 with GET /api/TodoItems/102 returns a response which has a matching body
      Failure/Error: expect(response_body).to match_term expected_response_body, diff_options, example

        Actual: {"type":"https://tools.ietf.org/html/rfc7231#section-6.5.4","title":"Not Found","status":404,"traceId":"00-10844055be525e40ad02e061a17abf45-857f2a34987d6944-00"}

        Diff
        --------------------------------------
        Key: - is expected
             + is actual
        Matching keys and values are not shown

         {
        -  "id": Fixnum,
        -  "completed": FalseClass,
        -  "text": String
         }

        Description of differences
        --------------------------------------
        * Could not find key "id" (keys present are: type, title, status, traceId) at $
        * Could not find key "completed" (keys present are: type, title, status, traceId) at $
        * Could not find key "text" (keys present are: type, title, status, traceId) at $

   3) Verifying a pact between qa-ct-frontend and qa-ct-backend Given todo id=102 exists a request to get todo id=102 with GET /api/TodoItems/102 returns a response which includes headers "Content-Type" which matches /application\/json;?.*/
      Failure/Error: expect(header_value).to match_header(name, expected_header_value)
        Expected header "Content-Type" to match /application\/json;?.*/, but was "application/problem+json; charset=utf-8"

 2 interactions, 1 failure

 Failed interactions:

 To re-run just this failing interaction, change the verify method to '.Verify(description: "a request to get todo id=102", providerState: "todo id=102 exists")'. Please do not check in this change! # A request to get todo id=102 given todo id=102 exists
 INFO: Verification results published to https://domain-test.pactflow.io/pacts/provider/qa-ct-backend/consumer/qa-ct-frontend/pact-version/68c69c97e10260cdada7f35c79c6cd69aad69081/verification-results/236




Failed!  - Failed:     1, Passed:     0, Skipped:     0, Total:     1, Duration: 2 s - /Users/przemek.sech/Git/qa-contract-test-challenge/qa-ct-backend/Todo.ContractTests/bin/Debug/net5.0/Todo.ContractTests.dll (net5.0)
make: *** [test-pact] Error 1
```

## Option 2 - application running separately (`make start`)

Inspired by [pactflow/example-provider-dotnet](https://github.com/pactflow/example-provider-dotnet)

See comented lines 43-44 and 91-92 of [/ProviderApiTests.cs](ProviderApiTests.cs)

```cs
    public ProviderApiTests(ITestOutputHelper output)
    {
      _webHost = WebHost.CreateDefaultBuilder().UseUrls(_pactServerUri).UseStartup<TestStartup>().Build();
      _webHost.Start();

      // Starting the provider service; it could be done also in pipeline using dotnet run
      // If removed please remember to also ament the Dispose(bool disposing) method
      // _webHostProvider = WebHost.CreateDefaultBuilder().UseUrls(_providerUrl).UseStartup<App.Startup>().Build();
      // _webHostProvider.Start();
    }
```

### The result

THe main issue the following error which I do not understand.

```
      EOFError:
        end of file reached
```

**Full log**

```
Starting test execution, please wait...
A total of 1 test files matched the specified pattern.
[xUnit.net 00:00:02.37]     Todo.ContractTests.ProviderApiTests.EnsureProviderHonoursPactWithConsumer [FAIL]
  Failed Todo.ContractTests.ProviderApiTests.EnsureProviderHonoursPactWithConsumer [1 s]
  Error Message:
   PactNet.PactFailureException : Pact verification failed. See output for details.
If the output is empty please provide a custom config.Outputters (IOutput) for your test framework, as we couldn't write to the console.
  Stack Trace:
     at PactNet.Core.PactCoreHost`1.Start()
   at PactNet.PactVerifier.Verify(String description, String providerState)
   at Todo.ContractTests.ProviderApiTests.EnsureProviderHonoursPactWithConsumer() in /Users/przemek.sech/Git/qa-contract-test-challenge/qa-ct-backend/Todo.ContractTests/ProviderApiTests.cs:line 75
  Standard Output Messages:
 INFO: Reading pact at https://domain-test.pactflow.io/pacts/provider/qa-ct-backend/consumer/qa-ct-frontend/version/0.1.2


 Verifying a pact between qa-ct-frontend and qa-ct-backend
   Given todos exists
     a request to get todos
       with GET /api/TodoItems
         returns a response which
 DEBUG: Setting up provider state 'todos exists' for consumer 'qa-ct-frontend' using provider state set up URL http://localhost:9001/provider-states
 I, [2021-06-17T14:49:10.387921 #89025]  INFO -- request: POST http://localhost:9001/provider-states
 D, [2021-06-17T14:49:10.387951 #89025] DEBUG -- request: User-Agent: "Faraday v0.17.3"
 Content-Type: "application/json"
 I, [2021-06-17T14:49:10.432313 #89025]  INFO -- response: Status 200
 D, [2021-06-17T14:49:10.432363 #89025] DEBUG -- response: connection: "close"
 date: "Thu, 17 Jun 2021 04:49:09 GMT"
 server: "Kestrel"
 transfer-encoding: "chunked"
           has status code 200 (FAILED - 1)
 DEBUG: Setting up provider state 'todos exists' for consumer 'qa-ct-frontend' using provider state set up URL http://localhost:9001/provider-states
 I, [2021-06-17T14:49:10.474197 #89025]  INFO -- request: POST http://localhost:9001/provider-states
 D, [2021-06-17T14:49:10.474222 #89025] DEBUG -- request: User-Agent: "Faraday v0.17.3"
 Content-Type: "application/json"
 I, [2021-06-17T14:49:10.476787 #89025]  INFO -- response: Status 200
 D, [2021-06-17T14:49:10.476992 #89025] DEBUG -- response: connection: "close"
 date: "Thu, 17 Jun 2021 04:49:09 GMT"
 server: "Kestrel"
 transfer-encoding: "chunked"
           has a matching body (FAILED - 2)
           includes headers
 DEBUG: Setting up provider state 'todos exists' for consumer 'qa-ct-frontend' using provider state set up URL http://localhost:9001/provider-states
 I, [2021-06-17T14:49:10.480922 #89025]  INFO -- request: POST http://localhost:9001/provider-states
 D, [2021-06-17T14:49:10.480946 #89025] DEBUG -- request: User-Agent: "Faraday v0.17.3"
 Content-Type: "application/json"
 I, [2021-06-17T14:49:10.483559 #89025]  INFO -- response: Status 200
 D, [2021-06-17T14:49:10.483609 #89025] DEBUG -- response: connection: "close"
 date: "Thu, 17 Jun 2021 04:49:09 GMT"
 server: "Kestrel"
 transfer-encoding: "chunked"
             "Content-Type" which matches /application\/json;?.*/ (FAILED - 3)
   Given todo id=102 exists
     a request to get todo id=102
       with GET /api/TodoItems/102
         returns a response which
 DEBUG: Setting up provider state 'todo id=102 exists' for consumer 'qa-ct-frontend' using provider state set up URL http://localhost:9001/provider-states
 I, [2021-06-17T14:49:10.487314 #89025]  INFO -- request: POST http://localhost:9001/provider-states
 D, [2021-06-17T14:49:10.487338 #89025] DEBUG -- request: User-Agent: "Faraday v0.17.3"
 Content-Type: "application/json"
 I, [2021-06-17T14:49:10.489036 #89025]  INFO -- response: Status 200
 D, [2021-06-17T14:49:10.489064 #89025] DEBUG -- response: connection: "close"
 date: "Thu, 17 Jun 2021 04:49:09 GMT"
 server: "Kestrel"
 transfer-encoding: "chunked"
           has status code 200 (FAILED - 4)
 DEBUG: Setting up provider state 'todo id=102 exists' for consumer 'qa-ct-frontend' using provider state set up URL http://localhost:9001/provider-states
 I, [2021-06-17T14:49:10.491755 #89025]  INFO -- request: POST http://localhost:9001/provider-states
 D, [2021-06-17T14:49:10.491779 #89025] DEBUG -- request: User-Agent: "Faraday v0.17.3"
 Content-Type: "application/json"
 I, [2021-06-17T14:49:10.493256 #89025]  INFO -- response: Status 200
 D, [2021-06-17T14:49:10.493284 #89025] DEBUG -- response: connection: "close"
 date: "Thu, 17 Jun 2021 04:49:09 GMT"
 server: "Kestrel"
 transfer-encoding: "chunked"
           has a matching body (FAILED - 5)
           includes headers
 DEBUG: Setting up provider state 'todo id=102 exists' for consumer 'qa-ct-frontend' using provider state set up URL http://localhost:9001/provider-states
 I, [2021-06-17T14:49:10.496090 #89025]  INFO -- request: POST http://localhost:9001/provider-states
 D, [2021-06-17T14:49:10.496113 #89025] DEBUG -- request: User-Agent: "Faraday v0.17.3"
 Content-Type: "application/json"
 I, [2021-06-17T14:49:10.497335 #89025]  INFO -- response: Status 200
 D, [2021-06-17T14:49:10.497361 #89025] DEBUG -- response: connection: "close"
 date: "Thu, 17 Jun 2021 04:49:09 GMT"
 server: "Kestrel"
 transfer-encoding: "chunked"
             "Content-Type" which matches /application\/json;?.*/ (FAILED - 6)

 Failures:

   1) Verifying a pact between qa-ct-frontend and qa-ct-backend Given todos exists a request to get todos with GET /api/TodoItems returns a response which has status code 200
      Failure/Error: replay_interaction interaction, options[:request_customizer]

      EOFError:
        end of file reached

   2) Verifying a pact between qa-ct-frontend and qa-ct-backend Given todos exists a request to get todos with GET /api/TodoItems returns a response which has a matching body
      Failure/Error: replay_interaction interaction, options[:request_customizer]

      EOFError:
        end of file reached

   3) Verifying a pact between qa-ct-frontend and qa-ct-backend Given todos exists a request to get todos with GET /api/TodoItems returns a response which includes headers "Content-Type" which matches /application\/json;?.*/
      Failure/Error: replay_interaction interaction, options[:request_customizer]

      EOFError:
        end of file reached

   4) Verifying a pact between qa-ct-frontend and qa-ct-backend Given todo id=102 exists a request to get todo id=102 with GET /api/TodoItems/102 returns a response which has status code 200
      Failure/Error: replay_interaction interaction, options[:request_customizer]

      EOFError:
        end of file reached

   5) Verifying a pact between qa-ct-frontend and qa-ct-backend Given todo id=102 exists a request to get todo id=102 with GET /api/TodoItems/102 returns a response which has a matching body
      Failure/Error: replay_interaction interaction, options[:request_customizer]

      EOFError:
        end of file reached

   6) Verifying a pact between qa-ct-frontend and qa-ct-backend Given todo id=102 exists a request to get todo id=102 with GET /api/TodoItems/102 returns a response which includes headers "Content-Type" which matches /application\/json;?.*/
      Failure/Error: replay_interaction interaction, options[:request_customizer]

      EOFError:
        end of file reached

 2 interactions, 2 failures

 Failed interactions:

 To re-run just this failing interaction, change the verify method to '.Verify(description: "a request to get todos", providerState: "todos exists")'. Please do not check in this change! # A request to get todos given todos exists
 To re-run just this failing interaction, change the verify method to '.Verify(description: "a request to get todo id=102", providerState: "todo id=102 exists")'. Please do not check in this change! # A request to get todo id=102 given todo id=102 exists
 INFO: Verification results published to https://domain-test.pactflow.io/pacts/provider/qa-ct-backend/consumer/qa-ct-frontend/pact-version/68c69c97e10260cdada7f35c79c6cd69aad69081/verification-results/237




Failed!  - Failed:     1, Passed:     0, Skipped:     0, Total:     1, Duration: 1 s - /Users/przemek.sech/Git/qa-contract-test-challenge/qa-ct-backend/Todo.ContractTests/bin/Debug/net5.0/Todo.ContractTests.dll (net5.0)
make: *** [test-pact] Error 1
```
