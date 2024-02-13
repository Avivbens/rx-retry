import { ConfigurableModuleBuilder } from '@nestjs/common'
import type { ModuleConfiguration } from '../models/retry-config.model'

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } =
    new ConfigurableModuleBuilder<ModuleConfiguration>().build()
// this is for async options type
export const { ASYNC_OPTIONS_TYPE } = new ConfigurableModuleBuilder<Omit<ModuleConfiguration, 'isGlobal'>>().build()
