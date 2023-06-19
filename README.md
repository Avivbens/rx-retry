<h1>
    RX-Retry for JS and TS, using RxJS
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
