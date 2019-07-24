import { prompt } from './utils/prompt'

export async function login() {
  // TODO: Instruct user to generate token within UI of Fireadmin and enter it
  // TODO: Save token within file specific to
  // TODO: In the future look into calling endpoint to auth with google - check firebase-tools for reference
}

export async function getProjects() {
  // TODO: Add logic to call fireadmin API
}

export async function runCustomAction() {
  // TODO: Load action from current repo and run it by passing in environments (selected by user based on migration settings)
  const answers = await prompt({ }, [{ type: 'list', name: 'selectAction', message: 'select action', choices: [{ name: 'option1' }] }])
  console.log('answers', answers)
}

export async function uploadAction() {
  // TODO: Upload custom action to fireadmin
}