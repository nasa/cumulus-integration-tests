const fs = require('fs');
const yaml = require('js-yaml');

function loadConfig() {
  let awsConfigFilename = './aws-config.yml';
  const overrideConfigFilename = './aws-config.override.yml';

  if (fs.existsSync(overrideConfigFilename)) {
    awsConfigFilename = overrideConfigFilename;
  }
  return yaml.safeLoad(fs.readFileSync(awsConfigFilename), 'utf8');
}

module.exports.loadConfig = loadConfig;
