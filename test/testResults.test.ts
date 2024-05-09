import { AxiosInstance } from 'axios'
import { ITestApi } from 'azure-devops-node-api/TestApi'
import { IAzureConfig } from '../src/interfaces/IAzureConfig'
import { ITestResult } from '../src/interfaces/ITestResult'
import { setTestResult } from '../src/services/azure/testResults'
import TestConfig from './test-config'


const azureConfig: IAzureConfig = {
  pat: TestConfig.pat,
  organizationUrl: TestConfig.orgUrl,
  projectId: TestConfig.projId,
  planId: +TestConfig.planId,
  suiteId: +TestConfig.suiteId,
  runName: TestConfig.runName,
}

describe('setTestResult', () => {
  it('Should throw error if tests are not found in the Run', async () => {
    const mockClient = {
      get: jest.fn(() => {
        return new Promise((resolve, reject) => {
          resolve([])
        })
      })
    }

    const testResult: ITestResult = {
      testCaseId: '1',
      message: '',
      result: 'Passed'
    }
    const result = setTestResult({} as ITestApi, azureConfig, 1, testResult)
    await expect(result).rejects.toThrow('Missing valid Azure Devops client');
  })

  it('Should throw error if testRunId is undefined', async () => {
    const mockClient = {
      getTestResults: jest.fn(() => {
        return new Promise((resolve, reject) => {
          resolve([])
        })
      })
    }

    const testResult: ITestResult = {
      testCaseId: '1',
      message: '',
      result: 'Passed'
    }

    const runId = undefined

    const result = setTestResult(mockClient as unknown as ITestApi, azureConfig, runId as unknown as number, testResult)
    await expect(result).rejects.toThrow('no testRunId provided');
  })

  it('Should throw error if tests are not found in the Run', async () => {
    const mockClient = {
      getTestResults: jest.fn(() => {
        return new Promise((resolve, reject) => {
          resolve([])
        })
      })
    }

    const testResult: ITestResult = {
      testCaseId: '1',
      message: '',
      result: 'Passed'
    }

    const runId = 1

    const result = setTestResult(mockClient as unknown as ITestApi, azureConfig, runId, testResult)
    await expect(result).rejects.toThrow('no tests founded in testRun with id 1');
  })

  it('Should call updaTestResult function if all conditions are met', async () => {
    const mockClient = {
      getTestResults: jest.fn(() => {
        return new Promise((resolve, reject) => {
          resolve([{
            configuration: {},
            id: 1,
            testRun: {},
            testCaseTitle: 'test title',
            testCase: {
              id: '1'
            }
          }]

          )
        })
      }),
      updateTestResults: jest.fn(() => {
        return new Promise((resolve, reject) => {
          resolve([])
        })
      })
    }

    const testResult: ITestResult = {
      testCaseId: '1',
      message: '',
      result: 'Passed'
    }

    const runId = 1

    await setTestResult(mockClient as unknown as ITestApi, azureConfig, runId, testResult)
    expect(mockClient.updateTestResults).toHaveBeenCalledTimes(1);
  })
})
