const fs = require('fs');
const objectPath = require('object-path');
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
  let inputTemplate = JSON.parse(fs.readFileSync(inputTemplateFilename));
  Object.keys(config).forEach((configObjectPath) => {
    const configValue = config[configObjectPath];
    objectPath.set(inputTemplate, configObjectPath, configValue);
  });
  return fs.writeFileSync(templatedInputFilename, JSON.stringify(inputTemplate, null, 2));
};

module.exports = {
  loadConfig,
  templateInput
};
