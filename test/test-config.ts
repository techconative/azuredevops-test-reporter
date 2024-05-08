import * as dotenv from 'dotenv';
dotenv.config();

const Config = {
  //Env variables
  pat: getEnv("AZURE_DEVOPS_PAT"),
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
