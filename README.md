#  Cumulus Integration Test Project

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

If you want to use an existing deployment or a different stack name, ensure to update `app/config.yml`, `iam/config.yml` and `deployer/config.yml`.

When tests run, by default tests will use the AWS configuration defined in `aws-config.yml` to try and execute a workflow. These AWS configuration variables can be overriden with `aws-config.override.yml`

Your default AWS credentials should be the same credentials used for the deployment.

Tests are written and run with [jasmine](https://jasmine.github.io/setup/nodejs.html).

### Run all tests

To run all of the tests, run `jasmine` in the top level of the repository.

### Run tests for an individual test file

To run an individual test file, include a path to the spec file, i.e. `jasmine spec/helloWorld/HelloWorldSuccessSpec.js`.

## Adding tests

### Adding tests for an existing workflow

Workflow tests are located in the `/spec/<workflow-name>` folder. Any tests and supporting JSON files can go in there. 

### Adding a new test workflow

The workflow should be configured as it would be for a normal Cumulus deployment in `workflows.yml`. It must be deployed to the current deployment if testing locally.

A new folder should be added in the `/spec` folder for the workflow and the tests should go into that folder with the input JSON files. 
