import { ResolveRetryConfig } from '../types'

export const DEFAULT_RESOLVE_RETRY_CONFIG: ResolveRetryConfig = {
    timeoutTime: 0,
    retryStrategy: {
        initialInterval: 1000,
    },
    backoffWithRandom: true
}