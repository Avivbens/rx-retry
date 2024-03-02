## [4.1.2](https://github.com/Avivbens/rx-retry/compare/v4.1.1...v4.1.2) (2024-03-02)


### Bug Fixes

* **deps:** resolve vulnerability ([87997d9](https://github.com/Avivbens/rx-retry/commit/87997d90096c9a0cdc0f58e49edfb38240f5c5fc))

## [4.1.1](https://github.com/Avivbens/rx-retry/compare/v4.1.0...v4.1.1) (2024-02-18)


### Bug Fixes

* removeComments to false for build ([ed1433e](https://github.com/Avivbens/rx-retry/commit/ed1433ec54e7be4c1c6c3bab44e0d2ee3ae90dd9))

# [4.1.0](https://github.com/Avivbens/rx-retry/compare/v4.0.0...v4.1.0) (2024-02-13)


### Features

* support `isGlobal` property for global app access - configure once ([cd93807](https://github.com/Avivbens/rx-retry/commit/cd9380783fcdd0e50920f9eb7b1935546f66000d))

# [4.0.0](https://github.com/Avivbens/rx-retry/compare/v3.0.0...v4.0.0) (2024-01-20)


### Bug Fixes

* **configuration:** better async provider using NestJS 9 ConfigurableModuleClass ([af1f644](https://github.com/Avivbens/rx-retry/commit/af1f6446a459641c52335d50aa2aa005c5a2fe6d))
* **docs, configuration:** better docs for each type, useJitter instead of old backoffWithRandom ([871b582](https://github.com/Avivbens/rx-retry/commit/871b582a3203981245dc022b158176ab6880bee3))
* **types:** add docs for time measurement ([c090f9a](https://github.com/Avivbens/rx-retry/commit/c090f9a2bb3641eae55292b05b10ba224bf1da07))


### BREAKING CHANGES

* **docs, configuration:** drop backoffWithRandom in favor of useJitter over RxRetry configuration
* **configuration:** isGlobal property over RxRetryModule is no longer available

# [3.0.0](https://github.com/Avivbens/rx-retry/compare/v2.1.6...v3.0.0) (2024-01-20)


### Bug Fixes

* **deps:** bump up deps ([aa89eb6](https://github.com/Avivbens/rx-retry/commit/aa89eb6a851aecfd8f09be29ac9c90cbb0469692))
* **engine:** set ts target to es2021 ([5ea3dc3](https://github.com/Avivbens/rx-retry/commit/5ea3dc3aae2eba81022e68f25334716a01d3baac))


### BREAKING CHANGES

* **deps:** drop support for nestjs v8, now required - version > 9.0.0
* **engine:** drop support for EOL nodejs, now support - version > 16.0.0

## [2.1.6](https://github.com/Avivbens/rx-retry/compare/v2.1.5...v2.1.6) (2024-01-02)


### Bug Fixes

* description of health-check [skip ci] ([3d9679c](https://github.com/Avivbens/rx-retry/commit/3d9679c3af0b8634ffd83e96004f2418d121e4b5))

## [2.1.5](https://github.com/Avivbens/rx-retry/compare/v2.1.4...v2.1.5) (2023-12-29)


### Bug Fixes

* add commitlint [skip ci] ([61faac5](https://github.com/Avivbens/rx-retry/commit/61faac5d2a19fa6efbd987602d4b4f449b65f210))
* tsconfig remove exclude for mocks [skip ci] ([d63aea4](https://github.com/Avivbens/rx-retry/commit/d63aea4bc0c9526af7f72009410b0df3186ec075))

## [2.1.4](https://github.com/Avivbens/rx-retry/compare/v2.1.3...v2.1.4) (2023-12-28)


### Bug Fixes

* release setup ([855d146](https://github.com/Avivbens/rx-retry/commit/855d14688ddf05a95fd157015ace09014ce75da1))

## [2.1.3](https://github.com/Avivbens/rx-retry/compare/v2.1.2...v2.1.3) (2023-12-28)


### Bug Fixes

* trigger release ([c92b342](https://github.com/Avivbens/rx-retry/commit/c92b342cd75f32f56eaac594dbe235d25ac74f9a))

## [2.1.2](https://github.com/Avivbens/rx-retry/compare/v2.1.1...v2.1.2) (2023-12-28)


### Bug Fixes

* workflow ([ba8e7d6](https://github.com/Avivbens/rx-retry/commit/ba8e7d6a885d85f116ff67cc2e594b9df702d1b8))

# 2.1.1 (2023-12-28)

### Bug Fixes

-   add relevant semantic-release packages ([4c1a0c0](https://github.com/Avivbens/rx-retry/commit/4c1a0c049307f41fab657cc7b60968015303da42))
-   package-lock json ([58e04d7](https://github.com/Avivbens/rx-retry/commit/58e04d799ffa82a40b690e0503d2f8930ccaf05e))
