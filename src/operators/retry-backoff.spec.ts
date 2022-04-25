import { catchError, lastValueFrom, of, throwError } from 'rxjs'
import { RetryBackoffConfig } from '../types'
import { backoffDelayWithRandom, exponentialBackoffDelay, getDelay, retryBackoff } from './retry-backoff'

describe('retryBackoff operator', () => {
    describe('getDelay', () => {
        it.each([
            [0, 0, 0],
            [2, 5, 2],
            [8, 4, 4]
        ])('should return mix value of 2 numbers', (n1, n2, min) => {
            const result = getDelay(n1, n2)
            expect(result).toBe(min)
        })
    })

    describe('exponentialBackoffDelay', () => {
        it.each([
            { iteration: 0, initialInterval: 1000, expected: 1000 },
            { iteration: 1, initialInterval: 1000, expected: 2000 },
            { iteration: 2, initialInterval: 1000, expected: 4000 },
            { iteration: 3, initialInterval: 2000, expected: 16000 },
            { iteration: 4, initialInterval: 4000, expected: 64000 },
        ])('should return exponential delay based on iteration', ({ iteration, initialInterval, expected }) => {
            const result = exponentialBackoffDelay(iteration, initialInterval)
            expect(result).toBe(expected)
        })
    })

    describe('backoffDelayWithRandom', () => {
        it.each([
            { iteration: 0, initialInterval: 1000, expected: 1000 * 0.1, random: 0.1 },
            { iteration: 1, initialInterval: 1000, expected: 2000 * 0.2, random: 0.2 },
            { iteration: 2, initialInterval: 1000, expected: 4000 * 0.4, random: 0.4 },
            { iteration: 3, initialInterval: 2000, expected: 16000 * 0.6, random: 0.6 },
            { iteration: 4, initialInterval: 4000, expected: 64000 * 0.7, random: 0.7 },
        ])('should return exponential delay between random of backoff iteration and 0', ({ iteration, initialInterval, expected, random }) => {
            jest.spyOn(Math, 'random').mockReturnValue(random)
            const result = backoffDelayWithRandom(iteration, initialInterval)
            expect(result).toBe(expected)
        })
    })

    describe('retryBackoff', () => {
        it('should retry 3 times, call onRetry 4 times', async () => {
            const onRetry = jest.fn()
            const config: RetryBackoffConfig = {
                initialInterval: 100,
                maxRetries: 3,
                onRetry
            }

            const source = throwError('error')

            const res = await lastValueFrom(
                source.pipe(
                    retryBackoff(config),
                    catchError(() => of('error'))
                )
            )

            expect(res).toBe('error')
            expect(onRetry).toBeCalledTimes(4)
        })

        it('should not call onRetry', async () => {
            const onRetry = jest.fn()
            const config: RetryBackoffConfig = {
                initialInterval: 100,
                maxRetries: 3,
                onRetry
            }

            const source = of(null)

            const res = await lastValueFrom(
                source.pipe(
                    retryBackoff(config),
                    catchError(() => of('error'))
                )
            )

            expect(res).toBe(null)
            expect(onRetry).not.toBeCalled()
        })
    })
})