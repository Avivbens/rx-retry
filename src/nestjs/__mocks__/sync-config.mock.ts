import type { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { ResolveRetryConfig } from '../../models'

export const SYNC_CONFIG: ResolveRetryConfig = {
    timeoutTime: 1000,
    useJitter: true,
    retryStrategy: {
        initialInterval: 1000,
        maxInterval: 10000,
        maxRetries: 5,
    },
}

export const ASYNC_CONFIG: Omit<Provider<ResolveRetryConfig>, 'provide'> = {
    inject: [ConfigService],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    useFactory: async (conf: ConfigService) => SYNC_CONFIG,
}
