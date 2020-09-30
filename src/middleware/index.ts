import {
  handleBodyRequestParsing,
  handleCompression,
  handleCors,
} from './common'

export default [
  handleBodyRequestParsing,
  handleCompression,
  handleCors,
]