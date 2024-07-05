// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('sauce-demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle(/Swag Labs/);
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce')
    await page.getByTestId('login-button').click();
    await expect(page.url()).toContain('inventory.html');
  })

  test('asserts user can add an item and checkout', async({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click()
    await page.getByTestId('shopping-cart-link').click()
    await expect(page.url()).toContain('cart.html')

    await page.getByTestId('checkout').click()
    await expect(page.url()).toContain('checkout-step-one.html')

    await page.getByTestId('firstName').fill('foo')
    await page.getByTestId('lastName').fill('bar')
    await page.getByTestId('postalCode').fill('12345')
    await page.getByTestId('continue').click()
    await expect(page.url()).toContain('checkout-step-two.html')

    await page.getByTestId('finish').click()
    await expect(page.url()).toContain('checkout-complete.html')
    await expect(page.getByTestId('complete-header')).toContainText('Thank you for your order!')
  })

  test('asserts user can add multiple items, remove some items, and checkout', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click()
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click()
    await page.getByTestId('add-to-cart-sauce-labs-bolt-t-shirt').click()
    await page.getByTestId('add-to-cart-sauce-labs-fleece-jacket').click()
    await page.getByTestId('shopping-cart-link').click()
    await expect(page.url()).toContain('cart.html')

    await page.getByTestId('remove-sauce-labs-bike-light').click()
    await page.getByTestId('checkout').click()
    await expect(page.url()).toContain('checkout-step-one.html')

    await page.getByTestId('firstName').fill('foo')
    await page.getByTestId('lastName').fill('bar')
    await page.getByTestId('postalCode').fill('12345')
    await page.getByTestId('continue').click()
    await expect(page.url()).toContain('checkout-step-two.html')

    await page.getByTestId('finish').click()
    await expect(page.url()).toContain('checkout-complete.html')
    await expect(page.getByTestId('complete-header')).toContainText('Thank you for your order!')
  })

  test('asserts user logs out successfully', async ({ page }) => {
    await expect((await page.context().cookies()).length).toBe(1)
    await page.locator('#react-burger-menu-btn').click()
    await page.getByTestId('logout-sidebar-link').click()
    await expect(page.url()).toEqual('https://www.saucedemo.com/')
    await expect((await page.context().cookies()).length).toBe(0)
  })
})