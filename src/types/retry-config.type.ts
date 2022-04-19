import { Logger } from '@nestjs/common'
import { RetryBackoffConfig } from './retry-backoff.type'

export type AllRetryConfigOptions = ResolveRetryConfig | ResolveRetryConfigWithLogger

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

export interface ResolveRetryConfigWithLogger extends ResolveRetryConfig {
    /**
     * Pass logger instance to log with.
     */
    loggerInstance?: Logger
}

