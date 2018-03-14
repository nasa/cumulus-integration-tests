const fs = require('fs');
const workflow = require('@cumulus/integration-tests');
const aws = require('@cumulus/common/aws');
const { loadConfig, templateFile } = require('../helpers/testUtils');
const awsConfig = loadConfig();
const taskName = 'ParsePdr';

const inputTemplateFilename = './spec/parsePdr/ParsePdr.input.template.json';
const templatedInputFilename = templateFile({
  inputTemplateFilename,
  config: awsConfig[taskName]
});
const expectedParsePdrOutput = JSON.parse(fs.readFileSync('./spec/parsePdr/ParsePdr.output.json'));
const pdrFilename = 'MOD09GQ_1granule_v3.PDR';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

describe("The Parse PDR workflow", function() {
  let workflowExecution = null;

  beforeAll(async function() {
    workflowExecution = await workflow.executeWorkflow(
      awsConfig.stackName,
      awsConfig.bucket,
      taskName,
      templatedInputFilename
    );
  });

  afterAll(async () => {
    await aws.deleteS3Object(awsConfig.bucket, `${awsConfig.stackName}/pdrs/${pdrFilename}`);
  });

  it('executes successfully', function() {
    expect(workflowExecution.status).toEqual('SUCCEEDED');
  });

  describe("the ParsePdr Lambda", function() {
    let lambdaOutput = null;

    beforeAll(async function() {
      lambdaOutput = await workflow.getLambdaOutput(workflowExecution.executionArn, "ParsePdr");
    });

    it("has expected path and name output", function() {
      expect(lambdaOutput.payload).toEqual(expectedParsePdrOutput);
    });
  });

  describe('the QueueGranules Lambda', () => {
    let lambdaOutput = null;

    beforeAll(async function() {
      lambdaOutput = await workflow.getLambdaOutput(workflowExecution.executionArn, "QueueGranules");
    });

    it("has expected path and name output", function() {
      expect(lambdaOutput.payload).toEqual({ granules_queued: 1 });
    });
  });
});
