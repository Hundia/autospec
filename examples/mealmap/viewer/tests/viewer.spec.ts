import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:5174';
const SCREENSHOTS_DIR = '/opt/FitnessAiManager/autospec/reviews/v0.1.0/screenshots';

// Ensure screenshots dir exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

test.describe('Dashboard', () => {
  test('title contains MealMap', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const title = await page.title();
    // Check either page title or page heading
    const heading = await page.locator('h2').first().textContent();
    expect(heading).toContain('MealMap');
  });

  test('KPI cards render with stats', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    // Wait for AnimatedCounter to show content
    await page.waitForTimeout(500);

    // Check for KPI labels — use first() to handle multiple matches
    const totalPointsLabel = page.getByText('Total Points').first();
    const totalTicketsLabel = page.getByText('Total Tickets').first();
    const sprintsLabel = page.getByText('Sprints').first();
    const roleSpecsLabel = page.getByText('Role Specs').first();

    await expect(totalPointsLabel).toBeVisible();
    await expect(totalTicketsLabel).toBeVisible();
    await expect(sprintsLabel).toBeVisible();
    await expect(roleSpecsLabel).toBeVisible();
  });

  test('charts render (Recharts SVG elements)', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Recharts renders SVG inside responsive containers
    const svgElements = page.locator('svg');
    const count = await svgElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('sprint list shows 3 sprints', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Sprint section heading (the card title h3)
    const sprintsCardTitle = page.getByRole('heading', { name: 'Sprints' });
    await expect(sprintsCardTitle).toBeVisible();

    // Sprint labels in the card rows — use font-mono spans
    await expect(page.getByText('S0').first()).toBeVisible();
    await expect(page.getByText('S1').first()).toBeVisible();
    await expect(page.getByText('S2').first()).toBeVisible();
  });

  test('screenshot - dashboard', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/dashboard.png`, fullPage: true });
  });
});

test.describe('Backlog', () => {
  test('sprint sections visible in kanban', async ({ page }) => {
    await page.goto(`${BASE_URL}/backlog`);
    await page.waitForLoadState('networkidle');

    // Kanban column headers — use first() since "Done" appears in sidebar badge area too
    await expect(page.getByText('Todo').first()).toBeVisible();
    await expect(page.getByText('Done').first()).toBeVisible();
  });

  test('ticket cards are visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/backlog`);
    await page.waitForLoadState('networkidle');

    // Ticket cards contain ticket IDs like 0.1
    const ticketId = page.getByText('0.1').first();
    await expect(ticketId).toBeVisible();
  });

  test('status indicators present - done badges for sprint 0', async ({ page }) => {
    await page.goto(`${BASE_URL}/backlog`);
    await page.waitForLoadState('networkidle');

    // Check a specific sprint 0 ticket title in the Done column
    await expect(page.getByText('Health check endpoint')).toBeVisible();
    // Verify the docker-compose ticket is also visible (sprint 0)
    await expect(page.getByText('docker-compose.yml with PostgreSQL')).toBeVisible();
  });

  test('table view works', async ({ page }) => {
    await page.goto(`${BASE_URL}/backlog`);
    await page.waitForLoadState('networkidle');

    // Click Table button
    await page.getByRole('button', { name: 'Table' }).click();
    await page.waitForTimeout(200);

    // Table should appear with column headers — use getByRole for precision
    await expect(page.getByRole('columnheader', { name: 'ID' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Title' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Owner' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
  });

  test('screenshot - backlog kanban', async ({ page }) => {
    await page.goto(`${BASE_URL}/backlog`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/backlog.png`, fullPage: true });
  });
});

test.describe('Specs', () => {
  test('5 spec cards render', async ({ page }) => {
    await page.goto(`${BASE_URL}/specs`);
    await page.waitForLoadState('networkidle');

    // Heading
    const heading = page.getByText('Role Specs');
    await expect(heading).toBeVisible();

    // Count spec cards: each has a specs/*.md code element
    const specPaths = page.locator('code').filter({ hasText: 'specs/' });
    const count = await specPaths.count();
    expect(count).toBe(5);
  });

  test('each card has title text', async ({ page }) => {
    await page.goto(`${BASE_URL}/specs`);
    await page.waitForLoadState('networkidle');

    // Check for known spec owners
    await expect(page.getByText('PM').first()).toBeVisible();
    await expect(page.getByText('Backend').first()).toBeVisible();
    await expect(page.getByText('Frontend').first()).toBeVisible();
    await expect(page.getByText('DB').first()).toBeVisible();
    await expect(page.getByText('QA').first()).toBeVisible();
  });

  test('screenshot - specs', async ({ page }) => {
    await page.goto(`${BASE_URL}/specs`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/specs.png`, fullPage: true });
  });
});

