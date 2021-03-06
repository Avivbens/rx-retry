import { DynamicModule, Module, Provider } from '@nestjs/common'
import { ResolveRetryConfig } from '../types'
import { RX_RETRY_CONFIG_KEY } from './keys'
import { RxRetryService } from './rx-retry.service'

@Module({})
export class RxRetryModule {
    static register(config: ResolveRetryConfig, isGlobal: boolean = false): DynamicModule {
        return {
            module: RxRetryModule,
            providers: [
                {
                    provide: RX_RETRY_CONFIG_KEY,
                    useValue: config
                },
                RxRetryService,
            ],
            exports: [
                RxRetryService,
            ],
            global: isGlobal
        }
    }

    static registerAsync(config: AsyncProps<ResolveRetryConfig>, isGlobal: boolean = false): DynamicModule {
        return {
            module: RxRetryModule,
            providers: [
                {
                    ...config,
                    provide: RX_RETRY_CONFIG_KEY,
                } as Provider,
                RxRetryService,
            ],
            exports: [
                RxRetryService
            ],
            global: isGlobal
        }
    }
}

export interface AsyncProps<T> { useFactory: (...args: any[]) => Promise<T>, inject: any[], imports?: any[] }
