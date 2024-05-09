import * as dotenv from 'dotenv';
dotenv.config();

const Config = {
  //Env variables
  pat: getEnv("AZURE_DEVOPS_PAT"),
  orgUrl: getEnv("ORGANIZATION_URL"),
  projId: getEnv("PROJECT_ID"),
  planId: getEnv("PLAN_ID"),
  suiteId: getEnv("SUITE_ID"),
  runName: getEnv("RUN_NAME"),
  configName: getEnv("CONFIGURATION_NAME")
} as const;

export default Config;

/**
 * function used to verify env values are defined and
 * returns envValue
 * @param  {string} envValue
 * @returns string
 */
function getEnv(envValue: string): string {
  const value = process.env[envValue];
  if (value === undefined) {
    throw new Error(`Environment variable ${envValue} is not set.`);
  }
  return value;
}
