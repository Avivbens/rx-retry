import type { RetryBackoffConfig } from './retry-backoff.model'

export interface ResolveRetryConfig {
    /**
     * @description Fail promise and execute retry at this timeout.
     * in milliseconds.
     *
     * @see [RxJS timeout](https://rxjs.dev/api/operators/timeout)
     *
     * @default 0 - 'no timeout'
     */
    timeoutTime?: number

    /**
     * @description Backoff delay with random.
     * If set to true, will use (Math.random() * target) to wait.
     * retryStrategy.backoffDelay will run this over, if set.
     *
     * @see [AWS Exponential Backoff and Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
     *
     * @default true
     */
    useJitter?: boolean

    /**
     * @description Config backoff strategy.
     */
    retryStrategy: RetryBackoffConfig
}

export type ModuleConfiguration = ResolveRetryConfig & {
    /**
     * @description If true, the module will be registered as a global module.
     */
    isGlobal?: boolean
}
