import { DynamicModule, Module, Provider } from '@nestjs/common'
import { ResolveRetryConfigWithLogger } from '../types'
import { RxRetryService } from './rx-retry.service'

@Module({})
export class RxRetryModule {
    static register(config: ResolveRetryConfigWithLogger): DynamicModule {
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
        }
    }

    static registerAsync(config: Provider<ResolveRetryConfigWithLogger>): DynamicModule {
        return {
            module: RxRetryModule,
            providers: [
                RxRetryService,
                config,
            ],
            exports: [RxRetryService],
        }
    }
}

export const RxRetryConfig = 'RxRetryConfig'