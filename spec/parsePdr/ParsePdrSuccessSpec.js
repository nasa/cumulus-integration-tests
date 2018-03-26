const fs = require('fs');
const { S3 } = require('aws-sdk');
const { executeWorkflow, LambdaStep } = require('@cumulus/integration-tests');

const { loadConfig, templateFile } = require('../helpers/testUtils');

const s3 = new S3();
const config = loadConfig();
const lambdaStep = new LambdaStep();

const taskName = 'ParsePdr';
const inputTemplateFilename = './spec/parsePdr/ParsePdr.input.template.json';
const templatedInputFilename = templateFile({
  inputTemplateFilename,
  config: config[taskName]
});
const expectedParsePdrOutput = JSON.parse(fs.readFileSync('./spec/parsePdr/ParsePdr.output.json'));
const pdrFilename = 'MOD09GQ_1granule_v3.PDR';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

describe("The Parse PDR workflow", function() {
  let workflowExecution = null;

  beforeAll(async function() {
    workflowExecution = await executeWorkflow(
      config.stackName,
      config.bucket,
      taskName,
      templatedInputFilename
    );
  });

  afterAll(async () => {
    await s3.deleteObject({
      Bucket: config.bucket,
      Key: `${config.stackName}/pdrs/${pdrFilename}`
    }).promise();
  });

  it('executes successfully', function() {
    expect(workflowExecution.status).toEqual('SUCCEEDED');
  });

  describe("the ParsePdr Lambda", function() {
    let lambdaOutput = null;

    beforeAll(async function() {
      lambdaOutput = await lambdaStep.getStepOutput(workflowExecution.executionArn, "ParsePdr");
    });

    it("has expected path and name output", function() {
      expect(lambdaOutput.payload).toEqual(expectedParsePdrOutput);
    });
  });

  describe('the QueueGranules Lambda', () => {
    let lambdaOutput = null;

    beforeAll(async function() {
      lambdaOutput = await lambdaStep.getStepOutput(workflowExecution.executionArn, "QueueGranules");
    });

    it("has expected path and name output", function() {
      expect(lambdaOutput.payload).toEqual({ granules_queued: 1 });
    });
  });
});
