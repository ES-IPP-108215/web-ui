Feature: User Logout Items

    Scenario: SideBar Contains Logout Button
        Given a user that is logged-in,
        When they select the logout button,
        Then the user is logged-out and the sidebar is updated to reflect the change.