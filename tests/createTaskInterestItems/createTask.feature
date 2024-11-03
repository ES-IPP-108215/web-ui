Feature: Create Task Items

    Scenario: Click the Add Task and Open the Modal
        Given a user that is logged-in,
        When they click the "Add Task" button,
        Then a modal opens with a form to create a new task.

    Scenario: Create a Task with Specific Details
        Given a user that is logged-in, 
        And has opened the add task modal,
        When they fill out the form with the following details:
            | Field       | Value                               |
            | Title       | "Complete project presentation"     |
            | Description | "Prepare slides and practice demo"  |
        And they click the "Add Task" button inside the modal,
        Then a new task is created with the provided details.

    Scenario: Validate Required Fields
        Given a user that is logged-in,
        And has opened the add task modal,
        When they attempt to submit the form without filling in the title,
        Then an error message is displayed indicating that the title is required,
        And the form is not submitted.