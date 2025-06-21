import { test } from '@japa/runner';

test.group('Header component', () => {
	test('Desktop header render', async ({ assert, visit, route }) => {
		const page = await visit(route('home'));
		const header = page.locator('header');

		await page.assertVisible(header);

		const headerBody = await header.innerHTML();

		assert.snapshot(headerBody.trim()).match();
	});

	test('Mobile header render', async ({ assert, visit, route }) => {
		const page = await visit(route('home'));
		const header = page.locator('header');

		await page.assertVisible(header);

		const headerBody = await header.innerHTML();

		assert.snapshot(headerBody.trim()).match();
	});

	test('Show desktop navigation menu and not mobile menu on desktop', async ({ visit, route }) => {
		const page = await visit(route('home'));
		const navbarDesktop = page.locator('#navbar-desktop');
		const navbarDialogMobile = page.locator('#navbar-dialog-mobile');
		const mobileMenuButton = page.getByRole('button', { name: 'Toggle navigation menu' });

		await page.assertVisible(navbarDesktop);
		await page.assertNotExists(navbarDialogMobile);
		await page.assertNotVisible(mobileMenuButton);
	});

	test('Show mobile menu button and not desktop menu on mobile', async ({ visit, route }) => {
		const page = await visit(route('home'));
		const navbarDesktop = page.locator('#navbar-desktop');
		const navbarDialogMobile = page.locator('#navbar-dialog-mobile');
		const mobileMenuButton = page.getByRole('button', { name: 'Toggle navigation menu' });

		await page.setViewportSize({ width: 320, height: 568 });

		await page.assertNotVisible(navbarDesktop);
		await page.assertNotExists(navbarDialogMobile);
		await page.assertVisible(mobileMenuButton);
	});

	test('Show mobile navbar dialog on mobile', async ({ assert, visit, route }) => {
		const page = await visit(route('home'));
		const navbarDialogMobile = page.locator('#navbar-dialog-mobile');
		const mobileMenuButton = page.getByRole('button', { name: 'Toggle navigation menu' });

		await page.setViewportSize({ width: 320, height: 568 });

		await mobileMenuButton.click();

		await page.assertVisible(navbarDialogMobile);

		const navbarDialogMobileBody = await navbarDialogMobile.innerHTML();

		assert.snapshot(navbarDialogMobileBody.trim()).match();
	});

	test('Close mobile navbar dialog when changing page on mobile', async ({ visit, route }) => {
		const page = await visit(route('home'));
		const navbarDialogMobile = page.locator('#navbar-dialog-mobile');
		const mobileMenuButton = page.getByRole('button', { name: 'Toggle navigation menu' });

		await page.setViewportSize({ width: 320, height: 568 });

		await mobileMenuButton.click();

		const homeLink = navbarDialogMobile.getByRole('link', { name: 'Home' });

		await homeLink.click();

		await page.assertNotExists(navbarDialogMobile);
	});

	test('Theme button icon changes with system theme when no theme preference is set', async ({ visit, route }) => {
		const page = await visit(route('home'));
		const themeButton = page.getByRole('button', { name: 'Toggle theme' });
		const lightThemeIcon = themeButton.locator('svg.lucide-sun');
		const darkThemeIcon = themeButton.locator('svg.lucide-moon');

		await page.assertVisible(lightThemeIcon);
		await page.assertNotVisible(darkThemeIcon);

		await page.emulateMedia({ colorScheme: 'dark' });
		await page.reload();

		await page.assertVisible(darkThemeIcon);
		await page.assertNotVisible(lightThemeIcon);
	});

	test('Change theme when clicking on theme button', async ({ assert, visit, route, browserContext }) => {
		const page = await visit(route('home'));
		const themeButton = page.getByRole('button', { name: 'Toggle theme' });
		const lightThemeIcon = themeButton.locator('svg.lucide-sun');
		const darkThemeIcon = themeButton.locator('svg.lucide-moon');

		await themeButton.click();

		await page.assertVisible(darkThemeIcon);
		await page.assertNotVisible(lightThemeIcon);

		let storageState = await browserContext.storageState();
		let theme = storageState.origins[0].localStorage.find((item) => item.name === 'theme');

		assert.equal(theme?.value, 'dark');

		await themeButton.click();

		await page.assertVisible(lightThemeIcon);
		await page.assertNotVisible(darkThemeIcon);

		storageState = await browserContext.storageState();
		theme = storageState.origins[0].localStorage.find((item) => item.name === 'theme');

		assert.equal(theme?.value, 'light');
	});
});
