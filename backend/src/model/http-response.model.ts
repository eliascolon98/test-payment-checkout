export class HTTPResponse<T = unknown> {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly data?: T,
  ) {}
}
