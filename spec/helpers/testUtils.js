const fs = require('fs');
const clonedeep = require('lodash.clonedeep');
const merge = require('lodash.merge');
const yaml = require('js-yaml');

function loadConfig() {
  let awsConfigFilename = './aws-config.yml';
  const overrideConfigFilename = './aws-config.override.yml';

  if (fs.existsSync(overrideConfigFilename)) {
    awsConfigFilename = overrideConfigFilename;
  }
  return yaml.safeLoad(fs.readFileSync(awsConfigFilename), 'utf8');
};

function templateInput({ inputTemplateFilename, config, templatedInputFilename }) {
  const inputTemplate = JSON.parse(fs.readFileSync(inputTemplateFilename));
  const templatedInput = merge(clonedeep(inputTemplate), config);
  let jsonString = JSON.stringify(templatedInput, null, 2);
  jsonString = readyString.replace('{{AWS_ACCOUNT_ID}}', process.env.AWS_ACCOUNT_ID);
  return fs.writeFileSync(templatedInputFilename, jsonString);
};

module.exports = {
  loadConfig,
  templateInput
};
