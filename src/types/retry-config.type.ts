
import type { RetryBackoffConfig } from './retry-backoff.type';


export interface ResolveRetryConfig {
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
