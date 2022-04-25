import { ConfigService } from '@nestjs/config'
import { ResolveRetryConfig } from '../../../src/types'
import { AsyncProps } from '../rx-retry.module'

export const SYNC_CONFIG: ResolveRetryConfig = {
    timeoutTime: 1000,
    backoffWithRandom: true,
    retryStrategy: {
        initialInterval: 1000,
        maxInterval: 10000,
        maxRetries: 5,
    }
}

export const ASYNC_CONFIG: AsyncProps<ResolveRetryConfig> = {
    inject: [ConfigService],
    useFactory: async (conf: ConfigService) => (SYNC_CONFIG)
}