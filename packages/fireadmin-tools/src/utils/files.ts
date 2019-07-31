import { readdir, existsSync, readFile } from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import { transform } from '@babel/core'
import { DEFAULT_BASE_PATH } from '../constants/filePaths'

export const readDirPromise = promisify(readdir)
export const readFilePromise = promisify(readFile)

/**
 * Get settings from firebaserc file
 * @return {Object} Firebase settings object
 */
export async function readJsonFile(filePath: string): Promise<object|any> {
  if (!existsSync(filePath)) {
    return {};
  }
  try {
    const fileContents = await readFilePromise(filePath, 'utf8')
    return JSON.parse(fileContents);
  } catch (err) {
    console.error(
      `Unable to parse ${
        filePath.replace(DEFAULT_BASE_PATH, '')} - JSON is most likley not valid`,
    );
    return {};
  }
}

const babelConfig = {	
  presets: [	
    ["@babel/preset-env", {
      "targets": {
        "node": "6"
      }
    }]
  ],
  cwd: join(__dirname, '..')
}	

 /**	
 * Run babel transform on a string (settings same as function babelification)	
 * @param  {String} stringToTransform - String code on which to run babel	
 * transform	
 * @return {String} Babelified string	
 */	
function runBabelTransform(stringToTransform: string) {	
  try {	
    const transformed = transform(stringToTransform, babelConfig)
    if (!transformed || !transformed.code) {
      return null
    }
    return transformed.code	
  } catch (err) {	
    console.log('Error running babel transform:', err.message || err)	
    throw err	
  }	
}

export async function requireAsync(modulePath: string) {
  const data = await readFilePromise(modulePath, { encoding: 'utf8' })
  const babelifiedString = runBabelTransform(data)
  const module = {
    exports: {}
  };
  try {
    return eval(babelifiedString || '');
  } catch(err) {
    console.log('Error evaling running code:', err)
    throw err
  }
};

export function getLocalActionsFolder() {
  const DEFAULT_LOCAL_ACTIONS_FOLDER = `${DEFAULT_BASE_PATH}/actions`
  if (existsSync(DEFAULT_LOCAL_ACTIONS_FOLDER)) {
    return DEFAULT_LOCAL_ACTIONS_FOLDER
  }
  const FALLBACK_LOCAL_ACTIONS_FOLDER = `${DEFAULT_BASE_PATH}/migrations`
  if (existsSync(FALLBACK_LOCAL_ACTIONS_FOLDER)) {
    return FALLBACK_LOCAL_ACTIONS_FOLDER
  }
}