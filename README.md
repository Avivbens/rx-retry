<h1>
    RX-Retry for JS and TS, using RxJS, support for Node.js & NestJS and browsers
</h1>

#### Provide handling for Observables AND Promises retries, with a configurable delay between retries.

<br>

## Installation

```bash
npm i rx-retry
```

## Usage

```typescript
import { resolveWithRetry, ResolveRetryConfig } from 'rx-retry';

(() => {
    const prm = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Promise error'));
        }, 1000);
    });

    const configuration: ResolveRetryConfig = {
        timeoutTime: 5000, // set timeout to fail the promise and retry, default is 0
        backoffWithRandom: true, // backoff strategy with random + exponantial delay, default is true
        loggerRetry: 'Log this - retry', // add logging on retry, default is no logging
        loggerError: 'Log this - error', // add logging on error, default is no logging
        retryStrategy: {
            initialInterval: 1000, // ms
            maxRetries: 3,
            maxInterval: 10000, // ms
            shouldRetry: (error) => true, // check if retry needed, default is always true
        }
    }
    const res = await resolveWithRetry(prm, configuration);
})();
```

<br>
<br>

# Out of the box support for NestJS

### Module sync configuration

```typescript
import { Module } from '@nestjs/common'
import { TestingService } from './testing.service'
import { RxRetryModule } from "rx-retry"

@Module({
    imports: [
        RxRetryModule.register({
            timeoutTime: 5000, // set timeout to fail the promise and retry, default is 0
            backoffWithRandom: true, // backoff strategy with random + exponantial delay, default is true
            loggerRetry: 'Log this - retry', // add logging on retry, default is no logging
            loggerError: 'Log this - error', // add logging on error, default is no logging
            retryStrategy: {
                initialInterval: 1000, // ms
                maxRetries: 3,
                maxInterval: 10000, // ms
                shouldRetry: (error) => true, // check if retry needed, default is always true
            }
        })
    ],
    providers: [TestingService]
})
export class TestingModule { }
```

<br>
<br>

### Module async configuration

```typescript
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TestingService } from './testing.service'
import { RxRetryModule } from "rx-retry"

@Module({
    imports: [
        // setup for config module
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
        }),

        RxRetryModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (conf: ConfigService) => {
                const configuration = {
                    timeoutTime: +conf.get('timeoutTime'), // set timeout to fail the promise and retry, default is 0
                    backoffWithRandom: !!conf.get('backoffWithRandom'), // backoff strategy with random + exponantial delay, default is true
                    loggerRetry: 'Log this - retry', // add logging on retry, default is no logging
                    loggerError: 'Log this - error', // add logging on error, default is no logging
                    retryStrategy: {
                        initialInterval: +conf.get('initialInterval'), // ms
                        maxRetries: +conf.get('maxRetries'),
                        maxInterval: 10000, // ms
                    },
                }

                return configuration
            }
        })
    ],
    providers: [TestingService]
})
export class TestingModule { }
```

<br>
<br>

### Service usage
```typescript
import { Injectable } from '@nestjs/common'
import { RxRetryService } from 'rx-retry'

@Injectable()
export class TestingService {

    constructor(
        private readonly rxRetry: RxRetryService
    ) { }

    public resolveWithRetry() {
        return this.rxRetry.resolveWithRetry(this._getPromise())
    }

    // run over only for loggerInstance, passing it to log with it
    public runOverCOnfiguration() {
        return this.rxRetry.resolveWithRetry(this._getPromise(), {
            loggerInstance: this.logger
        })
    }

    private _getPromise() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const isOk = Math.random() > 0.5
                if (isOk) {
                    resolve('Promise resolved')
                    return
                }
                reject('Promise rejected')
            }, 1000)
        })
    }
}
```