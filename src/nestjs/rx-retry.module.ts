import { Module } from '@nestjs/common'
import { ConfigurableModuleClass } from './rx-retry.module-builder'
import { RxRetryService } from './rx-retry.service'

@Module({
    providers: [RxRetryService],
    exports: [RxRetryService],
})
export class RxRetryModule extends ConfigurableModuleClass {}
