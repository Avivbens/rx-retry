
import type { ResolveRetryConfig } from '../types';

import { from, lastValueFrom, timeout } from 'rxjs';
import { backoffDelayWithRandom, exponentialBackoffDelay, retryBackoff } from '../operators/retry-backoff';
import { DEFAULT_RESOLVE_RETRY_CONFIG } from './resolve-retry-config';

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
    const selectedConfig: ResolveRetryConfig = typeof config === 'number' ? { ...DEFAULT_RESOLVE_RETRY_CONFIG, retryStrategy: { initialInterval: config } } : config

    const {
        retryStrategy,
        backoffWithRandom = DEFAULT_RESOLVE_RETRY_CONFIG.backoffWithRandom,
        timeoutTime = DEFAULT_RESOLVE_RETRY_CONFIG.timeoutTime,
    } = selectedConfig as ResolveRetryConfig

    retryStrategy.backoffDelay ??= backoffWithRandom ? backoffDelayWithRandom : exponentialBackoffDelay

    const obs = from(promise as Promise<T>)
        .pipe(
            timeout(timeoutTime as number),
            retryBackoff(retryStrategy),
        )

    return lastValueFrom<T>(obs)
}
