/**
 * Viewer Expert Review Script
 * Navigates all viewer pages, takes screenshots, and reports findings.
 *
 * Usage: HEADLESS=true node scripts/viewer-review.js
 */
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')
const { execSync, spawn } = require('child_process')

const VIEWER_URL = 'http://localhost:4173'
const SCREENSHOT_DIR = path.join(__dirname, '../viewer/review-screenshots')

const findings = []

function addFinding(page, severity, category, description) {
  findings.push({ page, severity, category, description })
}

async function reviewPage(page, route, name) {
  console.log(`\n📄 Reviewing: ${name} (${route})`)

  try {
    await page.goto(`${VIEWER_URL}/#${route}`, { waitUntil: 'networkidle', timeout: 10000 })
    await page.waitForTimeout(500)
  } catch (e) {
    addFinding(name, 'critical', 'Navigation', `Failed to load page: ${e.message}`)
    return
  }

  // Screenshot
  const screenshotPath = path.join(SCREENSHOT_DIR, `${name.replace(/[^a-zA-Z0-9]/g, '_')}.png`)
  await page.screenshot({ path: screenshotPath, fullPage: true })
  console.log(`  📸 Screenshot saved`)

  // Check page has content
  const bodyText = await page.textContent('body')
  if (!bodyText || bodyText.trim().length < 20) {
    addFinding(name, 'critical', 'Content', 'Page appears blank or has very little content')
  }

  // Check for horizontal overflow
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth
  })
  if (hasHorizontalScroll) {
    addFinding(name, 'moderate', 'Layout', 'Page has horizontal scroll (potential overflow)')
  }

  console.log(`  ✅ Page reviewed`)
}

async function reviewSprintPageTabs(page, sprintId, name) {
  const tabs = ['Overview', 'Planning', 'Retrospective', 'Tickets']

  for (const tab of tabs) {
    console.log(`  📑 Tab: ${tab}`)

    await page.goto(`${VIEWER_URL}/#/sprint/${sprintId}`, { waitUntil: 'networkidle', timeout: 10000 })
    await page.waitForTimeout(300)

    const tabButton = page.locator(`button:has-text("${tab}")`).first()
    if (await tabButton.isVisible()) {
      await tabButton.click()
      await page.waitForTimeout(500)

      const screenshotPath = path.join(SCREENSHOT_DIR, `${name}_${tab.toLowerCase()}.png`)
      await page.screenshot({ path: screenshotPath, fullPage: true })
    } else {
      addFinding(`${name}/${tab}`, 'minor', 'UI', `Tab button "${tab}" not visible`)
    }
  }
}

async function reviewSidebar(page) {
  console.log('\n📐 Reviewing Sidebar Navigation')

  await page.goto(`${VIEWER_URL}/#/`, { waitUntil: 'networkidle', timeout: 10000 })
  await page.waitForTimeout(500)

  // Check sidebar exists
  const sidebar = page.locator('aside')
  if (!await sidebar.isVisible()) {
    addFinding('Sidebar', 'critical', 'Layout', 'Sidebar not visible')
    return
  }

  // Check sprints section
  const sprintsButton = page.locator('button:has-text("Sprints")')
  if (await sprintsButton.isVisible()) {
    console.log('  ✅ Sprints section found')

    // Count sprint links
    const sprintLinks = page.locator('a[href*="/sprint/"]')
    const linkCount = await sprintLinks.count()
    console.log(`  📊 Sprint links count: ${linkCount}`)

    if (linkCount < 10) {
      addFinding('Sidebar', 'moderate', 'Navigation', `Only ${linkCount} sprint links found, expected 14+`)
    }

    // Check "All Sprints" link
    const allSprintsLink = page.locator('a:has-text("All Sprints")')
    if (!await allSprintsLink.isVisible()) {
      addFinding('Sidebar', 'minor', 'Navigation', '"All Sprints" link not visible')
    } else {
      console.log('  ✅ "All Sprints" link found')
    }
  } else {
    addFinding('Sidebar', 'critical', 'Navigation', 'Sprints collapsible section not found')
  }

  // Test clicking a sprint link
  const sprintLink = page.locator('a[href*="/sprint/0"]').first()
  if (await sprintLink.isVisible()) {
    await sprintLink.click()
    await page.waitForTimeout(500)
    const url = page.url()
    if (url.includes('/sprint/0')) {
      console.log('  ✅ Sprint navigation works')
    } else {
      addFinding('Sidebar', 'critical', 'Navigation', 'Sprint link click did not navigate')
    }
  }
}

