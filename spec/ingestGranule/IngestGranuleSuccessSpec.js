const fs = require('fs');
const workflow = require('@cumulus/integration-tests');
const aws = require('@cumulus/common/aws');

const { loadConfig, templateFile } = require('../helpers/testUtils');
const awsConfig = loadConfig();
const taskName = 'IngestGranule';

const inputTemplateFilename = './spec/ingestGranule/IngestGranule.input.template.json';
const templatedInputFilename = templateFile({
  inputTemplateFilename,
  config: awsConfig[taskName]
});

const outputPayloadTemplateFilename = './spec/ingestGranule/IngestGranule.output.payload.template.json'
const templatedOutputPayloadFilename = templateFile({
  inputTemplateFilename: outputPayloadTemplateFilename,
  config: awsConfig[taskName]['SyncGranuleOutput']
});
const expectedPayload = JSON.parse(fs.readFileSync(templatedOutputPayloadFilename));

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

describe("The Ingest Granules workflow", function() {
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

  describe("the SyncGranules Lambda", function() {
    let lambdaPayload = null;

    beforeAll(async function() {
      lambdaPayload = await workflow.getLambdaOutput(workflowExecution.executionArn, "SyncGranule");
    });

    it("has expected payload", function() {
      expect(lambdaPayload).toEqual(expectedPayload);
    });

    it("has expected updated meta", () => {
      pending('Updated @cumulus/integration-tests package which returns lambda output.');
    });
  });
});
