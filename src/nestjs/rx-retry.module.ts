import { DynamicModule, Module, Provider } from '@nestjs/common'
import { ResolveRetryConfigWithLogger } from '../types'
import { RxRetryService } from './rx-retry.service'

@Module({})
export class RxRetryModule {
    static register(config: ResolveRetryConfigWithLogger, isGlobal: boolean = false): DynamicModule {
        return {
            module: RxRetryModule,
            providers: [
                RxRetryService,
                {
                    provide: RxRetryConfig,
                    useValue: config,
                }
            ],
            exports: [RxRetryService],
            global: isGlobal
        }
    }

    static registerAsync(config: Provider<ResolveRetryConfigWithLogger>, isGlobal: boolean = false): DynamicModule {
        return {
            module: RxRetryModule,
            providers: [
                RxRetryService,
                config,
            ],
            exports: [RxRetryService],
            global: isGlobal
        }
    }
}

export const RxRetryConfig = 'RxRetryConfig'