async function main() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
  }

  console.log('🔨 Building viewer...')
  execSync('npm run build', { cwd: path.join(__dirname, '../viewer'), stdio: 'inherit' })

  console.log('\n🚀 Starting preview server...')
  const previewProcess = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    cwd: path.join(__dirname, '../viewer'),
    stdio: 'pipe',
  })

  await new Promise((resolve) => {
    previewProcess.stdout.on('data', (data) => {
      if (data.toString().includes('4173')) resolve()
    })
    setTimeout(resolve, 3000)
  })

  const browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  try {
    await reviewPage(page, '/', 'Dashboard')
    await reviewSidebar(page)
    await reviewPage(page, '/sprints', 'SprintsListPage')

    // Sprint 6 (richest data)
    await reviewPage(page, '/sprint/6', 'Sprint6')
    await reviewSprintPageTabs(page, '6', 'Sprint6')

    // Sprint 0 (minimal data)
    await reviewPage(page, '/sprint/0', 'Sprint0')
    await reviewSprintPageTabs(page, '0', 'Sprint0')

    // Sprint 15 (self-referential planning)
    await reviewPage(page, '/sprint/15', 'Sprint15')

    // Sprint 14 (recent)
    await reviewPage(page, '/sprint/14', 'Sprint14')

    // Other pages
    await reviewPage(page, '/backlog', 'Backlog')
    await reviewPage(page, '/design-system', 'DesignSystem')

    // Non-existent sprint
    await reviewPage(page, '/sprint/999', 'Sprint_NotFound')
    const notFoundText = await page.textContent('body')
    if (notFoundText && notFoundText.includes('not found')) {
      console.log('  ✅ 404 handling works')
    } else {
      addFinding('Sprint_NotFound', 'moderate', 'Error Handling', 'No "not found" message for non-existent sprint')
    }

  } finally {
    await browser.close()
    previewProcess.kill()
  }

  // Report
  console.log('\n' + '='.repeat(60))
  console.log('📋 EXPERT REVIEW REPORT')
  console.log('='.repeat(60))

  const critical = findings.filter(f => f.severity === 'critical')
  const moderate = findings.filter(f => f.severity === 'moderate')
  const minor = findings.filter(f => f.severity === 'minor')

  console.log(`\n🔴 Critical: ${critical.length}`)
  critical.forEach(f => console.log(`   [${f.page}] ${f.category}: ${f.description}`))

  console.log(`\n🟡 Moderate: ${moderate.length}`)
  moderate.forEach(f => console.log(`   [${f.page}] ${f.category}: ${f.description}`))

  console.log(`\n🔵 Minor: ${minor.length}`)
  minor.forEach(f => console.log(`   [${f.page}] ${f.category}: ${f.description}`))

  console.log(`\n📸 Screenshots: ${SCREENSHOT_DIR}`)
  console.log(`Total: ${findings.length} (${critical.length} critical, ${moderate.length} moderate, ${minor.length} minor)`)

  const reportPath = path.join(SCREENSHOT_DIR, 'report.json')
  fs.writeFileSync(reportPath, JSON.stringify({ findings, timestamp: new Date().toISOString() }, null, 2))

  if (critical.length > 0) process.exit(1)
}

main().catch(err => {
  console.error('Review failed:', err)
  process.exit(2)
})
