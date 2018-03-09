const workflow = require('@cumulus/integration-tests');
const { loadConfig, templateInput } = require('../helpers/testUtils');
const awsConfig = loadConfig();
const taskName = 'DiscoverAndQueuePdrs';

const inputTemplateFilename = './spec/discoverAndQueuePdrs/DiscoverAndQueuePdrs.input.template.json';
const templatedInputFilename = './spec/discoverAndQueuePdrs/DiscoverAndQueuePdrs.input.json';
templateInput({
  inputTemplateFilename,
  templatedInputFilename,
  config: awsConfig[taskName]
})

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

describe("The Discover And Queue PDRs workflow", function() {
  let workflowExecution = null;

  beforeAll(async function() {
    workflowExecution = await workflow.executeWorkflow(
      awsConfig.stackName,
      awsConfig.bucket,
      taskName,
      templatedInputFilename
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
      expect(lambdaPayload.pdrs[0].path).toEqual('cumulus-test-data/pdrs');
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