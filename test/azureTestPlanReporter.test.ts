import { AxiosInstance } from 'axios'
import { ITestApi } from 'azure-devops-node-api/TestApi'
import { IAzureConfig } from '../src/interfaces/IAzureConfig'
import { AzureTestPlanReporter } from '../src/index'
import TestConfig from './test-config'




const validAzureConfig: IAzureConfig = {
  pat: TestConfig.pat,
  organizationUrl: TestConfig.orgUrl,
  projectId: TestConfig.projId,
  planId: +TestConfig.planId,
  suiteId: +TestConfig.suiteId,
  runName: TestConfig.runName,
}

describe('Constructor', () => {
  it('Should throw Error if config is not defined', () => {

    const result = () => new AzureTestPlanReporter(undefined as unknown as IAzureConfig)

    expect(result).toThrowError('Invalid Azure Test plan configuration')
  })


  it('Should throw Error if config not valid', () => {

    const notValidAzureConfig = {
    planId: +TestConfig.planId,
    suiteId: +TestConfig.suiteId,
    runName: TestConfig.runName,
    }

    const result = () => new AzureTestPlanReporter(notValidAzureConfig as unknown as IAzureConfig)

    expect(result).toThrowError('Invalid Azure Test plan configuration')
  })

  it('Should return a valid instance of AzureTestPlan reporter', () => {

    const result = new AzureTestPlanReporter(validAzureConfig)

    expect(result).toBeDefined()
  })

})
