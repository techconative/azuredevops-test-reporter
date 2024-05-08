import { AxiosInstance } from 'axios'
import { ITestApi } from 'azure-devops-node-api/TestApi'
import { IAzureConfig } from '../src/interfaces/IAzureConfig'
import { getPoints } from '../src/services/azure/testCasePoints'
import TestConfig from './test-config'


const azureConfig: IAzureConfig = {
  pat: TestConfig.pat,
  organizationUrl: 'https://dev.azure.com/organization',
  projectId: '3cf7dbc9-cb1e-4240-93f2-9a5960ab3945',
  planId: 12,
  suiteId: 14,
  runName: 'sample',
}

const azureConfigWithConfigName: IAzureConfig = {
  pat: TestConfig.pat,
  organizationUrl: 'https://dev.azure.com/organization',
  projectId: '3cf7dbc9-cb1e-4240-93f2-9a5960ab3945',
  planId: 12,
  suiteId: 14,
  runName: 'sample',
  configurationName: 'stage',
}

describe('Validate http call to retrieve the testCase in the test Run', () => {
  it('Should resolve an empty the promise if a valid AzureDevOps Axios client is passed', async () => {
    const mockClient = {
      get: jest.fn(() => {
        return new Promise((resolve, reject) => {
          resolve({
            data: {
              value: [{
                configuration: {},
                id: 1,
                outcome: "0",
                testCase: {},
                url: "",
                workItemProperties: []
              }]
            },
            headers:{}
          })
        })
      })
    }
    const result = getPoints(mockClient as unknown as AxiosInstance, azureConfig)
    await expect(result).resolves.toEqual([])
  })

  it('Should return all ids if data are wellformed with one default configuration from AzureDevOps API', async () => {
    const mockClient = {
      get: jest.fn(() => {
        return new Promise((resolve, reject) => {
          resolve({
            data: {
              value: [{
                pointAssignments: [{ id: 1 , configurationName:'default' }],
                configuration: {},
                id: 1,
              },
              {
                pointAssignments: [{ id: 3, configurationName:'default' }],
                configuration: {},
                id: 2,
              }]
            },
            headers:{}
          })
        })
      })
    }
    const result = getPoints(mockClient as unknown as AxiosInstance, azureConfig)
    await expect(result).resolves.toEqual([1, 3])
  })

  it('Should return matching ids of configurationName for wellformed data with multiple configurations from AzureDevOps API', async () => {
    const mockClient = {
      get: jest.fn(() => {
        return new Promise((resolve, reject) => {
          resolve({
            data: {
              value: [{
                pointAssignments: [{ id: 1, configurationName: 'dev' }, { id: 2, configurationName: 'stage' }],
                configuration: {},
                id: 1,
              },
              {
                pointAssignments: [{ id: 3, configurationName: 'dev' }, { id: 4, configurationName: 'stage' }],
                configuration: {},
                id: 2,
              }]
            },
            headers:{}
          })
        })
      })
    }
    const result = getPoints(mockClient as unknown as AxiosInstance, azureConfigWithConfigName)
    await expect(result).resolves.toEqual([2, 4])
  })

  it('Should return empty if data are wellformed without no matching configuration from AzureDevOps API', async () => {
    const mockClient = {
      get: jest.fn(() => {
        return new Promise((resolve, reject) => {
          resolve({
            data: {
              value: [{
                pointAssignments: [{ id: 1, configurationName: 'dev' }, { id: 2, configurationName: 'prod' }],
                configuration: {},
                id: 1,
              },
              {
                pointAssignments: [{ id: 3, configurationName: 'dev' }, { id: 4, configurationName: 'prod' }],
                configuration: {},
                id: 2,
              }]
            },
            headers:{}
          })
        })
      })
    }
    const result = getPoints(mockClient as unknown as AxiosInstance, azureConfigWithConfigName)
    await expect(result).resolves.toEqual([])
  })

  it('Should throw error an error if an empty AzureDevOps Axios client is passed', async () => {
    const result = getPoints({} as AxiosInstance, azureConfig)
    await expect(result).rejects.toThrow('Missing valid Azure Devops client');
  })

  it('Should throw error if AzureDevOps Axios client is throwing an exception', async () => {
    const mockClient = {
      get: jest.fn(()=>{
        return new Promise((resolve, reject)=>{
          reject('rejected call');
        })
      })
    }
    const result = getPoints(mockClient as unknown as AxiosInstance, azureConfig)
    await expect(result).rejects.toThrow('rejected call');
  })
})