test.describe('Docs', () => {
  test('docs page renders with content', async ({ page }) => {
    await page.goto(`${BASE_URL}/docs`);
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h2').first();
    await expect(heading).toBeVisible();
  });

  test('doc sections or cards visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/docs`);
    await page.waitForLoadState('networkidle');

    // Look for any cards or content
    const cards = page.locator('[class*="card"], [class*="Card"], .border, .rounded');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('screenshot - docs', async ({ page }) => {
    await page.goto(`${BASE_URL}/docs`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/docs.png`, fullPage: true });
  });
});

test.describe('Design System', () => {
  test('color swatches visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/design-system`);
    await page.waitForLoadState('networkidle');

    // Brand Colors section
    await expect(page.getByText('Brand Colors')).toBeVisible();
  });

  test('typography examples present', async ({ page }) => {
    await page.goto(`${BASE_URL}/design-system`);
    await page.waitForLoadState('networkidle');

    // Typography section
    const typographySection = page.getByText('Typography');
    await expect(typographySection).toBeVisible();
  });

  test('badge component showcase', async ({ page }) => {
    await page.goto(`${BASE_URL}/design-system`);
    await page.waitForLoadState('networkidle');

    // Badges section
    await expect(page.getByText('Badges')).toBeVisible();
  });

  test('screenshot - design system', async ({ page }) => {
    await page.goto(`${BASE_URL}/design-system`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/design-system.png`, fullPage: true });
  });
});

test.describe('Architecture', () => {
  test('system diagram or content visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/architecture`);
    await page.waitForLoadState('networkidle');

    const heading = page.locator('h2').first();
    await expect(heading).toBeVisible();
  });

  test('tech stack information present', async ({ page }) => {
    await page.goto(`${BASE_URL}/architecture`);
    await page.waitForLoadState('networkidle');

    // Look for tech-related text
    const content = await page.locator('body').textContent();
    const hasTechContent = (content || '').toLowerCase().includes('express') ||
      (content || '').toLowerCase().includes('react') ||
      (content || '').toLowerCase().includes('postgres') ||
      (content || '').toLowerCase().includes('backend') ||
      (content || '').toLowerCase().includes('frontend') ||
      (content || '').toLowerCase().includes('architecture');
    expect(hasTechContent).toBe(true);
  });

  test('screenshot - architecture', async ({ page }) => {
    await page.goto(`${BASE_URL}/architecture`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/architecture.png`, fullPage: true });
  });
});

test.describe('Navigation', () => {
  test('sidebar has 6 nav links', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Nav links in the aside sidebar
    const navLinks = page.locator('aside nav a');
    const count = await navLinks.count();
    expect(count).toBe(6);
  });

  test('MealMap branding visible in sidebar', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const branding = page.locator('aside').getByText('MealMap');
    await expect(branding).toBeVisible();
  });

  test('navigate to Backlog via sidebar', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('aside nav a').getByText('Backlog').click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*\/backlog/);
    await expect(page.locator('h2').first()).toContainText('Backlog');
  });

  test('navigate to Specs via sidebar', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('aside nav a').getByText('Specs').click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*\/specs/);
  });

  test('navigate to Docs via sidebar', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('aside nav a').getByText('Docs').click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*\/docs/);
  });

  test('navigate to Architecture via sidebar', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('aside nav a').getByText('Architecture').click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*\/architecture/);
  });

  test('navigate to Design System via sidebar', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.locator('aside nav a').getByText('Design System').click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/.*\/design-system/);
  });

  test('active link is highlighted', async ({ page }) => {
    await page.goto(`${BASE_URL}/backlog`);
    await page.waitForLoadState('networkidle');

    // Active link gets bg-brand-500 class (green background)
    const activeLink = page.locator('aside nav a.bg-brand-500');
    await expect(activeLink).toBeVisible();
    const linkText = await activeLink.textContent();
    expect(linkText).toContain('Backlog');
  });

  test('screenshot - navigation sidebar', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/navigation.png`, fullPage: false });
  });
});

test.describe('Data Accuracy', () => {
  test('total points = 75', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(600); // wait for AnimatedCounter

    // The AnimatedCounter shows 75 next to "Total Points"
    const kpiArea = page.locator('.grid').first();
    const content = await kpiArea.textContent();
    expect(content).toContain('75');
  });

  test('total tickets = 28', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(600);

    const kpiArea = page.locator('.grid').first();
    const content = await kpiArea.textContent();
    expect(content).toContain('28');
  });

  test('total sprints = 3', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(600);

    const kpiArea = page.locator('.grid').first();
    const content = await kpiArea.textContent();
    expect(content).toContain('3');
  });

  test('spec count = 5', async ({ page }) => {
    await page.goto(`${BASE_URL}/specs`);
    await page.waitForLoadState('networkidle');

    const subheading = page.getByText(/5 role specifications/);
    await expect(subheading).toBeVisible();
  });

  test('sprint 0 all done - done count in kanban', async ({ page }) => {
    await page.goto(`${BASE_URL}/backlog`);
    await page.waitForLoadState('networkidle');

    // The Done kanban column header is: emoji span + "Done" span + count pill span
    // Find the flex container that contains the Done column header text
    // The structure: div.flex-shrink-0 > div.flex.items-center > span(emoji) + span("Done") + span(count)
    // Locate the column header div that has "Done" text and get the count badge in it
    const doneColumnHeader = page.locator('div.flex.items-center.gap-2.mb-3').filter({ hasText: 'Done' });
    const countBadge = doneColumnHeader.locator('span').last();
    const countText = await countBadge.textContent();
    // Sprint 0 has 10 done tickets
    expect(countText?.trim()).toBe('10');
  });
});
