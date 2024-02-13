import type { DynamicModule } from '@nestjs/common'
import { Module } from '@nestjs/common'
import type { ModuleConfiguration } from '../models/retry-config.model'
import type { ASYNC_OPTIONS_TYPE, OPTIONS_TYPE } from './rx-retry.module-builder'
import { ConfigurableModuleClass } from './rx-retry.module-builder'
import { RxRetryService } from './rx-retry.service'

@Module({
    providers: [RxRetryService],
    exports: [RxRetryService],
})
export class RxRetryModule extends ConfigurableModuleClass {
    /**
     * Configure the `rx-retry` module statically.
     *
     * @param options options to configure the cache manager
     */
    public static register(options: typeof OPTIONS_TYPE): DynamicModule {
        const moduleDefinition = super.register(options)

        return {
            ...moduleDefinition,
            global: options.isGlobal ?? false,
        }
    }

    /**
     * Configure the `rx-retry` module dynamically.
     *
     * @param options method for dynamically supplying cache manager configuration options
     */
    public static registerAsync(
        options: typeof ASYNC_OPTIONS_TYPE & Pick<ModuleConfiguration, 'isGlobal'>,
    ): DynamicModule {
        const moduleDefinition = super.registerAsync(options)

        return {
            ...moduleDefinition,
            global: options.isGlobal ?? false,
        }
    }
}
