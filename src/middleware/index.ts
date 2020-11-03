import {
  handleBodyRequestParsing,
  handleCompression,
  handleCors,
} from './common'
import { jwtVerify } from './jwtVerify'

export { jwtVerify }

export default [
  handleBodyRequestParsing,
  handleCompression,
  handleCors,
]