import { RetryBackoffConfig } from '../operators/retry-backoff'

export interface ResolveRetryConfig {
    /**
     * Log to console on retry attempt.
     * */
    loggerRetry?: string

    /**
     * Log to console on retry error.
     */
    loggerError?: string

    /**
     * Fail promise and execute retry at this timeout.
     */
    timeoutTime?: number

    /**
     * Backoff delay with random.
     * If set to true, will use Math.random() * target to wait.
     * retryStrategy.backoffDelay will run this over.
     */
    backoffWithRandom?: boolean

    /**
     * Config backoff strategy.
     */
    retryStrategy: RetryBackoffConfig
}

export const DEFAULT_RESOLVE_RETRY_CONFIG: ResolveRetryConfig = {
    timeoutTime: 0,
    retryStrategy: {
        initialInterval: 1000,
    },
    backoffWithRandom: true
}