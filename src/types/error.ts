export class HttpError extends Error {
  status: number
  statusText?: string
  code?: string
  message: string

  constructor({ status, statusText, code, message }: {
    status: number
    statusText?: string
    code?: string
    message: string
  }) {
    super(message)
    // Object.setPrototypeOf(this, HttpError.prototype)
    this.status = status
    this.statusText = statusText
    this.code = code
    this.message = message
  }
}
