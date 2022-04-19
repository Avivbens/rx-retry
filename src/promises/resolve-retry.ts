import { Logger } from '@nestjs/common'
import { from, lastValueFrom, timeout } from 'rxjs'
import { backoffDelayWithRandom, exponentialBackoffDelay, retryBackoff } from '../operators/retry-backoff'
import { AllRetryConfigOptions, ResolveRetryConfigWithLogger } from '../types'
import { DEFAULT_RESOLVE_RETRY_CONFIG } from './resolve-retry-config'

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
export function resolveWithRetry<T = any>(promise: Promise<T> | any, config: AllRetryConfigOptions | number): Promise<T> {
    const selectedConfig: AllRetryConfigOptions = typeof config === 'number' ? { ...DEFAULT_RESOLVE_RETRY_CONFIG, retryStrategy: { initialInterval: config } } : config

    const {
        retryStrategy,
        loggerError,
        loggerRetry,
        backoffWithRandom = DEFAULT_RESOLVE_RETRY_CONFIG.backoffWithRandom,
        timeoutTime = DEFAULT_RESOLVE_RETRY_CONFIG.timeoutTime,
        loggerInstance = null
    } = selectedConfig as ResolveRetryConfigWithLogger

    retryStrategy.backoffDelay ??= backoffWithRandom ? backoffDelayWithRandom : exponentialBackoffDelay
    retryStrategy.onRetry ??= loggerRetry ? _retryAttempt.bind(null, loggerInstance, loggerRetry) : NOOP
    retryStrategy.onFail ??= loggerError ? _failedRetry.bind(null, loggerInstance, loggerError) : NOOP

    return lastValueFrom<T>(
        from(promise as Promise<T>).pipe(
            timeout(timeoutTime as number),
            retryBackoff(retryStrategy),
        ),
    )
}

function _retryAttempt(logger: Logger | null, log: string, attempt: number) {
    const toLog = `Retry attempt... ${log}, attempt: ${attempt}`
    if (logger) {
        logger.log(toLog)
        return
    }
    console.log(toLog)
}

function _failedRetry(logger: Logger | null, log: string, error: Error) {
    const toLog = `Retry failed, ${log}`
    if (logger) {
        logger.error(toLog, error.stack)
        return
    }
    console.error(toLog, error.stack)
}

const NOOP = () => { }