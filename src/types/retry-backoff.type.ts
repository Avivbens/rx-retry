export interface RetryBackoffConfig {
    /**
     * @description Initial interval. It will eventually go as high as maxInterval.
     * in milliseconds.
     * */
    initialInterval: number

    /**
     * @description Maximum number of retry attempts.
     *
     * @default Infinity
     * */
    maxRetries?: number

    /**
     * @description Maximum delay between retries.
     * in milliseconds.
     *
     * @default Infinity
     * */
    maxInterval?: number

    /**
     * @description When set to `true` every successful emission will reset the delay and the
     * error count.
     *
     * @default false
     * */
    resetOnSuccess?: boolean

    /**
     * @description Conditional retry.
     * */
    shouldRetry?: (error: any) => boolean

    /**
     * @description Handle retry with a function, return a delay in ms
     */
    backoffDelay?: (iteration: number, initialInterval: number) => number

    /**
     * @description Execute this function on each retry
     */
    onRetry?: (attempt: number, error: Error) => void

    /**
     * @description Execute this function on error
     */
    onFail?: (error: Error) => void
}
