Feature: Delete Task Items

    Scenario: Click the Delete Task Button
        Given a user that is logged-in,
        And a task has been created,
        When they click the trash button,
        Then a confirmation modal opens asking if they are sure they want to delete the task.
        And they click the "Delete" button in the modal,
        And the task is removed from the list of tasks.
