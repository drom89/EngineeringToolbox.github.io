
from playwright.sync_api import sync_playwright, expect

def verify_simulator(page):
    # Navigate to the simulator
    page.goto("http://localhost:8080/simulator.html")

    # Step 1: Cylinder
    page.fill("#force", "500")
    page.fill("#stroke", "100")
    page.fill("#speed", "200")
    page.fill("#pressure", "6")
    page.click("#btn-calc-step1")

    # Wait for result of Step 1 and scroll
    page.wait_for_selector("#result-step1:not(.hidden)")

    # Verify Step 1 outputs (e.g. Min Diameter)
    # 500N / 6bar -> Area ~8.33e-4 m2 -> 833 mm2 -> D = sqrt(4*833/pi) = 32.5mm -> Selected 40mm
    expect(page.locator("#res-sel-dia")).to_have_text("40")

    # Step 2: Tubing
    page.fill("#tubing-len", "10")
    page.select_option("#tubing-id", "5") # 8mm (ID 5mm)
    page.click("#btn-calc-step2")

    # Wait for result of Step 2
    page.wait_for_selector("#result-step2:not(.hidden)")

    # Verify warning if we choose small tube
    page.select_option("#tubing-id", "2.5") # 4mm (ID 2.5mm)
    page.click("#btn-calc-step2")
    expect(page.locator("#tubing-warning")).not_to_have_class("hidden")

    # Proceed to Step 3
    page.click("#btn-goto-step3")

    # Step 3: Valve
    page.wait_for_selector("#step3:not(.hidden)")
    page.select_option("#valve-func", "5/2 Bistabilní")
    page.click("#btn-calc-step3")

    # Wait for result of Step 3
    page.wait_for_selector("#result-step3:not(.hidden)")
    expect(page.locator("#res-valve-series")).to_contain_text("SY")

    # Take screenshot
    page.screenshot(path="verification/simulator_verification.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify_simulator(page)
            print("Verification script finished successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
        finally:
            browser.close()
