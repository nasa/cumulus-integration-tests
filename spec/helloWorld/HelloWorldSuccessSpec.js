describe("HelloWorld Workflow Success", function() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
  var workflow = require('../../../cumulus/packages/integration-tests/dist/index');

  let workflowExecution = null;

  beforeAll(async function() {
    workflowExecution = await workflow.executeWorkflow('test-cumulus', 'cumulus-test-sandbox-internal', 'HelloWorldWorkflow', 'spec/helloWorld/HelloWorldInput.json');
  });

  it('Hello World worlflow executes successfully', function() {
    expect(workflowExecution.status).toEqual('SUCCEEDED');
  });

  describe("HelloWorld Lambda", function() {
    let lambdaPayload = null;

    beforeAll(async function() {
      lambdaPayload = await workflow.getLambdaOutput(workflowExecution.executionArn, "HelloWorld");
    });

    it("HelloWorld output is correct", function() {
      expect(lambdaPayload).toEqual({ hello: 'Hello World' });
    });
  });
});