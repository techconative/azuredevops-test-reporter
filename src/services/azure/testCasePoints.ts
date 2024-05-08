import { AxiosInstance } from 'axios'
import { IAzureConfig } from '../../interfaces/IAzureConfig'

export async function getPoints(
  axiosClient: AxiosInstance,
  config: IAzureConfig
): Promise<number[]> {
  if (!axiosClient || !Object.keys(axiosClient).length) {
    return new Promise(() => {
      throw new Error('Missing valid Azure Devops client')
    })
  }
  let continuationToken = ''
  let fullTestCasePointIds: number[] = []
  do {
    const testCasesPoints = await axiosClient
      .get(
        `/testplan/Plans/${config.planId}/Suites/${config.suiteId}/TestCase?witFields=System.Id&continuationToken=${continuationToken}&excludeFlags=0&isRecursive=true`
      )
      .catch((error) => {
        throw new Error(error)
      })
    
    const testCasePointIds: number[] = testCasesPoints.data.value
      .flatMap((val: { pointAssignments: { id: number, configurationName?: string }[] }) => {
        if (val.pointAssignments) {
          val.pointAssignments
            .filter(assignment => !config.configurationName || assignment.configurationName === config.configurationName)
            .map(assignment => assignment.id)
        }
      }
    );
    
    fullTestCasePointIds = [...fullTestCasePointIds, ...testCasePointIds]
    continuationToken = testCasesPoints.headers['x-ms-continuationtoken']
  } while (continuationToken !== undefined)

  return fullTestCasePointIds
}
