const workflow = require('@cumulus/integration-tests');
const { loadConfig } = require('../helpers/testUtils');
const awsConfig = loadConfig();

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

describe("The Hello World workflow", function() {
  let workflowExecution = null;

  beforeAll(async function() {
    workflowExecution = await workflow.executeWorkflow(
      awsConfig.stackName,
      awsConfig.bucket,
      'HelloWorldWorkflow',
      'spec/helloWorld/HelloWorld.input.json'
    );
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