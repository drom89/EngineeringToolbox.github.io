
from playwright.sync_api import sync_playwright

def run():
    url = 'http://localhost:8081/air_consumption.html'

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print(f'Navigating to {url}')
        try:
            page.goto(url)
        except Exception as e:
            print(f"Error navigating: {e}")
            return

        # Check if loaded
        try:
            page.wait_for_selector('#airConsForm', timeout=5000)
        except:
             print("Form not found. Dumping content:")
             print(page.content())
             return

        # Fill inputs
        page.fill('#diameter', '50')
        page.fill('#stroke', '100')
        page.fill('#cycles', '10')
        page.fill('#pressure', '0.5')

        # Click submit
        page.click('button[type="submit"]')

        # Wait for result text to appear
        # The div always exists, so we wait for it to have text
        try:
            page.wait_for_function("document.getElementById('result').innerText.length > 0", timeout=5000)
        except Exception as e:
            print("Timeout waiting for result text. Check console errors.")
            page.on("console", lambda msg: print(f"Console: {msg.text}"))
            page.screenshot(path='verification/error_state.png')
            return

        # Take screenshot
        page.screenshot(path='verification/air_consumption_result.png')
        print('Screenshot saved to verification/air_consumption_result.png')

        browser.close()

if __name__ == '__main__':
    run()
