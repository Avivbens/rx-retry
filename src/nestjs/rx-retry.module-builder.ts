import { ConfigurableModuleBuilder } from '@nestjs/common'
import type { ResolveRetryConfig } from '../models/retry-config.model'

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
    new ConfigurableModuleBuilder<ResolveRetryConfig>().build()
