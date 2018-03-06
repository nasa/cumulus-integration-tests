describe("The Hello World workflow", function() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
  var workflow = require('@cumulus/integration-tests');

  let workflowExecution = null;

  beforeAll(async function() {
    workflowExecution = await workflow.executeWorkflow('test-cumulus', 'cumulus-test-sandbox-internal', 'HelloWorldWorkflow', 'spec/helloWorld/HelloWorldInput.json');
  });

  it('executes successfully', function() {
    expect(workflowExecution.status).toEqual('SUCCEEDED');
  });

  describe("the HelloWorld Lambda", function() {
    let lambdaPayload = null;

    beforeAll(async function() {
      lambdaPayload = await workflow.getLambdaOutput(workflowExecution.executionArn, "HelloWorld");
    });

    it("output is Hello World", function() {
      expect(lambdaPayload).toEqual({ hello: 'Hello World' });
    });
  });
});