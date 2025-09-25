Feature: Timezone Conversion and Display
  As a user
  I want to see all event times displayed in my local timezone
  So that I can easily understand when events will occur in my time

  Background:
    Given the application has timezone conversion functionality
    And the user has configured their timezone
    And all trading events are stored in UTC time
    And the convertUTCToUserTimezone function is available

  Scenario: Convert UTC time to user timezone
    Given I have a UTC time of 8:00 AM
    And my timezone is set to "Asia/Beirut" (UTC+3)
    When I convert the UTC time to my timezone
    Then the converted time should be 11:00 AM
    And the conversion should use Intl.DateTimeFormat
    And the conversion should be accurate and reliable

  Scenario: Convert UTC time to different timezones
    Given I have a UTC time of 12:00 PM
    When I convert to "America/New_York" timezone
    Then the converted time should be 7:00 AM (EST) or 8:00 AM (EDT)
    When I convert to "Europe/London" timezone
    Then the converted time should be 12:00 PM (GMT) or 1:00 PM (BST)
    When I convert to "Asia/Tokyo" timezone
    Then the converted time should be 9:00 PM
    And all conversions should be accurate

  Scenario: Handle edge cases in timezone conversion
    Given I have a UTC time of 11:30 PM
    And my timezone is "Asia/Beirut" (UTC+3)
    When I convert the UTC time
    Then the converted time should be 2:30 AM (next day)
    And the date should be handled correctly
    Given I have a UTC time of 1:00 AM
    And my timezone is "America/Los_Angeles" (UTC-8)
    When I convert the UTC time
    Then the converted time should be 5:00 PM (previous day)
    And the date rollover should be handled correctly

  Scenario: Handle invalid timezone gracefully
    Given I have a UTC time of 10:00 AM
    And an invalid timezone is provided
    When I attempt to convert the time
    Then the function should return the original UTC time
    And an error should be logged
    And the application should not crash

  Scenario: Display event times in user timezone in NextEventsPanel
    Given I have upcoming events with UTC times
    And my timezone is configured
    When the NextEventsPanel displays the events
    Then all event times should be converted to my timezone
    And the times should be formatted correctly
    And the conversion should be consistent across all events
    And the display should show the correct local time

  Scenario: Display event times in user timezone in TradeTimeTracker
    Given I have upcoming events with UTC times
    And my timezone is configured
    When the TradeTimeTracker displays the events
    Then all event times should be converted to my timezone
    And the convertUTCToUserTimezone function should be called
    And the times should be formatted as HH:MM
    And the display should show the correct local time
    And the conversion should work for all event types

  Scenario: Verify timezone conversion in unit tests
    Given I have timezone conversion unit tests
    When I run the timezone conversion tests
    Then the tests should verify basic conversion functionality
    And the tests should verify edge cases
    And the tests should verify error handling
    And the tests should verify different timezone scenarios
    And the tests should verify Intl.DateTimeFormat usage
    And all timezone conversion tests should pass

  Scenario: Verify component timezone display in unit tests
    Given I have component timezone display tests
    When I run the component timezone tests
    Then the tests should verify NextEventsPanel timezone display
    And the tests should verify TradeTimeTracker timezone display
    And the tests should verify proper function calls
    And the tests should verify correct time formatting
    And the tests should verify mock timezone conversion
    And all component timezone tests should pass

  Scenario: Comprehensive timezone test coverage
    Given I have comprehensive timezone testing
    When I run all timezone-related tests
    Then I should have tests for timezone conversion utilities
    And I should have tests for component timezone display
    And I should have tests for edge cases and error conditions
    And I should have tests for different timezone scenarios
    And I should have tests for mock functionality
    And all timezone tests should pass successfully
    And the test coverage should be comprehensive

  Scenario: Timezone conversion performance
    Given I have timezone conversion functionality
    When I perform multiple timezone conversions
    Then the conversions should be fast and efficient
    And the conversions should not cause performance issues
    And the Intl.DateTimeFormat should be used efficiently
    And the conversion should be cached when appropriate

  Scenario: Timezone conversion reliability
    Given I have timezone conversion functionality
    When I use the conversion in different scenarios
    Then the conversion should be reliable and consistent
    And the conversion should handle DST transitions correctly
    And the conversion should handle timezone changes gracefully
    And the conversion should provide accurate results
    And the conversion should work across different browsers
