Feature: Optional Probability for Trading Sessions
  As a trader
  I want to optionally specify probability levels for my trading sessions
  So that I can better organize and prioritize my trading activities

  Background:
    Given the application is running
    And I have access to the trading session management interface
    And the optional probability feature is enabled

  Scenario: MacroSession Interface Supports Optional Probability
    Given I have a MacroSession interface
    When I create a new macro session
    Then the probability field should be optional
    And I should be able to set probability to "High"
    And I should be able to set probability to "Low"
    And I should be able to leave probability undefined
    And the interface should accept all valid probability values

  Scenario: MarketSession Interface Supports Optional Probability
    Given I have a MarketSession interface
    When I create a new market session
    Then the probability field should be optional
    And I should be able to set probability to "High"
    And I should be able to set probability to "Low"
    And I should be able to leave probability undefined
    And the interface should accept all valid probability values

  Scenario: TimeBlock Interface Supports Optional Probability
    Given I have a TimeBlock interface
    When I create a new time block
    Then the probability field should be optional
    And I should be able to set probability to "High"
    And I should be able to set probability to "Low"
    And I should be able to leave probability undefined
    And the interface should accept all valid probability values

  Scenario: MacroSettings Component Handles Optional Probability
    Given I am on the MacroSettings page
    When I add a new macro event
    Then I should see a probability selector labeled "Probability (Optional)"
    And the selector should have options: "Not specified", "High", "Low"
    And the default value should be "Not specified"
    When I select "High" probability
    Then the macro should be saved with probability "High"
    When I select "Low" probability
    Then the macro should be saved with probability "Low"
    When I select "Not specified"
    Then the macro should be saved with undefined probability
    And the form should reset probability to "Not specified" after adding

  Scenario: MacroSettings Component Displays Existing Macros with Optional Probability
    Given I have existing macros with different probability levels
    When I view the MacroSettings page
    Then I should see all existing macros
    And macros with "High" probability should show "High" in the selector
    And macros with "Low" probability should show "Low" in the selector
    And macros with undefined probability should show "Not specified" in the selector
    When I edit a macro's probability
    Then the change should be saved correctly
    And the summary statistics should update accordingly

  Scenario: MacroSettings Component Shows Summary Statistics
    Given I have multiple macros with different probability levels
    When I view the MacroSettings page
    Then I should see a summary section
    And it should display the total number of macros
    And it should show count of "High" probability macros
    And it should show count of "Low" probability macros
    And it should show count of "Unspecified" probability macros
    And the counts should be accurate

  Scenario: MarketSessionsSettings Component Handles Optional Probability
    Given I am on the MarketSessionsSettings page
    When I add a new market session
    Then I should see a probability selector labeled "Probability (Optional)"
    And the selector should have options: "Not specified", "High", "Low"
    And the default value should be "Not specified"
    When I select "High" probability
    Then the session should be saved with probability "High"
    When I select "Low" probability
    Then the session should be saved with probability "Low"
    When I select "Not specified"
    Then the session should be saved with undefined probability
    And the form should reset probability to "Not specified" after adding

  Scenario: MarketSessionsSettings Component Displays Existing Sessions with Optional Probability
    Given I have existing market sessions with different probability levels
    When I view the MarketSessionsSettings page
    Then I should see all existing sessions
    And sessions with "High" probability should show "High" in the selector
    And sessions with "Low" probability should show "Low" in the selector
    And sessions with undefined probability should show "Not specified" in the selector
    When I edit a session's probability
    Then the change should be saved correctly
    And the summary statistics should update accordingly

  Scenario: MarketSessionsSettings Component Shows Summary Statistics
    Given I have multiple market sessions with different probability levels
    When I view the MarketSessionsSettings page
    Then I should see a summary section
    And it should display the total number of sessions
    And it should show count of "High" probability sessions
    And it should show count of "Low" probability sessions
    And it should show count of "Unspecified" probability sessions
    And it should show count of active sessions
    And the counts should be accurate

  Scenario: Timeline Component Displays Optional Probability in Tooltips
    Given I have trading sessions with different probability levels
    When I view the timeline
    Then I should see tooltips for each time block
    And blocks with "High" probability should show "High Probability" in green
    And blocks with "Low" probability should show "Low Probability" in orange
    And blocks with undefined probability should not show probability information
    And the probability display should be conditional based on the block's probability value

  Scenario: Default Trading Parameters Include Optional Probability Examples
    Given the application loads with default trading parameters
    When I view the default macros
    Then some macros should have "High" probability
    And some macros should have "Low" probability
    And some macros should have undefined probability
    When I view the default market sessions
    Then some sessions should have "High" probability
    And some sessions should have "Low" probability
    And some sessions should have undefined probability
    And the examples should demonstrate the optional nature of probability

  Scenario: Form State Types Support Optional Probability
    Given I am using the MacroFormState interface
    When I create a new macro form
    Then the probability field should be optional
    And I should be able to set it to "High"
    And I should be able to set it to "Low"
    And I should be able to leave it undefined
    And the form should handle all these states correctly

  Scenario: Select Components Use Proper Values for Optional Probability
    Given I am using a probability selector
    When I view the selector options
    Then "Not specified" should have value "none"
    And "High" should have value "High"
    And "Low" should have value "Low"
    When I select "none"
    Then the component should store undefined in the state
    When I select "High" or "Low"
    Then the component should store the selected value in the state
    And the selector should not use empty string values

  Scenario: Component Tests Cover Optional Probability Functionality
    Given I have unit tests for the components
    When I run the tests
    Then the MacroSettings tests should cover optional probability selection
    And the MarketSessionsSettings tests should cover optional probability selection
    And the tests should verify "none" value handling
    And the tests should verify undefined probability handling
    And the tests should verify proper state management
    And all tests should pass

  Scenario: Model Tests Cover Optional Probability
    Given I have unit tests for the model interfaces
    When I run the tests
    Then the MacroSession tests should cover optional probability
    And the MarketSession tests should cover optional probability
    And the TimeBlock tests should cover optional probability
    And the tests should verify undefined probability is allowed
    And the tests should verify valid probability values are accepted
    And all tests should pass

  Scenario: TradingParameters Interface Supports Optional Probability
    Given I have a TradingParameters interface
    When I create trading parameters
    Then the macros array should support optional probability
    And the marketSessions array should support optional probability
    And I should be able to mix sessions with and without probability
    And the interface should handle all combinations correctly

  Scenario: TradingStatus Type is Properly Defined
    Given I have a TradingStatus type
    When I use the TradingStatus type
    Then it should accept "green" values
    And it should accept "amber" values
    And it should accept "red" values
    And it should not accept other values
    And the type should be properly exported

  Scenario: TimeRange Interface is Properly Defined
    Given I have a TimeRange interface
    When I create a TimeRange object
    Then it should have a hours property of type number
    And it should have a minutes property of type number
    And the hours should be between 0 and 23
    And the minutes should be between 0 and 59
    And the interface should be properly exported

  Scenario: KillzoneSession Interface is Properly Defined
    Given I have a KillzoneSession interface
    When I create a KillzoneSession object
    Then it should have an id property of type string
    And it should have a name property of type string
    And it should have a start property of type TimeRange
    And it should have an end property of type TimeRange
    And it should have a region property with valid values
    And the interface should be properly exported

  Scenario: NewsTemplate Interface is Properly Defined
    Given I have a NewsTemplate interface
    When I create a NewsTemplate object
    Then it should have an id property of type string
    And it should have a name property of type string
    And it should have a description property of type string
    And it should have a impact property with valid values
    And it should have a currency property of type string
    And the interface should be properly exported

  Scenario: NewsInstance Interface is Properly Defined
    Given I have a NewsInstance interface
    When I create a NewsInstance object
    Then it should have an id property of type string
    And it should have a templateId property of type string
    And it should have a scheduledTime property of type Date
    And it should have a isActive property of type boolean
    And it should have a description property of type string
    And the interface should be properly exported

  Scenario: Models Index File Exports All Interfaces
    Given I have a models index file
    When I import from the models index
    Then I should be able to import TimeRange
    And I should be able to import TimeBlock
    And I should be able to import MacroSession
    And I should be able to import KillzoneSession
    And I should be able to import MarketSession
    And I should be able to import TradingParameters
    And I should be able to import TradingStatus
    And I should be able to import NewsTemplate
    And I should be able to import NewsInstance
    And all imports should be properly typed

  Scenario: Legacy Compatibility is Maintained
    Given I have legacy code that uses the old interface structure
    When I run the application
    Then the legacy code should continue to work
    And the LegacyTimeBlock interface should be available
    And the LegacyTradingParameters interface should be available
    And backward compatibility should be maintained
    And no breaking changes should occur

  Scenario: Integration with Trading Logic
    Given I have trading logic that uses the interfaces
    When I run the trading logic
    Then it should work with macros that have optional probability
    And it should work with market sessions that have optional probability
    And it should handle undefined probability values correctly
    And it should generate time blocks with optional probability
    And the integration should be seamless

  Scenario: User Experience with Optional Probability
    Given I am a user of the application
    When I add a new trading session
    Then I should see that probability is optional
    And I should be able to skip setting probability if I want
    And I should be able to set probability if I want
    And the interface should be intuitive
    And the form should be easy to use
    And the summary should show me the distribution of probability levels
