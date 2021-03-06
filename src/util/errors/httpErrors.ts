export abstract class HTTPClientError extends Error {
  statusCode!: number
  readonly name!: string

  constructor(message: Record<string, unknown> | string) {
    if (message instanceof Object) {
      super(JSON.stringify(message))
    } else {
      super(message)
    }
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class HTTPError extends HTTPClientError {

  constructor(message: string | Record<string, unknown> = 'Bad Request', statusCode = 500) {
    super(message)

    this.statusCode = statusCode
  }
}


export class HTTP400Error extends HTTPClientError {
  readonly statusCode = 400

  constructor(message: string | Record<string, unknown> = 'Bad Request') {
    super(message)
  }
}

export class HTTP401Error extends HTTPClientError {
  readonly statusCode = 401

  constructor(message: string | Record<string, unknown> = 'Unauthorized.') {
    super(message)
  }
}

export class HTTP404Error extends HTTPClientError {
  readonly statusCode = 404

  constructor(message: string | Record<string, unknown> = 'Not found') {
    super(message)
  }
}