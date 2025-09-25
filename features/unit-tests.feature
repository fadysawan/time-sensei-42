Feature: Unit Tests for Trading Session Management
  As a developer
  I want comprehensive unit tests for all trading session functionality
  So that I can ensure the application works correctly and catch regressions

  Background:
    Given the testing framework is set up
    And all test files are properly structured
    And the optional probability feature is implemented

  Scenario: MacroSession Model Tests
    Given I have MacroSession model tests
    When I run the MacroSession tests
    Then the tests should verify the interface structure
    And the tests should verify required properties (id, name, start, end, region)
    And the tests should verify optional properties (description, probability)
    And the tests should verify valid region values (Tokyo, London, New York)
    And the tests should verify valid probability values (High, Low, undefined)
    And the tests should verify TimeRange structure for start and end
    And the tests should verify the interface is properly exported
    And all MacroSession tests should pass

  Scenario: MarketSession Model Tests
    Given I have MarketSession model tests
    When I run the MarketSession tests
    Then the tests should verify the interface structure
    And the tests should verify required properties (id, name, start, end, type, isActive)
    And the tests should verify optional properties (description, probability)
    And the tests should verify valid type values (premarket, market-open, lunch, after-hours, custom)
    And the tests should verify valid probability values (High, Low, undefined)
    And the tests should verify boolean isActive property
    And the tests should verify TimeRange structure for start and end
    And the tests should verify the interface is properly exported
    And all MarketSession tests should pass

  Scenario: TimeBlock Model Tests
    Given I have TimeBlock model tests
    When I run the TimeBlock tests
    Then the tests should verify the interface structure
    And the tests should verify required properties (type, name, startHour, startMinute, endHour, endMinute)
    And the tests should verify optional properties (description, probability)
    And the tests should verify valid type values (macro, killzone, premarket, market-open, lunch, after-hours, custom, news, inactive)
    And the tests should verify valid probability values (High, Low, undefined)
    And the tests should verify time properties are numbers
    And the tests should verify the interface is properly exported
    And all TimeBlock tests should pass

  Scenario: TimeRange Model Tests
    Given I have TimeRange model tests
    When I run the TimeRange tests
    Then the tests should verify the interface structure
    And the tests should verify required properties (hours, minutes)
    And the tests should verify hours is a number between 0 and 23
    And the tests should verify minutes is a number between 0 and 59
    And the tests should verify the interface is properly exported
    And all TimeRange tests should pass

  Scenario: TradingParameters Model Tests
    Given I have TradingParameters model tests
    When I run the TradingParameters tests
    Then the tests should verify the interface structure
    And the tests should verify required properties (macros, killzones, marketSessions, newsTemplates, newsInstances, userTimezone)
    And the tests should verify macros is an array of MacroSession
    And the tests should verify killzones is an array of KillzoneSession
    And the tests should verify marketSessions is an array of MarketSession
    And the tests should verify newsTemplates is an array of NewsTemplate
    And the tests should verify newsInstances is an array of NewsInstance
    And the tests should verify userTimezone is a string
    And the tests should verify the interface is properly exported
    And all TradingParameters tests should pass

  Scenario: TradingStatus Model Tests
    Given I have TradingStatus model tests
    When I run the TradingStatus tests
    Then the tests should verify the type definition
    And the tests should verify valid values (green, amber, red)
    And the tests should verify invalid values are rejected
    And the tests should verify the type is properly exported
    And all TradingStatus tests should pass

  Scenario: KillzoneSession Model Tests
    Given I have KillzoneSession model tests
    When I run the KillzoneSession tests
    Then the tests should verify the interface structure
    And the tests should verify required properties (id, name, start, end, region)
    And the tests should verify valid region values (Tokyo, London, New York)
    And the tests should verify TimeRange structure for start and end
    And the tests should verify the interface is properly exported
    And all KillzoneSession tests should pass

  Scenario: NewsTemplate Model Tests
    Given I have NewsTemplate model tests
    When I run the NewsTemplate tests
    Then the tests should verify the interface structure
    And the tests should verify required properties (id, name, description, impact, currency)
    And the tests should verify valid impact values (High, Medium, Low)
    And the tests should verify currency is a string
    And the tests should verify the interface is properly exported
    And all NewsTemplate tests should pass

  Scenario: NewsInstance Model Tests
    Given I have NewsInstance model tests
    When I run the NewsInstance tests
    Then the tests should verify the interface structure
    And the tests should verify required properties (id, templateId, scheduledTime, isActive, description)
    And the tests should verify scheduledTime is a Date
    And the tests should verify isActive is a boolean
    And the tests should verify the interface is properly exported
    And all NewsInstance tests should pass

  Scenario: MacroSettings Component Tests
    Given I have MacroSettings component tests
    When I run the MacroSettings tests
    Then the tests should verify component rendering
    And the tests should verify form state management
    And the tests should verify adding new macros
    And the tests should verify editing existing macros
    And the tests should verify deleting macros
    And the tests should verify probability selection (High, Low, undefined)
    And the tests should verify description input
    And the tests should verify form validation
    And the tests should verify collapsible functionality
    And the tests should verify summary statistics
    And the tests should verify optional probability handling
    And all MacroSettings tests should pass

  Scenario: MarketSessionsSettings Component Tests
    Given I have MarketSessionsSettings component tests
    When I run the MarketSessionsSettings tests
    Then the tests should verify component rendering
    And the tests should verify form state management
    And the tests should verify adding new sessions
    And the tests should verify editing existing sessions
    And the tests should verify deleting sessions
    And the tests should verify probability selection (High, Low, undefined)
    And the tests should verify description input
    And the tests should verify session type selection
    And the tests should verify active/inactive toggle
    And the tests should verify time picker functionality
    And the tests should verify form validation
    And the tests should verify collapsible functionality
    And the tests should verify summary statistics
    And the tests should verify optional probability handling
    And all MarketSessionsSettings tests should pass

  Scenario: Models Index File Tests
    Given I have models index file tests
    When I run the models index tests
    Then the tests should verify all interfaces are exported
    And the tests should verify proper type exports
    And the tests should verify backward compatibility
    And the tests should verify legacy interfaces are available
    And all models index tests should pass

  Scenario: Test File Structure Validation
    Given I have test files in the project
    When I analyze the test file structure
    Then I should find Jest-style test files with describe/it/expect
    And I should find console-based test files for utilities
    And all test files should be properly located
    And all test files should have proper naming conventions
    And the test structure should be consistent

  Scenario: Test Coverage Validation
    Given I have unit tests for all components and models
    When I run the test coverage analysis
    Then the tests should cover all public interfaces
    And the tests should cover all public methods
    And the tests should cover all edge cases
    And the tests should cover error conditions
    And the tests should cover optional probability functionality
    And the test coverage should be comprehensive

  Scenario: Test Execution and Results
    Given I have all unit tests implemented
    When I run the test suite
    Then all tests should execute successfully
    And all tests should pass
    And no tests should be skipped
    And the test results should be clearly reported
    And the test execution should be fast and reliable

  Scenario: Test Maintenance and Updates
    Given I have unit tests for the application
    When I make changes to the codebase
    Then the tests should be updated accordingly
    And the tests should continue to pass
    And new functionality should have corresponding tests
    And broken tests should be fixed promptly
    And the test suite should remain comprehensive

  Scenario: Integration with Build Process
    Given I have unit tests in the project
    When I run the build process
    Then the tests should be executed as part of the build
    And the build should fail if tests fail
    And the build should pass if all tests pass
    And the test results should be included in build reports
    And the build process should be reliable

  Scenario: Timezone Conversion Tests
    Given I have timezone conversion functionality
    When I run the timezone conversion tests
    Then the tests should verify UTC to user timezone conversion
    And the tests should verify conversion accuracy for different timezones
    And the tests should verify edge cases (midnight, DST transitions)
    And the tests should verify error handling for invalid timezones
    And the tests should verify Intl.DateTimeFormat usage
    And the tests should verify formatToParts functionality
    And the tests should verify fallback behavior
    And all timezone conversion tests should pass

  Scenario: NextEventsPanel Timezone Display Tests
    Given I have NextEventsPanel component tests
    When I run the NextEventsPanel timezone tests
    Then the tests should verify event times are displayed in user timezone
    And the tests should verify UTC to user timezone conversion in display
    And the tests should verify timezone consistency across different events
    And the tests should verify proper time formatting
    And the tests should verify timezone conversion for different user timezones
    And all NextEventsPanel timezone tests should pass

  Scenario: TradeTimeTracker Timezone Display Tests
    Given I have TradeTimeTracker component tests
    When I run the TradeTimeTracker timezone tests
    Then the tests should verify upcoming events display in user timezone
    And the tests should verify convertUTCToUserTimezone is called correctly
    And the tests should verify event times are converted from UTC to user timezone
    And the tests should verify proper time formatting in the UI
    And the tests should verify timezone conversion for different user timezones
    And the tests should verify mock timezone conversion functionality
    And all TradeTimeTracker timezone tests should pass

  Scenario: Comprehensive Timezone Testing
    Given I have comprehensive timezone test coverage
    When I run all timezone-related tests
    Then the tests should cover timezone conversion utilities
    And the tests should cover component timezone display
    And the tests should cover edge cases and error conditions
    And the tests should cover different timezone scenarios
    And the tests should verify consistent timezone handling
    And all timezone tests should pass successfully

  Scenario: Test Documentation and Readability
    Given I have unit tests for the application
    When I review the test code
    Then the tests should be well-documented
    And the test names should be descriptive
    And the test structure should be clear
    And the tests should be easy to understand
    And the tests should serve as documentation for the code
