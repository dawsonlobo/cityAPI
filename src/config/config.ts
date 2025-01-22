import dotenv from 'dotenv';

dotenv.config();
export const CONFIG={
    PORT:getProcessEnv('PORT',true),
    MONGO_URI:getProcessEnv('MONGO_URI',true)
}


function getProcessEnv(variableName: string, isRequired: boolean): string {
    const value = process.env[variableName];
    
    if (isRequired && !value) {
      throw new Error(`${variableName} is required but not found in environment variables.`);
    }
    
    return value || ''; // Return the value if found, otherwise return an empty string
  }
