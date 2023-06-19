import { Observable, defer, retryWhen, concatMap, iif, timer, throwError, tap } from 'rxjs'
import { resolveWithRetry } from '../promises/resolve-retry'

export interface RetryBackoffConfig {
    /**
     * Initial interval. It will eventually go as high as maxInterval.
     * */
    initialInterval: number

    /**
     * Maximum number of retry attempts.
     * */
    maxRetries?: number

    /**
     * Maximum delay between retries.
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
    onRetry?: (attempt: number) => void

    /**
     * Execute this function on error
     */
    onFail?: (err: Error) => void
}

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
                            onRetry(attempt)
                            return iif(
                                () => attempt < maxRetries && shouldRetry(error),
                                timer(getDelay(backoffDelay(attempt, initialInterval), maxInterval)),
                                throwError(error).pipe(tap(onFail)),
                            )
                        }),
                    ),
                ),
                tap(() => {
                    if (resetOnSuccess) {
                        index = 0
                    }
                }),
            )
        })
}
