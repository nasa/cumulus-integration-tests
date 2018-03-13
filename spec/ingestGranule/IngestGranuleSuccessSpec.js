const fs = require('fs');
const workflow = require('@cumulus/integration-tests');
const aws = require('@cumulus/common/aws');

const { loadConfig, templateInput } = require('../helpers/testUtils');
const awsConfig = loadConfig();
const taskName = 'IngestGranule';

const inputTemplateFilename = './spec/ingestGranule/IngestGranule.input.template.json';
const templatedInputFilename = './spec/ingestGranule/IngestGranule.input.json';
templateInput({
  inputTemplateFilename,
  templatedInputFilename,
  config: awsConfig[taskName]
});

const outputPayloadTemplateFilename = './spec/ingestGranule/IngestGranule.output.payload.template.json'
const templatedOutputPayloadFilename = outputPayloadTemplateFilename.replace('.template', '');
templateInput({
  inputTemplateFilename: outputPayloadTemplateFilename,
  templatedInputFilename: templatedOutputPayloadFilename,
  config: awsConfig[taskName]['SyncGranuleOutput']
});
const expectedPayload = JSON.parse(fs.readFileSync(templatedOutputPayloadFilename));

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

describe("The Ingest Granules workflow", function() {
  let workflowExecution = null;

  beforeAll(async () => {
    workflowExecution = await workflow.executeWorkflow(
      awsConfig.stackName,
      awsConfig.bucket,
      taskName,
      templatedInputFilename
    );
  });

  afterAll(async () => {
    //await aws.deleteS3Object(awsConfig.bucket, `${awsConfig.stackName}/pdrs/${pdrFilename}`);
  });

  it('executes successfully', function() {
    expect(workflowExecution.status).toEqual('SUCCEEDED');
  });

  describe("the SyncGranules Lambda", function() {
    let lambdaPayload = null;

    beforeAll(async function() {
      lambdaPayload = await workflow.getLambdaOutput(workflowExecution.executionArn, "SyncGranule");
    });

    it("has expected payload", function() {
      expect(lambdaPayload).toEqual(expectedPayload);
    });

    // it("has expected updated meta", () => {

    // });
  });
});
