# Gherkin Feature Files

This directory contains Gherkin feature files that document the behavior and functionality of the trading session management application. These files serve as living documentation and can be used for behavior-driven development (BDD).

## Files Overview

### `optional-probability.feature`
This file documents the optional probability feature for trading sessions. It covers:
- Interface definitions and optional probability support
- Component behavior for handling optional probability
- User interface interactions and form handling
- Timeline display of optional probability
- Summary statistics and reporting
- Integration with trading logic

### `unit-tests.feature`
This file documents the comprehensive unit test coverage for the application. It covers:
- Model interface tests
- Component behavior tests
- Test structure and organization
- Test coverage and validation
- Test execution and maintenance

## How to Use These Files

### For Developers
- **Documentation**: These files serve as comprehensive documentation of the application's behavior
- **Test Planning**: Use these scenarios to plan and implement new tests
- **Code Review**: Reference these scenarios during code reviews to ensure all behavior is covered
- **Regression Testing**: Use these scenarios to verify that changes don't break existing functionality

### For Testers
- **Manual Testing**: Use these scenarios as test cases for manual testing
- **Test Automation**: These scenarios can be automated using tools like Cucumber or similar BDD frameworks
- **Test Coverage**: Ensure all scenarios are covered by your test suite

### For Product Owners
- **Requirements**: These files document the expected behavior of the application
- **Acceptance Criteria**: Use these scenarios as acceptance criteria for features
- **User Stories**: These scenarios can be used to create user stories and epics

## Scenario Categories

### Interface Tests
- **MacroSession**: Tests for macro session interface with optional probability
- **MarketSession**: Tests for market session interface with optional probability
- **TimeBlock**: Tests for time block interface with optional probability
- **TimeRange**: Tests for time range interface
- **TradingParameters**: Tests for trading parameters interface
- **TradingStatus**: Tests for trading status type
- **KillzoneSession**: Tests for killzone session interface
- **NewsTemplate**: Tests for news template interface
- **NewsInstance**: Tests for news instance interface

### Component Tests
- **MacroSettings**: Tests for macro settings component behavior
- **MarketSessionsSettings**: Tests for market sessions settings component behavior
- **Timeline**: Tests for timeline component display behavior

### Integration Tests
- **Trading Logic**: Tests for integration with trading logic
- **Default Parameters**: Tests for default trading parameters
- **Form State**: Tests for form state management
- **Select Components**: Tests for select component behavior

### User Experience Tests
- **Form Interactions**: Tests for user interactions with forms
- **Summary Statistics**: Tests for summary display and statistics
- **Collapsible Components**: Tests for collapsible/expandable functionality
- **Tooltip Display**: Tests for tooltip information display

## Test Execution

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

### Test Results
The test runner will:
- Execute all unit tests
- Validate implementation against Gherkin scenarios
- Report test coverage and results
- Identify any missing functionality

### Test Validation
The test runner validates:
- ✅ Interface definitions and optional probability support
- ✅ Component behavior and form handling
- ✅ User interface interactions
- ✅ Timeline display functionality
- ✅ Summary statistics and reporting
- ✅ Integration with trading logic
- ✅ Test coverage and structure

## Maintenance

### Updating Scenarios
When adding new features or modifying existing functionality:
1. Update the relevant Gherkin scenarios
2. Add new test cases to cover the scenarios
3. Ensure all scenarios are covered by unit tests
4. Run the test suite to validate changes

### Adding New Features
When implementing new features:
1. Create new Gherkin scenarios for the feature
2. Implement unit tests for the scenarios
3. Update existing scenarios if needed
4. Ensure backward compatibility

### Test Coverage
Regularly review test coverage to ensure:
- All Gherkin scenarios are covered by tests
- All public interfaces have corresponding tests
- All user interactions are tested
- All edge cases are covered
- All error conditions are handled

## Best Practices

### Writing Scenarios
- Use clear, descriptive language
- Focus on behavior, not implementation
- Include both positive and negative scenarios
- Cover edge cases and error conditions
- Make scenarios independent and testable

### Maintaining Tests
- Keep tests up to date with code changes
- Refactor tests when refactoring code
- Remove obsolete tests
- Add tests for new functionality
- Ensure tests are fast and reliable

### Documentation
- Keep Gherkin files as living documentation
- Update scenarios when requirements change
- Use scenarios for communication between teams
- Reference scenarios in code comments
- Include scenarios in project documentation
