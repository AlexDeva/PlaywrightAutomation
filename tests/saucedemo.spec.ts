import { expect, test } from '../fixtures/test.fixtures';
import { checkoutCustomer, sauceDemoUsers } from '../test-data/users';

test.describe('SauceDemo storefront', () => {
  test.beforeEach(async ({ sauceLoginPage }) => {
    await sauceLoginPage.open();
  });

  test('logs in with the standard demo account', async ({ sauceLoginPage, page }) => {
    await sauceLoginPage.login(
      sauceDemoUsers.standard.username,
      sauceDemoUsers.standard.password,
    );

    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });

  test('rejects the locked-out demo account', async ({ sauceLoginPage }) => {
    await sauceLoginPage.login(
      sauceDemoUsers.lockedOut.username,
      sauceDemoUsers.lockedOut.password,
    );

    await expect(sauceLoginPage.errorMessage).toContainText(
      'Sorry, this user has been locked out',
    );
  });

  test('rejects invalid credentials', async ({ sauceLoginPage }) => {
    await sauceLoginPage.login(
      sauceDemoUsers.invalid.username,
      sauceDemoUsers.invalid.password,
    );

    await expect(sauceLoginPage.errorMessage).toContainText(
      'Username and password do not match',
    );
  });

  test('requires a username', async ({ sauceLoginPage }) => {
    await sauceLoginPage.login('', sauceDemoUsers.standard.password);

    await expect(sauceLoginPage.errorMessage).toContainText(
      'Username is required',
    );
  });

  test('requires a password', async ({ sauceLoginPage }) => {
    await sauceLoginPage.login(sauceDemoUsers.standard.username, '');

    await expect(sauceLoginPage.errorMessage).toContainText(
      'Password is required',
    );
  });

  test('sorts inventory by name from A to Z', async ({
    sauceLoginPage,
    inventoryPage,
  }) => {
    await sauceLoginPage.login(
      sauceDemoUsers.standard.username,
      sauceDemoUsers.standard.password,
    );
    await inventoryPage.sortByNameAscending();

    await expect(inventoryPage.productNames).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
    ]);
  });

  test('adds an item to the cart and updates the badge', async ({
    sauceLoginPage,
    inventoryPage,
  }) => {
    await sauceLoginPage.login(
      sauceDemoUsers.standard.username,
      sauceDemoUsers.standard.password,
    );
    await inventoryPage.addFirstProductToCart();

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('removes an item from the cart', async ({
    sauceLoginPage,
    inventoryPage,
    cartPage,
  }) => {
    await sauceLoginPage.login(
      sauceDemoUsers.standard.username,
      sauceDemoUsers.standard.password,
    );
    await inventoryPage.addFirstProductToCart();
    await inventoryPage.openCart();
    await expect(cartPage.cartItems).toHaveCount(1);

    await cartPage.removeFirstItem();

    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('validates required checkout information', async ({
    sauceLoginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await sauceLoginPage.login(
      sauceDemoUsers.standard.username,
      sauceDemoUsers.standard.password,
    );
    await inventoryPage.addFirstProductToCart();
    await inventoryPage.openCart();
    await cartPage.startCheckout();
    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage).toContainText(
      'First Name is required',
    );
  });

  test('completes checkout with valid customer information', async ({
    sauceLoginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await sauceLoginPage.login(
      sauceDemoUsers.standard.username,
      sauceDemoUsers.standard.password,
    );
    await inventoryPage.addFirstProductToCart();
    await inventoryPage.openCart();
    await cartPage.startCheckout();
    await checkoutPage.fillCustomerInformation(
      checkoutCustomer.firstName,
      checkoutCustomer.lastName,
      checkoutCustomer.postalCode,
    );
    await checkoutPage.continueToOverview();
    await checkoutPage.finishOrder();

    await expect(checkoutPage.confirmationMessage).toBeVisible();
  });
});
