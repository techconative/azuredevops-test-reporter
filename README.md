# AzureDevOps Test Reporter TS

[![version](https://img.shields.io/npm/v/azuredevops-test-reporter-ts.svg)](https://www.npmjs.com/package/azuredevops-test-reporter-ts)
[![downloads](https://img.shields.io/npm/dt/azuredevops-test-reporter-ts.svg)](https://www.npmjs.com/package/azuredevops-test-reporter-ts)

Using this package with [WDIO Azure Devops Service](https://github.com/techconative/wdio-azure-devops-service) to publish WDIO test results to Azure Test Plan.

### Pre-requisite to run test:
create a `.env` file at root directory of this project and add below values:
- `AZURE_DEVOPS_PAT`=***$$##***
- `ORGANIZATION_URL`=https://dev.azure.com/****
- `PROJECT_ID`=***##***
- `PLAN_ID`=1
- `SUITE_ID`=2
- `RUN_NAME`=sample
- `CONFIGURATION_NAME`=stage