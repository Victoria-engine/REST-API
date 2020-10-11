import {
  handleBodyRequestParsing,
  handleCompression,
  handleCors,
} from './common'
import { JWTTokenVerify } from './gateKeeper'

export { JWTTokenVerify }

export default [
  handleBodyRequestParsing,
  handleCompression,
  handleCors,
]