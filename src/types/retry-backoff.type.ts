export interface RetryBackoffConfig {
    /**
     * Initial interval. It will eventually go as high as maxInterval.
     * in milliseconds.
     * */
    initialInterval: number

    /**
     * Maximum number of retry attempts.
     * */
    maxRetries?: number

    /**
     * Maximum delay between retries.
     * in milliseconds.
     * */
    maxInterval?: number

    /**
     * When set to `true` every successful emission will reset the delay and the
     * error count.
     * */
    resetOnSuccess?: boolean

    /**
     * Conditional retry.
     * */
    shouldRetry?: (error: any) => boolean

    /**
     * Handle retry with a function, return a delay in ms
     */
    backoffDelay?: (iteration: number, initialInterval: number) => number

    /**
     * Execute this function on each retry
     */
    onRetry?: (attempt: number, error: Error) => void

    /**
     * Execute this function on error
     */
    onFail?: (error: Error) => void
}
