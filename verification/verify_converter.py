
from playwright.sync_api import sync_playwright

def run():
    url = 'http://localhost:8081/converter.html'

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
            page.wait_for_selector('#convForm', timeout=5000)
        except:
             print("Form not found. Dumping content:")
             print(page.content())
             return

        # Perform a conversion
        page.fill('#value', '10')
        page.click('button[type="submit"]')

        # Verify history container is visible and has content
        try:
            page.wait_for_selector('#history-container', state='visible', timeout=2000)
            # Wait for at least one list item since class is not used in HistoryManager
            page.wait_for_selector('#history-container ul li', timeout=2000)
        except Exception as e:
            print(f"History verification failed: {e}")
            page.screenshot(path='verification/converter_error.png')
            return

        # Take screenshot
        page.screenshot(path='verification/converter_history.png')
        print('Screenshot saved to verification/converter_history.png')

        browser.close()

if __name__ == '__main__':
    run()
