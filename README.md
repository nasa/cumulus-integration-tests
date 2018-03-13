#  Cumulus Integration Test Project

[![CircleCI](https://circleci.com/gh/cumulus-nasa/cumulus-integration-tests.svg?style=svg)](https://circleci.com/gh/cumulus-nasa/cumulus-integration-tests)

## What is Cumulus?

Cumulus is a cloud-based data ingest, archive, distribution and management
prototype for NASA's future Earth science data streams.

Read the [Cumulus Documentation](https://cumulus-nasa.github.io/)

## Installation

```bash
nvm use
npm install
```

## Running tests locally

These tests run against AWS, so a Cumulus deployment is needed. Set up the deployment using the configurations in this repository. Deployment instructions are located [here](https://cumulus-nasa.github.io/docs/deployment.html). The dashboard is not needed for these tests.

### Using a different stack than `test-cumulus`

Your default AWS credentials should be the same credentials used for the deployment.

If you want to use an existing deployment or a different stack name, ensure to update `app/config.yml`, `iam/config.yml` and `deployer/config.yml`.

When tests run, by default tests will use the configuration defined in `spec/config.yml` to try and execute a workflow. These configuration variables can be overriden with `spec/config.override.yml`. Using an override file is required if using a stack other than `test-cumulus`. If you want to switch back to the default `spec/config.yml` file, you can specify `USE_DEFAULT_CONFIG=true` when running tests. E.g.:

```
USE_DEFAULT_CONFIG=true AWS_ACCOUNT_ID=000000000000 jasmine spec/ingestGranule/IngestGranuleSuccessSpec.js
```

However, for this to work you need to update you AWS credentials as well.

To access test data in `s3://cumulus-data-shared` - required at this time by at least `DiscoverAndQueuePdrsSuccessSpec.js` - the lambda processing role for your deployment must have access to this bucket. This can be done by redeploying your IAM stack using the cloudformation template in the `iam/` directory. This IAM deployment creates a reference to `SharedBucketName` as `cumulus-data-shared` and adds `cumulus-data-shared` as part of the access policy for `LambdaProcessingRole`. However, for the deployment to grant this access, it requires you run the kes deployment as the root user for the aws account associated with your deployment.

### Run all tests

Tests are written and run with [jasmine](https://jasmine.github.io/setup/nodejs.html).

To run all of the tests, run `jasmine` in the top level of the repository.

When running tests locally, include the `AWS_ACCOUNT_ID` of your deployment, e.g.:

```bash
AWS_ACCOUNT_ID=000000000000 jasmine
```

### Run tests for an individual test file

To run an individual test file, include a path to the spec file, i.e. `jasmine spec/helloWorld/HelloWorldSuccessSpec.js`.

## Adding tests

### Adding tests for an existing workflow

Workflow tests are located in the `/spec/<workflow-name>` folder. Any tests and supporting JSON files can go in there. 

### Adding a new test workflow

The workflow should be configured as it would be for a normal Cumulus deployment in `workflows.yml`. It must be deployed to the current deployment if testing locally.

A new folder should be added in the `/spec` folder for the workflow and the tests should go into that folder with the input JSON files. 
