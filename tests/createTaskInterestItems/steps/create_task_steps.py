import os

from behave import given, step, then, when
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

load_dotenv()
LOGIN_SIGN_UP_URI = os.environ.get("VITE_LOGIN_SIGN_UP")


@given(u'a user that is logged-in,')
def a_user_that_is_logged_in(context):
    context.driver = webdriver.Chrome()

    context.driver.get(LOGIN_SIGN_UP_URI)
    
    username_input = context.driver.find_element(By.ID, "signInFormUsername")
    password_input = context.driver.find_element(By.ID, "signInFormPassword")
    username_input.send_keys("usertest")
    password_input.send_keys("test1!QUit1")

    assert username_input is not None
    assert password_input is not None

    login_button = context.driver.find_element(By.NAME, "signInSubmitButton")
    login_button.click()

    wait = WebDriverWait(context.driver, 10)
    wait.until(EC.url_to_be("http://localhost:8080/tasks"))

@given(u'has opened the add task modal,')
def has_opened_the_add_task_modal(context):

    add_task_button = context.driver.find_element(By.XPATH, "//*[@id=\"root\"]/div[2]/main/div/div/div[1]/button")
    add_task_button.click()

    wait = WebDriverWait(context.driver, 10)
    wait.until(EC.presence_of_element_located((By.XPATH, "//*[@id=\"radix-:r7:\"]")))

@when(u'they click the "Add Task" button,')
def they_click_the_add_task_button(context):
    #search for the add task button
    add_task_button = context.driver.find_element(By.XPATH, "//*[@id=\"root\"]/div[2]/main/div/div/div[1]/button")
    # verifica se esta escrito add task
    assert add_task_button.text == "Add Task"
    #clica no botão
    add_task_button.click()

@then(u'a modal opens with a form to create a new task.')
def a_modal_opens_with_a_form_to_create_a_new_task(context):
    wait = WebDriverWait(context.driver, 10)
    wait.until(EC.presence_of_element_located((By.XPATH, "//*[@id=\"radix-:r7:\"]")))

    add_task_modal = context.driver.find_element(By.XPATH, "//*[@id=\"radix-:r7:\"]")
    assert add_task_modal is not None

@when('they fill out the form with the following details')
def they_fill_out_the_form_with_the_following_details(context):
    # Wait for the form to be visible
    WebDriverWait(context.driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//*[@id=\"radix-:r7:\"]/form"))
    )

    # Fill out the form fields
    for row in context.table:
        field = row['Field']
        value = row['Value'].strip('"')  # Remove quotes from the value

        if field == 'Title':
            context.driver.find_element(By.NAME, "title").send_keys(value)
        elif field == 'Description':
            context.driver.find_element(By.NAME, "description").send_keys(value)
        else:
            raise ValueError(f"Unknown field: {field}")

    # Optionally, you can add a small delay to ensure all fields are filled
    context.driver.implicitly_wait(2)

@when(u'they click the "Add Task" button inside the modal,')
def they_click_the_add_task_button_inside_the_modal(context):
    #search for the add task button
    add_task_button = context.driver.find_element(By.XPATH, "//*[@id=\"radix-:r7:\"]/form/button")
    # verifica se esta escrito add task
    assert add_task_button.text == "Add Task"
    #clica no botão
    add_task_button.click()

@then(u'a new task is created with the provided details.')
def a_new_task_is_created_with_the_provided_details(context):
    WebDriverWait(context.driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//*[@id=\"root\"]/div[2]/main/div/div/div[3]/div[1]/div[2]/div[1]/div/div[1]/h3"))
    )

    task_title = context.driver.find_element(By.XPATH, "//*[@id=\"root\"]/div[2]/main/div/div/div[3]/div[1]/div[2]/div[1]/div/div[1]/h3")
    assert task_title.text == "Complete project presentation"


@when(u'they attempt to submit the form without filling in the title,')
def they_attempt_to_submit_the_form_without_filling_in_the_title(context):

    # Wait for the form to be visible
    WebDriverWait(context.driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//*[@id=\"radix-:r7:\"]/form"))
    )

    # click on the add task button
    add_task_button = context.driver.find_element(By.XPATH, "//*[@id=\"radix-:r7:\"]/form/button")
    add_task_button.click()

@then(u'an error message is displayed indicating that the title is required,')
def an_error_message_is_displayed_indicating_that_the_title_is_required(context):
    WebDriverWait(context.driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//p[contains(.,'Title is required')]"))
    )

    title_error = context.driver.find_element(By.XPATH, "//p[contains(.,'Title is required')]")
    assert title_error is not None
    assert title_error.text == "Title is required"

@then(u'the form is not submitted.')
def the_form_is_not_submitted(context):

    WebDriverWait(context.driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//*[@id=\"radix-:r7:\"]/form"))
    )

    add_task_modal = context.driver.find_element(By.XPATH, "//*[@id=\"radix-:r7:\"]")
    assert add_task_modal is not None