
import type { RetryBackoffConfig } from '../types/retry-backoff.type';

import { catchError, concatMap, defer, iif, Observable, retryWhen, tap, throwError, timer } from 'rxjs';


export function getDelay(backoffDelay: number, maxInterval: number) {
    return Math.min(backoffDelay, maxInterval)
}

export function exponentialBackoffDelay(iteration: number, initialInterval: number) {
    return Math.pow(2, iteration) * initialInterval
}

export function backoffDelayWithRandom(iteration: number, initialInterval: number): number {
    const target = Math.pow(2, iteration) * initialInterval
    const toWait = Math.random() * target
    return toWait
}

export function resetIndexOnSuccess(isReset: boolean, index: number): number {
    return isReset ? 0 : index
}

/**
 * An operator for RxJS pipe, that retry with exponential backoff / random exponential backoff OR custom function.
 * @param config - Configuration for retry, can be number as the initial interval, OR RetryBackoffConfig
 */
export function retryBackoff(config: number | RetryBackoffConfig): <T>(source: Observable<T>) => Observable<T> {
    const {
        initialInterval,
        maxRetries = Infinity,
        maxInterval = Infinity,
        shouldRetry = () => true,
        resetOnSuccess = false,
        onFail = () => { },
        onRetry = () => { },
        backoffDelay = exponentialBackoffDelay,
    } = typeof config === 'number' ? { initialInterval: config } : config
    return <T>(source: Observable<T>) =>
        defer(() => {
            let index = 0
            return source.pipe(
                retryWhen<T>((errors) =>
                    errors.pipe(
                        concatMap((error) => {
                            const attempt = index++
                            return iif(
                                () => attempt < maxRetries && shouldRetry(error),
                                timer(getDelay(backoffDelay(attempt, initialInterval), maxInterval)).pipe(tap(() => onRetry(attempt + 1, error))),
                                throwError(error),
                            )
                        }),
                        catchError((error: Error) => {
                            onFail(error)
                            return throwError(error)
                        }),
                    ),
                ),
                tap(() => {
                    index = resetIndexOnSuccess(resetOnSuccess, index)
                }),
            )
        })
}
