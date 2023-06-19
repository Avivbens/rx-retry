import { Test, TestingModule } from '@nestjs/testing'
import { RxRetryModule, RxRetryService } from "."
import { ASYNC_CONFIG, SYNC_CONFIG } from './__mocks__/sync-config.mock'
import * as resolve from '../promises/resolve-retry'
import { ConfigModule } from '@nestjs/config'
import * as Operators from '../operators/retry-backoff'



describe.each([
    { configType: 'register', config: SYNC_CONFIG },
    { configType: 'registerAsync', config: ASYNC_CONFIG }
])('RxRetryService  -X', ({ config, configType }) => {
    let service: RxRetryService

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true }),
                (RxRetryModule as any)[configType](config),
            ]
        }).compile()

        service = app.get<RxRetryService>(RxRetryService)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('resolveWithRetry', () => {
        it('should call resolveWithRetry outside function with main config', async () => {
            const prm = new Promise(() => { })
            jest.spyOn(resolve, 'resolveWithRetry').mockImplementation(async () => { })

            await service.resolveWithRetry(prm as any)

            expect(resolve.resolveWithRetry).toBeCalledWith(prm, SYNC_CONFIG)
        })

        it('should call resolveWithRetry outside function with main config, running over timeoutTime', async () => {
            const prm = new Promise(() => { })
            jest.spyOn(resolve, 'resolveWithRetry').mockImplementation(async () => { })

            await service.resolveWithRetry(prm as any, { timeoutTime: 100 })

            expect(resolve.resolveWithRetry).toBeCalledWith(prm, { ...SYNC_CONFIG, timeoutTime: 100 })
        })

        it('should call resolveWithRetry outside function with main config, running over onRetry', async () => {
            const prm = new Promise(() => { })
            const onRetryFn = jest.fn()
            jest.spyOn(resolve, 'resolveWithRetry').mockImplementation(async () => { })

            await service.resolveWithRetry(prm as any, {
                retryStrategy: {
                    onRetry: onRetryFn
                }
            })

            expect(resolve.resolveWithRetry).toBeCalledWith(prm, { ...SYNC_CONFIG, retryStrategy: { ...SYNC_CONFIG.retryStrategy, onRetry: onRetryFn } })
        })
    })

    describe('resolveWithRetryOperator', () => {
        it('should call the operator with global config', () => {
            jest.spyOn(Operators, 'retryBackoff')
            service.resolveWithRetryOperator()

            expect(Operators.retryBackoff).toBeCalledWith(SYNC_CONFIG.retryStrategy)
        })

        it('should call the operator with global config, running over onRetry', () => {
            const onRetry = jest.fn()
            jest.spyOn(Operators, 'retryBackoff')
            service.resolveWithRetryOperator({
                onRetry
            })

            expect(Operators.retryBackoff).toBeCalledWith({ ...SYNC_CONFIG.retryStrategy, onRetry })
        })
    })
})
