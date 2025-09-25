# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated testing, building, and deployment of the Time Sensei application.

## Workflows

### 1. Test Suite (`test.yml`)
**Triggers:** Push and Pull Requests to `main` and `develop` branches

**Features:**
- Runs tests on Node.js 18 and 20
- Executes linting with ESLint
- Runs unit tests with custom test runner
- Builds the application
- Verifies build output
- Performs security audit
- Uploads build artifacts

**Matrix Strategy:**
- Tests on multiple Node.js versions for compatibility
- Ensures the application works across different environments

### 2. Deployment (`deploy.yml`)
**Triggers:** Push to `main` branch only

**Features:**
- Runs full test suite before deployment
- Builds production-ready application
- Deploys to GitHub Pages
- Includes deployment verification tests
- Uses GitHub Pages environment

**Security:**
- Only runs on main branch pushes
- Requires all tests to pass before deployment
- Uses secure GitHub Pages deployment action

## Test Scripts

### Available npm Scripts:
- `npm run test` - Run unit tests with custom test runner
- `npm run test:ci` - Run tests for CI environment with success confirmation
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage reporting
- `npm run lint` - Run ESLint for code quality
- `npm run build` - Build production application

## Test Coverage

The test suite includes:
- **Model Tests**: 106 test cases across 11 test files
- **Component Tests**: MacroSettings and MarketSessionsSettings
- **Interface Tests**: All trading data models
- **Implementation Validation**: Gherkin scenario validation
- **Build Verification**: Ensures successful compilation

## Deployment Process

1. **Code Push**: Developer pushes to main branch
2. **Test Execution**: GitHub Actions runs full test suite
3. **Build Verification**: Application is built and verified
4. **Security Check**: Security audit is performed
5. **Deployment**: If all checks pass, application is deployed to GitHub Pages
6. **Verification**: Deployment is verified and URL is provided

## Environment Variables

No environment variables are required for the workflows. The application uses:
- Public GitHub Pages deployment
- npm package registry for dependencies
- Built-in GitHub Actions runners

## Monitoring

- **Test Results**: Available in Actions tab
- **Deployment Status**: Shown in repository environments
- **Build Artifacts**: Available for download for 7 days
- **Security Alerts**: GitHub will notify of any security issues

## Troubleshooting

### Common Issues:

1. **Tests Failing**: Check the Actions logs for specific test failures
2. **Build Errors**: Verify all dependencies are properly installed
3. **Linting Errors**: Fix ESLint issues before pushing
4. **Deployment Issues**: Check GitHub Pages settings and permissions

### Debug Steps:

1. Check the Actions tab for detailed logs
2. Verify Node.js version compatibility
3. Ensure all dependencies are up to date
4. Check for any breaking changes in dependencies

## Contributing

When contributing to this project:

1. **Create Feature Branch**: Use descriptive branch names
2. **Run Tests Locally**: Use `npm run test` before pushing
3. **Check Linting**: Use `npm run lint` to ensure code quality
4. **Create Pull Request**: Include description of changes
5. **Wait for CI**: Ensure all checks pass before merging

## Security

- All workflows use official GitHub Actions
- Dependencies are cached for performance
- Security audits are performed on every run
- No sensitive data is stored in workflows
- GitHub Pages deployment is secure and automated
