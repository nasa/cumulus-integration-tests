const workflow = require('@cumulus/integration-tests');
const { loadConfig } = require('../helpers/testUtils');
const awsConfig = loadConfig();

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

describe("The Discover And Queue PDRs workflow", function() {
  let workflowExecution = null;

  beforeAll(async function() {
    workflowExecution = await workflow.executeWorkflow(
      awsConfig.stackName,
      awsConfig.bucket,
      'DiscoverAndQueuePdrs',
      'spec/discoverAndQueuePdrs/DiscoverAndQueuePdrs.input.json'
    );
  });

  it('executes successfully', function() {
    expect(workflowExecution.status).toEqual('SUCCEEDED');
  });

  describe("the DiscoverPdrs Lambda", function() {
    let lambdaPayload = null;

    beforeAll(async function() {
      lambdaPayload = await workflow.getLambdaOutput(workflowExecution.executionArn, "DiscoverPdrs");
    });

    it("has expdcted path and name output", function() {
      expect(lambdaPayload.pdrs[0].path).toEqual('lpdaac-cumulus/test_stuff');
      expect(lambdaPayload.pdrs[0].name).toEqual('MOD09GQ_1granule_v3.PDR');
    });
  });

  describe("the QueuePdrs Lambda", function() {
    let lambdaPayload = null;

    beforeAll(async function() {
      lambdaPayload = await workflow.getLambdaOutput(workflowExecution.executionArn, "QueuePdrs");
    });

    it("output is pdrs_queued", function() {
      expect(lambdaPayload).toEqual({ pdrs_queued: 1 });
    });
  });  
});