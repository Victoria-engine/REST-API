import { NextFunction, Request, Response } from 'express'
import { ValidationParam } from '../types'
import { HTTP400Error } from '../util/errors/httpErrors'

export const validateParams = (requestParams: ValidationParam[]) => {
  return function (req: Request, res: Response, next: NextFunction) {
    for (const param of requestParams) {
      if (checkParamPresent(Object.keys(req.body), param)) {
        const reqParam = req.body[param.param_key]
        if (!checkParamType(reqParam, param)) {
          throw new HTTP400Error(`${param.param_key} is of type ` + `${typeof reqParam} but should be ${param.type}`)
        } else {
          if (!runValidators(reqParam, param)) {
            throw new HTTP400Error(`validation failed for ${param.param_key}`)
          }
        }
      } else if (param.required) {
        throw new HTTP400Error(`missing parameter ${param.param_key}`)
      }
    }
    next()
  }
}

const checkParamPresent = (reqParams: Request['body'], paramObj: ValidationParam) => {
  return reqParams.includes(paramObj.param_key)
}

const checkParamType = (reqParam: ValidationParam[], paramObj: ValidationParam) => {
  const reqParamType = typeof reqParam
  return reqParamType === paramObj.type
}

const runValidators = (reqParam: ValidationParam[], paramObj: ValidationParam) => {
  if (!paramObj.validator_functions) return true

  for (const validator of paramObj.validator_functions) {
    if (!validator(reqParam)) {
      return false
    }
  }
  return true
}