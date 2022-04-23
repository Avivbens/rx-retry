import { Inject, Injectable } from '@nestjs/common'
import { resolveWithRetry } from '../promises'
import { ResolveRetryConfigWithLogger } from '../types'
import { RX_RETRY_CONFIG_KEY } from './keys'

@Injectable()
export class RxRetryService {
    constructor(
        @Inject(RX_RETRY_CONFIG_KEY) private readonly mainConfig: ResolveRetryConfigWithLogger
    ) { }

    /**
     * Resolve promise with exponential backoff retry. Read documetation for more info.
     * @param promise - Promise to resolve
     * @param config - Override the main config - only selected fields
     * @returns Resolved value of the promise with type T (Generic)
     */
    public resolveWithRetry<T = any>(promise: any, config?: Partial<ResolveRetryConfigWithLogger>): Promise<T> {
        const setConfig = config ? { ...this.mainConfig, ...config } as ResolveRetryConfigWithLogger : this.mainConfig
        return resolveWithRetry(promise, setConfig)
    }
}