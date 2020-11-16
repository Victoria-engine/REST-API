import { jwtService } from '../services/auth/jwt/jwt'
import { accessTokenRepository } from '../services/auth/oauth2/accessToken'


export const mockJWTVerifyMiddleware = () => {
  // mock JWT service
  jwtService.verify = jest.fn().mockImplementation(() => ({
    id: 1
  }))

  // mock Access Token repository
  accessTokenRepository.get = jest.fn().mockImplementation(() => ({
    accessToken: 'some-valid-token'
  }))
}