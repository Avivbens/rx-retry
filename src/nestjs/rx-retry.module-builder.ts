import { ConfigurableModuleBuilder } from '@nestjs/common'
import type { ResolveRetryConfig } from '../types/retry-config.type'

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
    new ConfigurableModuleBuilder<ResolveRetryConfig>().build()
