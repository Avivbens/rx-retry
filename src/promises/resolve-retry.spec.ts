import type { ResolveRetryConfig } from '../types'
import { resolveWithRetry } from './resolve-retry'
import * as Operators from '../operators/retry-backoff'
import * as RX from 'rxjs'

describe('resolveWithRetry Promises', () => {
    describe('resolveWithRetry', () => {
        it('should set default delay function based on random flag', async () => {
            jest.spyOn(Operators, 'retryBackoff')
            const getPrm = jest.fn().mockImplementation(() => Promise.resolve('test'))
            // getPrm.mockImplementationOnce(() => Promise.reject('error test'))

            const config: ResolveRetryConfig = {
                retryStrategy: {
                    initialInterval: 100,
                    maxInterval: 100,
                    maxRetries: 3,
                },
            }

            const res = await resolveWithRetry(getPrm(), config)

            expect(res).toBe('test')
            expect(Operators.retryBackoff).toBeCalledWith({
                ...config.retryStrategy,
                backoffDelay: Operators.backoffDelayWithRandom,
            })
        })

        it('should set delay function based on random flag 1', async () => {
            jest.spyOn(Operators, 'retryBackoff')
            const getPrm = jest.fn().mockImplementation(() => Promise.resolve('test'))
            // getPrm.mockImplementationOnce(() => Promise.reject('error test'))

            const config: ResolveRetryConfig = {
                retryStrategy: {
                    initialInterval: 100,
                    maxInterval: 100,
                    maxRetries: 3,
                },
                backoffWithRandom: false,
            }

            const res = await resolveWithRetry(getPrm(), config)

            expect(res).toBe('test')
            expect(Operators.retryBackoff).toBeCalledWith({
                ...config.retryStrategy,
                backoffDelay: Operators.exponentialBackoffDelay,
            })
        })

        it('should set delay function based on random flag 2', async () => {
            jest.spyOn(Operators, 'retryBackoff')
            const getPrm = jest.fn().mockImplementation(() => Promise.resolve('test'))
            // getPrm.mockImplementationOnce(() => Promise.reject('error test'))

            const config: ResolveRetryConfig = {
                retryStrategy: {
                    initialInterval: 100,
                    maxInterval: 100,
                    maxRetries: 3,
                },
                backoffWithRandom: true,
            }

            const res = await resolveWithRetry(getPrm(), config)

            expect(res).toBe('test')
            expect(Operators.retryBackoff).toBeCalledWith({
                ...config.retryStrategy,
                backoffDelay: Operators.backoffDelayWithRandom,
            })
        })

        it('should set timeout for the promise', async () => {
            jest.spyOn(RX, 'timeout')
            const getPrm = jest.fn().mockImplementation(() => Promise.resolve('test'))

            const config: ResolveRetryConfig = {
                retryStrategy: {
                    initialInterval: 100,
                    maxInterval: 100,
                    maxRetries: 3,
                },
                timeoutTime: 4000,
            }

            const res = await resolveWithRetry(getPrm(), config)

            expect(RX.timeout).toBeCalledWith(4000)
            expect(res).toBe('test')
        })

        it('should set default timeout for the promise', async () => {
            jest.spyOn(RX, 'timeout')
            const getPrm = jest.fn().mockImplementation(() => Promise.resolve('test'))

            const config: ResolveRetryConfig = {
                retryStrategy: {
                    initialInterval: 100,
                    maxInterval: 100,
                    maxRetries: 3,
                },
            }

            const res = await resolveWithRetry(getPrm(), config)

            expect(RX.timeout).toBeCalledWith(0)
            expect(res).toBe('test')
        })
    })
})
