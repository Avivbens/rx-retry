import { Inject, Injectable } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { retryBackoff } from '../operators'
import { resolveWithRetry } from '../promises'
import type { RetryBackoffConfig } from '../types'
import { ResolveRetryConfig } from '../types'
import type { PartialDeep } from '../types/deep-partial'
import { MODULE_OPTIONS_TOKEN } from './rx-retry.module-builder'

@Injectable()
export class RxRetryService {
    constructor(
        @Inject(MODULE_OPTIONS_TOKEN)
        private readonly mainConfig: ResolveRetryConfig,
    ) {}

    /**
     * Resolve promise with exponential backoff retry. Read documetation for more info.
     * @param promise - Promise to resolve
     * @param config - Override the main config - only selected fields
     * @returns Resolved value of the promise with type T (Generic)
     */
    public resolveWithRetry<T = any>(
        promise: Promise<any> | Observable<any>,
        config?: PartialDeep<ResolveRetryConfig>,
    ): Promise<T> {
        const setConfig = config
            ? ({
                  ...this.mainConfig,
                  ...config,
                  retryStrategy: { ...this.mainConfig.retryStrategy, ...(config?.retryStrategy ?? {}) },
              } as ResolveRetryConfig)
            : this.mainConfig
        return resolveWithRetry(promise, setConfig)
    }

    /**
     * An operator in a pipe that retries an Observable with exponential backoff. Read documetation for more info.
     * Will look only for the retryStrategy in the main config.
     * @param config - Override the main config - only selected fields
     */
    public resolveWithRetryOperator(config?: Partial<RetryBackoffConfig>): <T>(source: Observable<T>) => Observable<T> {
        const setConfig = config
            ? ({ ...(this.mainConfig?.retryStrategy ?? {}), ...config } as RetryBackoffConfig)
            : (this.mainConfig?.retryStrategy as RetryBackoffConfig)
        return retryBackoff(setConfig)
    }
}
