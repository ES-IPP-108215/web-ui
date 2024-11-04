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

@given(u'a task has been created,')
def a_task_has_been_created(context):
    add_task_button = context.driver.find_element(By.XPATH, "//*[@id=\"root\"]/div[2]/main/div/div/div[1]/button")
    assert add_task_button.text == "Add Task"
    add_task_button.click()

    wait = WebDriverWait(context.driver, 10)
    wait.until(EC.presence_of_element_located((By.XPATH, "//*[@id=\"radix-:r7:\"]")))

    add_task_modal = context.driver.find_element(By.XPATH, "//*[@id=\"radix-:r7:\"]")
    assert add_task_modal is not None

    WebDriverWait(context.driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//*[@id=\"radix-:r7:\"]/form"))
    )

    context.driver.find_element(By.NAME, "title").send_keys("Complete project presentation")
    context.driver.find_element(By.NAME, "description").send_keys("Prepare the slides and rehearse the presentation")

    # Optionally, you can add a small delay to ensure all fields are filled
    context.driver.implicitly_wait(2)

    add_task_button = context.driver.find_element(By.XPATH, "//*[@id=\"radix-:r7:\"]/form/button")
    assert add_task_button.text == "Add Task"
    add_task_button.click()

    WebDriverWait(context.driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//*[@id=\"root\"]/div[2]/main/div/div/div[3]/div[1]/div[2]/div[1]/div/div[1]/h3"))
    )

    task_title = context.driver.find_element(By.XPATH, "//*[@id=\"root\"]/div[2]/main/div/div/div[3]/div[1]/div[2]/div[1]/div/div[1]/h3")
    assert task_title.text == "Complete project presentation"


@when(u'they click the trash button,')
def they_click_the_trash_button(context):
    trash_button = context.driver.find_element(By.XPATH, "//*[@id=\"root\"]/div[2]/main/div/div/div[3]/div[1]/div[2]/div[1]/div/div[3]/div[2]/button[3]")
    trash_button.click()

    context.driver.implicitly_wait(2)

@then(u'a confirmation modal opens asking if they are sure they want to delete the task.')
def a_confirmation_modal_opens_asking_if_they_are_sure_they_want_to_delete_the_task(context):

    WebDriverWait(context.driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//body/div[3]/div[2]"))
    )

    delete_task_modal = context.driver.find_element(By.XPATH, "//body/div[3]/div[2]")
    assert delete_task_modal is not None

@then(u'they click the "Delete" button in the modal,')
def they_click_the_delete_button_in_the_modal(context):
    delete_button = context.driver.find_element(By.XPATH, "//body/div[3]/div[2]/button[2]")
    delete_button.click()

    context.driver.implicitly_wait(2)

@then(u'the task is removed from the list of tasks.')
def the_task_is_removed_from_the_list_of_tasks(context):
    context.driver.quit()