import { parseUserId } from '../auth/utils.mjs'

export function getUserId(event) {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export function updateProperties(oldObj, newObj) {
  for (const key in newObj) {
      if (newObj.hasOwnProperty(key) && newObj[key] !== null) {
          if (oldObj.hasOwnProperty(key)) {
              oldObj[key] = newObj[key];
          }
      }
  }
  return oldObj;
}
