const fs = require('fs');
const clonedeep = require('lodash.clonedeep');
const merge = require('lodash.merge');
const yaml = require('js-yaml');

function loadConfig() {
  let configFileName = './spec/config.yml';
  const overrideConfigFilename = './spec/config.override.yml';

  if (fs.existsSync(overrideConfigFilename) && !process.env.USE_DEFAULT_CONFIG) {
    configFileName = overrideConfigFilename;
  }
  return yaml.safeLoad(fs.readFileSync(configFileName), 'utf8');
};

function templateFile({ inputTemplateFilename, config }) {
  const inputTemplate = JSON.parse(fs.readFileSync(inputTemplateFilename));
  const templatedInput = merge(clonedeep(inputTemplate), config);
  let jsonString = JSON.stringify(templatedInput, null, 2);
  jsonString = jsonString.replace('{{AWS_ACCOUNT_ID}}', process.env.AWS_ACCOUNT_ID);
  const templatedInputFilename = inputTemplateFilename.replace('.template', '');
  fs.writeFileSync(templatedInputFilename, jsonString);
  return templatedInputFilename;
};

module.exports = {
  loadConfig,
  templateFile
};
