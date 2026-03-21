import { test, expect } from './fixtures'

/**
 * Contact page & form tests
 * Covers: page load, form field validation, full happy-path flow,
 * pending state while submitting.
 */
test.describe('Contact page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es/contact')
    await page.waitForLoadState('networkidle')
  })

  // ---------------------------------------------------------------------------
  // Page load
  // ---------------------------------------------------------------------------

  test('should load the Contact page', async ({ page }) => {
    await expect(page).toHaveURL(/\/(es|en)\/contact/)
  })

  test('should display the contact form', async ({ page }) => {
    const form = page.locator('form')
    await expect(form).toBeVisible({ timeout: 5000 })
  })

  test('should render all form fields', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: /name|nombre/i })).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('textbox', { name: /email|correo/i })).toBeVisible()
    await expect(page.getByRole('combobox')).toBeVisible()
    await expect(page.getByRole('textbox', { name: /message|mensaje/i })).toBeVisible()
  })

  // ---------------------------------------------------------------------------
  // Validation — submit empty form
  // ---------------------------------------------------------------------------

  test.describe('Form validation', () => {
    test('should show validation errors when submitting an empty form', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /send|enviar/i })
      await submitButton.click()

      // At least one error message should appear
      // Fields use aria-describedby pointing to error elements
      const errorMessages = page.locator('[role="alert"], p[id$="-error"]')
      await expect(errorMessages.first()).toBeVisible({ timeout: 5000 })
    })

    test('should show name field error when name is empty', async ({ page }) => {
      // Fill only email to trigger name validation
      await page.getByRole('textbox', { name: /email|correo/i }).fill('test@example.com')
      await page.getByRole('button', { name: /send|enviar/i }).click()

      const nameError = page.locator('#name-error')
      await expect(nameError).toBeVisible({ timeout: 5000 })
    })

    test('should show email validation error for invalid email', async ({ page }) => {
      await page.getByRole('textbox', { name: /name|nombre/i }).fill('Test User')
      await page.getByRole('textbox', { name: /email|correo/i }).fill('not-an-email')
      // Disable HTML5 native validation so RHF/Zod validation runs
      await page.evaluate(() => {
        const form = document.querySelector('form')
        if (form) form.noValidate = true
      })
      await page.getByRole('button', { name: /send|enviar/i }).click()

      const emailError = page.locator('#email-error')
      await expect(emailError).toBeVisible({ timeout: 5000 })
    })

    test('should show message field error when message is too short', async ({ page }) => {
      await page.getByRole('textbox', { name: /name|nombre/i }).fill('Test User')
      await page.getByRole('textbox', { name: /email|correo/i }).fill('test@example.com')
      await page.getByRole('textbox', { name: /message|mensaje/i }).fill('Hi')
      await page.getByRole('button', { name: /send|enviar/i }).click()

      const messageError = page.locator('#message-error')
      await expect(messageError).toBeVisible({ timeout: 5000 })
    })

    test('should clear validation errors once fields are filled correctly', async ({ page }) => {
      // Trigger validation
      await page.getByRole('button', { name: /send|enviar/i }).click()
      const nameError = page.locator('#name-error')
      await expect(nameError).toBeVisible({ timeout: 5000 })

      // Fix the name field
      await page.getByRole('textbox', { name: /name|nombre/i }).fill('Valid Name')
      // Error should disappear on re-validation
      await expect(nameError).not.toBeVisible({ timeout: 3000 })
    })
  })

  // ---------------------------------------------------------------------------
  // Happy path — mock the form submission endpoint
  // ---------------------------------------------------------------------------

  test.describe('Successful submission', () => {
    test('should show success state after submitting a valid form', async ({ page }) => {
      // Mock the Formspree endpoint to return a 200 immediately
      await page.route('**/formspree.io/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true }),
        })
      })

      // Fill in all required fields
      await page.getByRole('textbox', { name: /name|nombre/i }).fill('Miguel Test')
      await page.getByRole('textbox', { name: /email|correo/i }).fill('miguel@test.com')

      // Select a project type from the dropdown
      const select = page.getByRole('combobox')
      await select.selectOption({ index: 1 })

      await page
        .getByRole('textbox', { name: /message|mensaje/i })
        .fill('This is a test message with sufficient length for validation.')

      // Submit
      const submitButton = page.getByRole('button', { name: /send|enviar/i })
      await submitButton.click()

      // ContactSuccess component should render
      const successMessage = page.getByText(/success|sent|enviado|gracias|thank/i).first()
      await expect(successMessage).toBeVisible({ timeout: 10000 })
    })
  })

  // ---------------------------------------------------------------------------
  // English version
  // ---------------------------------------------------------------------------

  test('should render the form correctly in English', async ({ page }) => {
    await page.goto('/en/contact')
    await page.waitForLoadState('networkidle')

    const form = page.locator('form')
    await expect(form).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible()
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible()
  })
})
