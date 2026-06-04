import { expect, test } from '@playwright/test'

test('user can see the trip dashboard after sign in', async ({ page }) => {
  await page.goto('/#/signin')
  await page.getByRole('button', { name: '登入' }).click()
  await expect(page.getByRole('heading', { name: '我的旅程' })).toBeVisible()
  await expect(page.getByText('京都三日慢遊')).toBeVisible()
})
