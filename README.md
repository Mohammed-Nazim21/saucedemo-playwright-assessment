# SauceDemo Checkout Automation

One end-to-end test built with **Playwright, TypeScript, and Page Object Model (POM)**.
Test-scoped fixtures give all page objects the same isolated browser page.

**Flow:** Login → Add Sauce Labs Backpack → Cart → Checkout → Confirm order → Download PDF receipt.

## Setup and run

Prerequisites: **Node.js 24 LTS**, npm, and an internet connection.
Clone or download this repository, then open a terminal in the project folder:

```sh
npm ci
npx playwright install chromium
npm run typecheck
npm test
```

On Linux, install browser system dependencies with:

```sh
npx playwright install --with-deps chromium
```

Useful commands:

```sh
# Run with a visible browser
npm test -- --headed

# Open the HTML report after a run
npm run test:report

# Keep traces for failed tests
npm test -- --trace=retain-on-failure
```

Reports are saved in `playwright-report/`. Receipts are saved as `receipt.pdf`
inside each test's output directory under `test-results/` and attached to the report.
Run output may be replaced by later runs.

## Configuration

**No `.env` file is required.** The test uses public SauceDemo defaults from
[data/userData.json](data/userData.json).

Optionally set `BASE_URL`, `SAUCE_USERNAME`, and `SAUCE_PASSWORD` through your
shell or a local `.env` file. Existing process variables take precedence over
`.env`. Each non-empty value overrides its corresponding JSON default; missing,
empty, or whitespace-only values use the JSON fallback. Validation reports
missing setting names without printing passwords.

Product and customer data are in [data/checkout.json](data/checkout.json).

## What the test verifies

- Login, page transitions, titles, and cart badge updates.
- Backpack name and $29.99 price on the product list, cart, and checkout overview;
  one item with quantity 1 in the cart and overview.
- Subtotal, displayed tax/total formatting, and total equal to subtotal plus tax,
  compared in integer cents.
- The order completion message.
- A successful receipt download, a saved non-empty file, and the `%PDF-` signature.
  The download listener is registered before clicking the PDF button.

The scenario is in [tests/checkout.spec.ts](tests/checkout.spec.ts). Page objects
are in `pages/`, custom fixtures in `fixtures/`, and environment resolution in
`config/environment.ts`. Actions use Playwright's automatic waiting; there are
no fixed sleeps.

## Important limitations and risks

- **Limited coverage:** one successful purchase scenario for one product. Negative
  login/checkout cases, multiple products, removal/cancellation, accessibility,
  performance, and mobile behavior are not covered. Only Chromium is enabled;
  Firefox and WebKit coverage is not claimed.
- **External application:** the test depends on the public SauceDemo site and its
  assets. Outages, network delays, or changes to selectors, products, or prices
  can cause failures. The scenario has a 60-second timeout, including PDF generation.
- **Required PDF feature:** a missing or disabled `Generate PDF order` button
  fails with an explicit blocker message. An unsuccessful download also fails;
  the required step is never silently skipped.
- **PDF validation scope:** the file signature and size checks do not prove that
  the entire PDF is valid or that its receipt contents and layout are correct.

AI assisted with the implementation and documentation.
