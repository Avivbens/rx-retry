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
import { resolveWithRetry, ResolveRetryConfig, retryBackoff } from 'rx-retry';
import { throwError } from 'rxjs'

// Use on a promise
(() => {
    const prm = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Promise error'));
        }, 1000);
    });

    const configuration: ResolveRetryConfig = {
        timeoutTime: 5000, // set timeout to fail the promise and retry, default is 0
        backoffWithRandom: true, // backoff strategy with random + exponantial delay, default is true
        retryStrategy: {
            initialInterval: 1000, // ms
            maxRetries: 3,
            onRetry(attempt: number) {
                console.log('Log this - retry') // adding action on retry
            },
            maxInterval: 10000, // ms
            shouldRetry: (error) => true, // check if retry needed, default is always true
        }
    }
    const res = await resolveWithRetry(prm, configuration);
})();

// Use on Observable, will be converted into promise
(() => {
    const obs = throwError('Observable error')

    const configuration: ResolveRetryConfig = {
        timeoutTime: 5000, // set timeout to fail the promise and retry, default is 0
        backoffWithRandom: true, // backoff strategy with random + exponantial delay, default is true
        retryStrategy: {
            initialInterval: 1000, // ms
            maxRetries: 3,
            onRetry(attempt: number) {
                console.log('Log this - retry') // adding action on retry
            },
            maxInterval: 10000, // ms
            shouldRetry: (error) => true, // check if retry needed, default is always true
        }
    }
    const res = await resolveWithRetry(obs, configuration);
})();

// Using the custom operator function in a pipe
(() => {
    const obs = throwError('Observable error')

    obs.pipe(
            retryBackoff({
                initialInterval: 1000,
                maxInterval: 10000,
                maxRetries: 5,
            })
        )
})();
```

<br>
<br>

# Out of the box support for NestJS

### Module sync configuration

```typescript
import { Module } from '@nestjs/common'
import { TestingService } from './testing.service'
import { RxRetryModule } from 'rx-retry'

@Module({
    imports: [
        RxRetryModule.register({
            timeoutTime: 5000, // set timeout to fail the promise and retry, default is 0
            backoffWithRandom: true, // backoff strategy with random + exponantial delay, default is true
            retryStrategy: {
                initialInterval: 1000, // ms
                maxRetries: 3,
                maxInterval: 10000, // ms
                shouldRetry: (error) => true, // check if retry needed, default is always true
            }
        }, true) // set module as global
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
import { RxRetryModule } from 'rx-retry'

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
                    retryStrategy: {
                        initialInterval: +conf.get('initialInterval'), // ms
                        maxRetries: +conf.get('maxRetries'),
                        maxInterval: 10000, // ms
                    },
                }

                return configuration
            }
        }, true) // set module as global
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
import { catchError, from, Observable, of, throwError } from 'rxjs'

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
            retryStrategy: {
                onRetry: (attempt: number) => {
                    this.logger.log(`Retry attempt ${attempt}`)
                }
            }
        })
    }

    // Resolve Obsevable into promise with global config
    public resolveWithRetryObs() {
        return this.rxRetry.resolveWithRetry(this._getObs())
    }

    // Using the basic operator
    public resolveWithRetryObsPipe() {
        return this._getObs().pipe(
            retryBackoff({
                initialInterval: 1000,
                maxInterval: 10000,
                maxRetries: 5,
                onRetry(attempt: number) {
                    console.log('attempt :>> ', attempt)
                },
            })
        )
    }

    // Run over part of the main configuration
    public resolveWithRetryObsGlobal() {
        return this._getObs().pipe(
            this.rxRetry.resolveWithRetryOperator({
                initialInterval: 1000,
                onRetry: (attempt: number) => {
                    this.logger.debug('attempt :>> ', attempt)
                },
            })
        )
    }


    private _getObs() {
        return throwError('Observable error')
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