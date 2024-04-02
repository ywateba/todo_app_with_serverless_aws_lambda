import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

const logger = createLogger('auth')

const jwksUrl = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`

const certificate =  `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJDH0tBaksNqBFMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi13cHQzcWtoZHhtcWhmZXF1LnVzLmF1dGgwLmNvbTAeFw0yNDAzMjkx
ODQ0MzhaFw0zNzEyMDYxODQ0MzhaMCwxKjAoBgNVBAMTIWRldi13cHQzcWtoZHht
cWhmZXF1LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBALFVzsjwWhZUGNVRTLWNu6OsW+Zm50oEJNNRAIyKLzbj2C/KnQZmpkO/Cswa
00rV1dB9PDxlblAKv6AUW1tYD3UJrk5TUQs2H532NlCL8/4bhEi7Ijipy9WAOjtZ
6jhYf+kh1XC2EFjJZwM5ctovb3Oa3rQ1D7ExWtE7QepzVzhsidaIP2PWDKe33TrW
4P86JP/h6joScAKqVl99WC3R1hsUpfJF1udtvdqsFoy9OCF4AE6GhnM+c2WWqGdU
JdBDUuR51QxBgQ2eymogDO70SRD19OpEhGiohxvAlV+51IFtZfJbfbxba+qt03zC
NDplPjKE3/ppNiCm9MIT2ZH1FIcCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUYAsLcCqO2qh74SDRe/5MW79y/ewwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBJvtjKrRJ51q+JYJW0hVI/GLmhnUis6NUW6WbbjSM8
9b0anm5qScO7O2eXxdl4tO6TInE9UsFIGtBUWAzOTHBJSXYlai71BXIOHYmoJeJj
MfwMWmiiGlMtDYYqgIB8wI/ATQ9O/K92U55gFiA7SvnZc7+44VUtJIkCwi8rp4uk
B6feBGWemw1C1QsH4RnmkG8fIKv+qvloSJhDAFT9oGNPYLTRm2ZtJC3b2I3zMmbv
MnVGVtqI7FQI8iTqbN742t3HDLoqSC9T6S2c+w+pVbEDcLZnNjlYbzLfKXb7CY+W
EfirUbBRKFRTKurw8oEE9k5xeWJsTSF1q/x9ErfQeJdq
-----END CERTIFICATE-----`




export const handler = async (event) => {
    try {
      const jwtToken = await verifyToken(event.authorizationToken)

      return {
        principalId: jwtToken.sub,
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource: '*'
            }
          ]
        }
      }
    } catch (e) {
      logger.error('User not authorized', { error: e.message })

      return {
        principalId: 'user',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Deny',
              Resource: '*'
            }
          ]
        }
      }
    }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)

  return jsonwebtoken.verify(token, certificate, {algorithms: ['RS256']})

  // return jsonwebtoken.decode(token, { complete: true })

}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
