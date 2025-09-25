Feature: Timezone Display Configuration
  As a trading portal user
  I want to configure which timezones are displayed in the header
  So that I can customize my view to show only relevant world clocks

  Background:
    Given the user is on the settings page
    And the user is on the "Portal Config" tab
    And the timezone display feature is available

  Scenario: User can access timezone display settings
    Given the user is on the settings page
    When the user clicks on the "Portal Config" tab
    And the user clicks on the "Header Clocks" tab
    Then the user should see the timezone display configuration section
    And the section should have a title "Header Clock Display"
    And the section should have a description about configuring timezone display

  Scenario: User can enable or disable header clocks
    Given the user is on the timezone display settings page
    When the user toggles the "Enable Header Clocks" switch
    Then the header clocks should be enabled or disabled accordingly
    And the setting should be saved to the user configuration
    And the change should be reflected in the header immediately

  Scenario: User can select display mode for timezone clocks
    Given the user is on the timezone display settings page
    And header clocks are enabled
    When the user selects a display mode from the dropdown
    Then the display mode should be updated
    And the available options should be:
      | Mode | Description |
      | Show on hover only | Clocks appear only when hovering over current time |
      | Show in header | Clocks are always visible in the header |
      | Show both in header and on hover | Clocks appear in both locations |
    And the setting should be saved to the user configuration

  Scenario: User can select individual timezones to display
    Given the user is on the timezone display settings page
    And header clocks are enabled
    When the user toggles individual timezone switches
    Then the selected timezones should be displayed in the header
    And the available timezones should be:
      | Timezone | Label | Icon Color |
      | UTC | UTC | Green |
      | Tokyo | Tokyo (JST) | Red |
      | London | London (GMT/BST) | Orange |
      | New York | New York (EST/EDT) | Purple |
    And the setting should be saved to the user configuration

  Scenario: Controls are disabled when header clocks are disabled
    Given the user is on the timezone display settings page
    And header clocks are disabled
    When the user tries to interact with display mode or timezone controls
    Then the display mode selector should be disabled
    And all timezone switches should be disabled
    And the user should not be able to change these settings

  Scenario: Header shows clocks in header mode
    Given the user has enabled header clocks
    And the user has selected "Show in header" display mode
    And the user has selected specific timezones to display
    When the user views the main dashboard
    Then the header should show the current time
    And the header should show the selected timezone clocks
    And each timezone should display with its respective color and icon
    And the time format should be consistent across all clocks

  Scenario: Header shows clocks on hover mode
    Given the user has enabled header clocks
    And the user has selected "Show on hover only" display mode
    And the user has selected specific timezones to display
    When the user views the main dashboard
    Then the header should show only the current time
    And when the user hovers over the current time
    Then a tooltip should appear with the selected timezone clocks
    And the tooltip should show the time and date for each timezone
    And the tooltip should have proper styling and positioning

  Scenario: Header shows clocks in both modes
    Given the user has enabled header clocks
    And the user has selected "Show both in header and on hover" display mode
    And the user has selected specific timezones to display
    When the user views the main dashboard
    Then the header should show the current time and selected timezone clocks
    And when the user hovers over the current time
    Then a tooltip should also appear with the same timezone clocks
    And both the header and tooltip should show the same information

  Scenario: Only selected timezones are displayed
    Given the user has enabled header clocks
    And the user has selected only UTC and London timezones
    When the user views the main dashboard
    Then the header should show only UTC and London clocks
    And Tokyo and New York clocks should not be displayed
    And the display should be consistent across header and hover modes

  Scenario: Timezone display respects user's showSeconds setting
    Given the user has enabled header clocks
    And the user has configured timezone display
    When the user toggles the "Show Seconds" setting in display preferences
    Then the timezone clocks should update to show or hide seconds
    And the change should be consistent across all displayed timezones
    And the format should match the user's preference

  Scenario: Timezone display updates in real-time
    Given the user has enabled header clocks
    And the user has configured timezone display
    When the time changes
    Then all displayed timezone clocks should update automatically
    And the times should remain accurate across all timezones
    And the update should be smooth without flickering

  Scenario: Timezone display configuration persists across sessions
    Given the user has configured timezone display settings
    When the user refreshes the page or returns to the application
    Then the timezone display settings should be restored
    And the header should display according to the saved configuration
    And all user preferences should be maintained

  Scenario: Default timezone display configuration
    Given a new user accesses the application
    When the user views the timezone display settings
    Then the default configuration should be:
      | Setting | Default Value |
      | Enabled | true |
      | Display Mode | hover |
      | UTC | true |
      | Tokyo | true |
      | London | true |
      | New York | true |
    And the header should display according to these defaults

  Scenario: Timezone display works with different user timezones
    Given the user has set their timezone to "Asia/Tokyo"
    And the user has enabled header clocks
    When the user views the main dashboard
    Then the current time should be displayed in Tokyo timezone
    And the world clocks should show the correct times relative to Tokyo
    And the timezone display should work correctly regardless of user's timezone

  Scenario: Timezone display handles timezone changes gracefully
    Given the user has enabled header clocks
    And the user has configured timezone display
    When the user changes their primary timezone in settings
    Then the timezone display should update to reflect the new timezone
    And the world clocks should continue to show accurate times
    And the configuration should remain intact

  Scenario: Timezone display is responsive on different screen sizes
    Given the user has enabled header clocks
    And the user has configured timezone display
    When the user views the application on different screen sizes
    Then the timezone display should be responsive
    And on large screens, all configured timezones should be visible
    And on smaller screens, the display should adapt appropriately
    And the functionality should remain consistent across screen sizes

  Scenario: Timezone display integrates with theme settings
    Given the user has enabled header clocks
    And the user has configured timezone display
    When the user changes the theme from dark to light or vice versa
    Then the timezone display should adapt to the new theme
    And the colors and styling should be consistent with the theme
    And the readability should be maintained in both themes

  Scenario: Timezone display handles edge cases
    Given the user has enabled header clocks
    And the user has configured timezone display
    When the application encounters edge cases such as:
      | Edge Case | Expected Behavior |
      | Daylight saving time changes | Times should update automatically |
      | Network connectivity issues | Display should show last known times |
      | Browser timezone changes | Display should adapt to new browser timezone |
    Then the timezone display should handle these cases gracefully
    And the user experience should not be disrupted
    And the application should recover automatically when possible
