/**
 * Configuration for the body
 */
interface IAPICallConfig {
  body: object
  endpoint: string
}

interface IAPIResponse {
  /**
   * `data` of the response
   */
  content?: any
  /**
   * Whether the API call succeeded or not
   */
  success: boolean
  message?: string
  status: number
}

export const CallAPI = async ({ body, endpoint }: IAPICallConfig) => {
  try {
    const responseRaw: Response = await fetch(
      'http://localhost:3002/' + endpoint,
      {
        body: JSON.stringify(body),
        method: 'POST',
      }
    )

    const { status, ok } = responseRaw
    const obj = await responseRaw.json()

    const { error, data } = obj

    let success = ok
    if ('undefined' !== typeof error) {
      success = !error
    }

    return { content: data, status, success } as IAPIResponse
  } catch (err: any) {
    return {
      content: err,
      message: err?.message,
      status: 0,
      success: false,
    } as IAPIResponse
  }
}
