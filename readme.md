# Playwright TypeScript UI Automation Framework

## Purpose

Build a lightweight, maintainable Web UI automation framework using Playwright and TypeScript. The framework's sample UI tests cover two public demo applications.

## Application under test

The selected applications are:

- [SauceDemo](https://www.saucedemo.com/) — storefront login, inventory, cart, sorting, and checkout flows. Its publicly documented demo account is used only for these sample tests; it is not a production credential.
- [UI Testing Playground](http://uitestingplayground.com/) — focused pages for common UI automation interactions and synchronization scenarios. The supplied HTTP URL was reachable when this plan was prepared.

Allow overrides through `SAUCEDEMO_BASE_URL` and `UI_PLAYGROUND_BASE_URL`; default to the selected demo URLs. Tests should use relative navigation paths and should not silently fall back to an unrelated site. Public demo availability and behavior can change; tests should report service outages rather than masking them with retries or mocks.

## Framework requirements

### Technology and structure

- Playwright Test with TypeScript.
- Page Object Model with page classes inheriting from `BasePage`.
- Custom fixtures in `fixtures/test.fixtures.ts` to instantiate page objects.
- Keep configuration, fixtures, pages, tests, utilities, and test data separate.
- Include a GitHub Actions workflow at `.github/workflows/playwright.yml`.

Expected structure:

```text
.
├── .github/
│   └── workflows/
│       └── playwright.yml
├── config/
│   └── env.config.ts
├── fixtures/
│   └── test.fixtures.ts
├── pages/
│   ├── base.page.ts
│   ├── saucedemo/
│   │   ├── login.page.ts
│   │   ├── inventory.page.ts
│   │   ├── cart.page.ts
│   │   └── checkout.page.ts
│   └── playground/
│       └── playground.page.ts
├── tests/
│   ├── saucedemo.spec.ts
│   ├── ui-testing-playground.spec.ts
│   └── api-mock.spec.ts
├── utils/
│   └── mocks.ts
├── test-data/
│   └── users.ts
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
└── tsconfig.json
```

Only retain page objects and fixtures that are used by the example tests; do not leave empty placeholder modules in the completed framework.

### Design and test conventions

- Prefer user-facing locators such as `getByRole`, `getByLabel`, `getByTestId`, and `getByText`. Avoid brittle CSS and XPath selectors unless the application offers no stable accessible or test identifier.
- Rely on Playwright's auto-waiting and web-first assertions. Do not use `page.waitForTimeout()`.
- Keep page objects focused on locators and user actions. Keep all test assertions in spec files.
- Avoid unnecessary fixed waits and `networkidle` waits; wait for the specific user-visible state needed by the test.
- Use typed, explicit interfaces for fixture and mock data where useful.
- Keep test data free of secrets.

## Required implementation deliverables

1. `playwright.config.ts`
   - Test discovery under `tests/` and fully parallel execution where safe.
   - Chromium and Firefox projects; include WebKit only if supported by the target application's requirements and CI environment.
   - Retries and worker settings appropriate for local and CI runs without disabling CI parallelism unnecessarily.
   - Configure project-specific base URLs from `SAUCEDEMO_BASE_URL` and `UI_PLAYGROUND_BASE_URL`, defaulting to the selected demo sites.
   - HTML and console-friendly reporting, with trace, video, and screenshot artifacts retained on failure as appropriate.

2. `fixtures/test.fixtures.ts`
   - Extend Playwright's `test` with typed fixtures for the page objects used by the example specs.
   - Export the extended `test` and Playwright's `expect`.

3. Page objects
   - Provide a shared base page and page classes for the selected applications, using stable, user-facing locators where available.
   - Keep assertions out of page objects.
   - Keep application-specific navigation, interactions, and locators within the relevant page classes.

4. `tests/saucedemo.spec.ts` and `test-data/users.ts`
   - Use the public SauceDemo test account and keep the test credentials centralized as demo-only data.
   - Cover the 10 SauceDemo scenarios listed below.

5. `tests/ui-testing-playground.spec.ts`
   - Cover the 10 UI Testing Playground scenarios listed below.

6. `utils/mocks.ts` and `tests/api-mock.spec.ts`
   - Use `page.route()` to intercept `/api/v1/user/profile` and return controlled success and error responses.
   - Ensure mocked tests do not call a real backend.
   - Use `tests/api-mock.spec.ts` as the single agreed filename for the API mocking example.

7. `.github/workflows/playwright.yml`
   - Trigger on pushes to `main` and `master`, and on pull requests.
   - Set up Node.js, install dependencies, and install the browsers required by the configured projects.
   - Run browsers in parallel using a matrix or an equivalent Playwright project strategy.
   - Upload the Playwright HTML report after the run, including on test failure.
   - Use the public demo-site defaults; allow URL overrides through workflow variables or environment variables. Do not commit non-public credentials.

8. `package.json`, `tsconfig.json`, and `config/env.config.ts`
   - Define reproducible install, test, and relevant validation commands.
   - Configure TypeScript for the project and typed TypeScript test data.
   - Centralize demo URL configuration and keep overrides explicit.

## Selected UI test cases

### SauceDemo — 10 cases

1. Log in with the standard demo account and reach the inventory page.
2. Verify the locked-out demo account cannot log in and receives an error.
3. Verify invalid credentials are rejected.
4. Verify submitting with an empty username shows the required-field error.
5. Verify submitting with an empty password shows the required-field error.
6. Sort inventory by name A–Z and verify the displayed order.
7. Add an item to the cart and verify the cart badge updates.
8. Remove an item from the cart and verify it is no longer present.
9. Start checkout and verify required customer information is validated.
10. Complete checkout with valid demo information and verify the confirmation.

### UI Testing Playground — 10 cases

1. Click the changing-ID button by its stable accessible name and verify its result.
2. Click the class-attribute example button and verify its JavaScript alert.
3. Interact with the hidden-layers example and verify the top-layer behavior.
4. Open the load-delay page and verify its delayed control becomes usable without a fixed wait.
5. Trigger the AJAX request and verify its returned message.
6. Trigger client-side delayed logic and verify the calculated result.
7. Hover over the mouse-over target and verify the interaction counter changes.
8. Enter text and verify the text-input example changes the button label.
9. Hide an element and verify it is no longer visible.
10. Log in to the sample app and verify its welcome state.

These scenarios are intentionally scoped to public demo behavior. Keep each test isolated, use Playwright auto-waiting, and avoid fixed sleeps. If a demo's UI changes, update the relevant page object and test expectation rather than weakening assertions.

## Implementation plan

1. **Establish project configuration:** populate the package manifest, TypeScript configuration, and environment configuration; configure the two demo origins and their overrides.
2. **Complete the framework foundation:** finalize Playwright browser projects and reporters, implement the shared base page and application page objects, and ensure every fixture points to a real page object.
3. **Add the 20 UI scenarios:** implement the 10 SauceDemo cases and 10 UI Testing Playground cases listed above, with shared test data and no fixed waits.
4. **Add API mocks:** implement isolated success and error tests using `page.route()` without contacting a real API.
5. **Add CI:** install dependencies and browsers, run configured projects in parallel, and publish the HTML report even when tests fail.
6. **Validate:** run TypeScript checks and targeted Playwright tests; verify that each demo suite uses its correct base URL and that mock tests do not depend on a live backend.

## Acceptance criteria

- A clean dependency install and TypeScript check succeed.
- Tests use the configured SauceDemo or UI Testing Playground base URL and do not silently target a placeholder site.
- Fixtures, page objects, and all referenced modules exist and are non-empty.
- Page objects contain no test assertions; specs use web-first assertions.
- No fixed sleeps are used.
- All 20 listed UI test cases are implemented for the selected applications.
- Mock success and error cases run without contacting the real API.
- CI runs the configured browser projects in parallel and uploads the HTML report on success or failure.
- The README and workflow agree on the spec filenames, browser projects, and environment variables.
