import { expect, test } from '../fixtures/test.fixtures';

test.describe('UI Testing Playground', () => {
  test('finds and clicks the changing-ID button by its accessible name', async ({
    playgroundPage,
  }) => {
    await playgroundPage.open('dynamicid');
    const button = playgroundPage.button('Button with Dynamic ID');
    await expect(button).toBeVisible();

    await button.click();

    await expect(button).toBeVisible();
  });

  test('clicks the class-attribute button and handles its alert', async ({
    playgroundPage,
    page,
  }) => {
    await playgroundPage.open('classattr');
    let dialogMessage = '';
    page.once('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    await page.locator('button.btn-primary').click();

    expect(dialogMessage).toBe('Primary button pressed');
  });

  test('interacts with the visible top layer in the hidden-layers example', async ({
    playgroundPage,
    page,
  }) => {
    await playgroundPage.open('hiddenlayers');
    const buttons = playgroundPage.button('Button');

    await buttons.first().click();
    await expect(buttons).toHaveCount(2);
    await buttons.last().click();

    await expect(
      page.getByText(
        'User can not click green button in the current application state!',
      ),
    ).toHaveCount(0);
  });

  test('waits for the delayed page control without a fixed sleep', async ({
    playgroundPage,
  }) => {
    await playgroundPage.open('loaddelay');
    const button = playgroundPage.button('Button Appearing After Delay');

    await expect(button).toBeVisible();
    await button.click();
  });

  test('waits for the AJAX response message', async ({ playgroundPage }) => {
    await playgroundPage.open('ajax');
    await playgroundPage.button('Button Triggering AJAX Request').click();

    await expect(
      playgroundPage.text('Data loaded with AJAX get request.'),
    ).toBeVisible();
  });

  test('waits for the client-side calculation result', async ({
    playgroundPage,
  }) => {
    await playgroundPage.open('clientdelay');
    await playgroundPage.button('Button Triggering Client Side Logic').click();

    await expect(
      playgroundPage.text('Data calculated on the client side.'),
    ).toBeVisible();
  });

  test('hovers over and clicks a link that is replaced on mouse over', async ({
    playgroundPage,
    page,
  }) => {
    await playgroundPage.open('mouseover');
    const link = page.getByText('Click me', { exact: true });
    await link.hover();

    const activeLink = page.getByText('Click me', { exact: true });
    await activeLink.click();
    await activeLink.click();

    await expect(
      page.getByText(/The link above clicked/).first(),
    ).toHaveText('The link above clicked 2 times.');
  });

  test('changes the text-input example button label', async ({
    playgroundPage,
    page,
  }) => {
    await playgroundPage.open('textinput');
    const input = page.getByLabel('Set New Button Name');
    const button = playgroundPage.button(
      "Button That Should Change it's Name Based on Input Value",
    );

    await input.fill('Updated Playwright Button');
    await button.click();

    await expect(
      playgroundPage.button('Updated Playwright Button'),
    ).toBeVisible();
  });

  test('verifies controls become hidden after clicking Hide', async ({
    playgroundPage,
  }) => {
    await playgroundPage.open('visibility');
    await playgroundPage.button('Hide').click();

    await expect(playgroundPage.button('Removed')).toHaveCount(0);
    await expect(playgroundPage.button('Display None')).toBeHidden();
  });

  test('logs in to the sample app and shows a welcome message', async ({
    playgroundPage,
    page,
  }) => {
    await playgroundPage.open('sampleapp');
    await page.getByPlaceholder('User Name').fill('PlaywrightUser');
    await page.getByPlaceholder('********').fill('pwd');
    await playgroundPage.button('Log In').click();

    await expect(
      playgroundPage.text('Welcome, PlaywrightUser!'),
    ).toBeVisible();
  });
});
