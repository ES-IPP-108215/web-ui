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
    wait.until(EC.url_to_be("http://localhost:8080/"))

@when(u'they select the logout button,')
def they_select_the_logout_button(context):
    logout_dropdown = context.driver.find_element(By.XPATH, "//*[@id=\"radix-:r4:\"]")
    logout_dropdown.click()

    logout_button = context.driver.find_element(By.XPATH, "//*[@id=\"radix-:r5:\"]/div[7]/button")
    logout_button.click()


@then(u'the user is logged-out and the sidebar is updated to reflect the change.')
def the_user_is_logged_out_and_the_sidebar_is_updated_to_reflect_the_change(context):
    wait = WebDriverWait(context.driver, 10)
    wait.until(EC.visibility_of_element_located((By.XPATH, "//*[@id=\"root\"]/div[2]/div/div[2]/div/div[3]/ul/li/a")))
    login_button = context.driver.find_element(By.XPATH, "//*[@id=\"root\"]/div[2]/div/div[2]/div/div[3]/ul/li/a")
    assert login_button is not None

