module.exports = process.env.CI
    ? {
          '**/*': 'npm run lint',
      }
    : {
          '**/*': 'npm run lint:fix',
      }
