import { Inject, Injectable } from '@nestjs/common'
import { resolveWithRetry } from '../promises'
import { ResolveRetryConfigWithLogger } from '../types'
import { RxRetryConfig } from './rx-retry.module'

@Injectable()
export class RxRetryService {
    constructor(
        @Inject(RxRetryConfig) private readonly mainConfig: ResolveRetryConfigWithLogger
    ) { }

    /**
     * Resolve promise with exponential backoff retry. Read documetation for more info.
     * @param promise - Promise to resolve
     * @param config - Override the main config - only selected fields
     * @returns Resolved value of the promise with type T (Generic)
     */
    public resolveWithRetry<T = any>(promise: any, config?: ResolveRetryConfigWithLogger): Promise<T> {
        const setConfig = config ? { ...this.mainConfig, ...config } : this.mainConfig
        return resolveWithRetry(promise, setConfig)
    }
}