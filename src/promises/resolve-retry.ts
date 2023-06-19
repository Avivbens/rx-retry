import { from, lastValueFrom, timeout } from 'rxjs'
import { backoffDelayWithRandom, exponentialBackoffDelay, retryBackoff } from '../operators/retry-backoff'
import { DEFAULT_RESOLVE_RETRY_CONFIG, ResolveRetryConfig } from './resolve-retry-config'

/**
 * Retry a promise with exponential backoff.
 * ```ts
    const prm = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Promise error'));
        }, 1000);
    });

    const configuration: ResolveRetryConfig = {
        timeoutTime: 5000, // set timeout to fail the promise and retry, default is 0
        backoffWithRandom: true, // backoff strategy with random + exponantial delay, default is true
        loggerRetry: 'Log this - retry', // add logging on retry, default is no logging
        loggerError: 'Log this - error', // add logging on error, default is no logging
        retryStrategy: {
            initialInterval: 1000, // ms
            maxRetries: 3,
            maxInterval: 10000, // ms
            shouldRetry: (error) => true, // check if retry needed, default is always true
        }
    }
    const res = await resolveWithRetry(prm, configuration);
 * ```
 * @param promise - Promise to resolve
 * @param config - Configuration for retry, can be number as the initial interval, OR ResolveRetryConfig
 * @returns Resolved value of the promise with type T (Generic)
 */
export function resolveWithRetry<T = any>(promise: Promise<T> | any, config: ResolveRetryConfig | number): Promise<T> {
    const {
        retryStrategy,
        loggerError,
        loggerRetry,
        backoffWithRandom = DEFAULT_RESOLVE_RETRY_CONFIG.backoffWithRandom,
        timeoutTime = DEFAULT_RESOLVE_RETRY_CONFIG.timeoutTime,
    } = typeof config === 'number' ? { retryStrategy: { initialInterval: config } } as ResolveRetryConfig : config

    retryStrategy.backoffDelay ??= backoffWithRandom ? backoffDelayWithRandom : exponentialBackoffDelay
    retryStrategy.onRetry ??= loggerRetry ? _retryAttempt.bind(null, loggerRetry) : NOOP
    retryStrategy.onFail ??= loggerError ? _failedRetry.bind(null, loggerError) : NOOP

    return lastValueFrom<T>(
        from(promise as Promise<T>).pipe(
            timeout(timeoutTime as number),
            retryBackoff(retryStrategy),
        ),
    )
}

function _retryAttempt(log: string, attempt: number) {
    console.log(`Retry attempt... ${log}, attempt: ${attempt}`)
}

function _failedRetry(log: string, error: Error) {
    console.error(`Retry failed, ${log}`, error.stack)
}

const NOOP = () => { }