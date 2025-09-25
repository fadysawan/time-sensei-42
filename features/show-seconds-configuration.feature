Feature: Show Seconds Configuration
  As a user
  I want to control whether seconds are displayed in time counters and clocks
  So that I can customize the level of detail shown in the trading portal

  Background:
    Given the application has showSeconds configuration functionality
    And the user can toggle showSeconds in the portal settings
    And all time displays respect the showSeconds configuration
    And the application has countdown-based automatic seconds display

  Scenario: Enable showSeconds for all time displays
    Given I have showSeconds disabled in my configuration
    And I am viewing the trading portal
    When I enable showSeconds in the portal settings
    Then all clock displays should show seconds (HH:MM:SS format)
    And all countdown displays should show seconds (Xh Ym Zs format)
    And the time indicator on the timeline should show seconds
    And all timezone displays should show seconds
    And the change should take effect immediately

  Scenario: Disable showSeconds for all time displays
    Given I have showSeconds enabled in my configuration
    And I am viewing the trading portal
    When I disable showSeconds in the portal settings
    Then all clock displays should not show seconds (HH:MM format)
    And all countdown displays should not show seconds (Xh Ym format)
    And the time indicator on the timeline should not show seconds
    And all timezone displays should not show seconds
    And the change should take effect immediately

  Scenario: Automatic seconds display for urgent countdowns
    Given I have showSeconds disabled in my configuration
    And there is a countdown with less than 5 minutes remaining
    When I view the countdown display
    Then the countdown should automatically show seconds
    And the seconds should be displayed in the format (Xh Ym Zs)
    And this should happen regardless of the showSeconds setting
    And the automatic seconds should be clearly visible

  Scenario: ShowSeconds configuration persistence
    Given I have changed the showSeconds setting
    When I refresh the page or restart the application
    Then the showSeconds setting should be preserved
    And all time displays should respect the saved setting
    And the portal settings should show the correct toggle state

  Scenario: ShowSeconds affects all timezone displays
    Given I have showSeconds enabled in my configuration
    When I view the timezone displays
    Then the current time (user timezone) should show seconds
    And the UTC time should show seconds
    And the New York time should show seconds
    And the London time should show seconds
    And the Tokyo time should show seconds
    And all timezone displays should be consistent

  Scenario: ShowSeconds affects countdown components
    Given I have showSeconds enabled in my configuration
    When I view the upcoming events section
    Then the countdown timers should show seconds
    And the current status countdown should show seconds
    And the active events countdown should show seconds
    And all countdown displays should be consistent

  Scenario: ShowSeconds affects timeline time indicator
    Given I have showSeconds enabled in my configuration
    When I view the timeline component
    Then the time indicator should show seconds
    And the time indicator should update every second
    And the seconds should be clearly visible
    And the time indicator should be positioned correctly

  Scenario: ShowSeconds configuration change detection
    Given the application is running and displaying times
    When I change the showSeconds setting
    Then the TradingStatusContext should detect the change
    And the updateTime callback should be recreated
    And all time displays should update immediately
    And no manual refresh should be required

  Scenario: ShowSeconds with different countdown scenarios
    Given I have showSeconds disabled in my configuration
    When there is a countdown with more than 5 minutes remaining
    Then the countdown should not show seconds
    When the countdown reaches less than 5 minutes
    Then the countdown should automatically show seconds
    When the countdown reaches zero
    Then the display should show "Now" or similar
    And the urgency indicators should be appropriate

  Scenario: ShowSeconds edge cases
    Given I have showSeconds enabled in my configuration
    When the time is exactly midnight (00:00:00)
    Then the time should display as "00:00:00"
    When the time is exactly end of day (23:59:59)
    Then the time should display as "23:59:59"
    When the countdown is exactly 5 minutes
    Then the behavior should be consistent with the threshold
    And all edge cases should be handled gracefully

  Scenario: ShowSeconds performance and reliability
    Given the showSeconds configuration is enabled
    When the application runs for an extended period
    Then the time updates should remain accurate
    And the seconds should update smoothly
    And there should be no performance degradation
    And the configuration should remain stable
    And all time displays should stay synchronized

  Scenario: ShowSeconds unit test coverage
    Given I have unit tests for showSeconds functionality
    When I run the showSeconds unit tests
    Then the tests should verify TradingStatusContext behavior
    And the tests should verify formatTimeSmart functionality
    And the tests should verify formatCountdownDetailed functionality
    And the tests should verify component integration
    And the tests should verify configuration change detection
    And the tests should verify edge cases and error conditions
    And the tests should verify the showSeconds fix in TradingStatusContext
    And the tests should verify that shouldShowSeconds is passed to formatTimeSmart
    And the tests should verify that config.showSeconds is not directly passed to formatTimeSmart
    And all showSeconds unit tests should pass

  Scenario: ShowSeconds fix validation
    Given I have a TradingStatusContext with showSeconds configuration
    When the context formats time displays
    Then formatTimeSmart should receive the calculated shouldShowSeconds value
    And formatTimeSmart should not receive the raw config.showSeconds value
    And the time displays should show seconds when showSeconds is enabled
    And the time displays should not show seconds when showSeconds is disabled
    And the time displays should show seconds when countdown is below 5 minutes
    And the fix should be validated by unit tests
