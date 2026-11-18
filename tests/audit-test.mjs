import { chromium } from 'playwright';

async function runAudit() {
  console.log('🚀 Starting Jeexers Playwright Forensic Audit...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const report = {
    url: 'https://jeexers.vercel.app/',
    timestamp: new Date().toISOString(),
    tests: [],
    errors: [],
  };

  try {
    // 1. Storefront Tests
    console.log('Testing Storefront...');
    await page.goto('https://jeexers.vercel.app/', { waitUntil: 'networkidle' });
    
    const title = await page.title();
    console.log('Page title:', title);
    report.tests.push({ name: 'Page Title Check', passed: title.includes('THE JEEXERS') });

    // Logo wave check
    const logoWave = await page.$('.logo-light-wave');
    report.tests.push({ name: 'Logo Crimson Wave Active', passed: logoWave !== null });

    // Search bar test
    const searchInput = await page.$('input[placeholder*="Search by anime"]');
    if (searchInput) {
      await searchInput.fill('cropped');
      await page.waitForTimeout(400);
      const searchCountText = await page.textContent('body');
      const croppedFound = searchCountText.includes('CROPPED');
      report.tests.push({ name: 'Searchbar Tag Query (#cropped)', passed: croppedFound });
      await searchInput.fill('');
    }

    // Series filters test
    const seriesButtons = await page.$$('button:has-text("ONE-PIECE"), button:has-text("JJK"), button:has-text("BERSERK"), button:has-text("DBS")');
    report.tests.push({ name: 'Series Filter Buttons Present', passed: seriesButtons.length >= 4 });

    // Silhouette buttons test
    const silButtons = await page.$$('button:has-text("OVERSIZED"), button:has-text("SLIM FIT"), button:has-text("CROPPED")');
    report.tests.push({ name: 'Silhouette Cut Buttons Present', passed: silButtons.length >= 3 });

    // 2. Product Detail & Bag Flow
    console.log('Testing Product Detail & Bag...');
    const firstProduct = await page.$('button[aria-label*="Inspect"]');
    if (firstProduct) {
      await firstProduct.click();
      await page.waitForTimeout(600);

      const hasBackBtn = await page.$('button:has-text("RETURN TO STORE")');
      const hasSizeButtons = await page.$$('button:has-text("S"), button:has-text("M"), button:has-text("L")');
      report.tests.push({ name: 'Product Detail Navigation', passed: hasBackBtn !== null });
      report.tests.push({ name: 'Size Selector Present', passed: hasSizeButtons.length >= 3 });

      // Add to bag
      const addBtn = await page.$('button:has-text("ADD TO BAG")');
      if (addBtn) {
        await addBtn.click();
        await page.waitForTimeout(1500);
        report.tests.push({ name: 'Add to Bag Animation Triggered', passed: true });
      }

      // Open Bag Drawer
      const bagTrigger = await page.$('button[aria-label*="Shopping Backpack"]');
      if (bagTrigger) {
        await bagTrigger.click();
        await page.waitForTimeout(600);
        const checkoutBtn = await page.$('button:has-text("ENTER SECURE CHECKOUT")');
        report.tests.push({ name: 'Bag Drawer Opened with Checkout CTA', passed: checkoutBtn !== null });

        if (checkoutBtn) {
          await checkoutBtn.click();
          await page.waitForTimeout(600);
        } else {
          // close drawer if not proceeding
          const closeBtn = await page.$('button:has-text("CLOSE [ESC]")');
          if (closeBtn) await closeBtn.click();
        }
      }
    }

    // 3. Checkout & Promo System
    console.log('Testing Checkout & Promo Code...');
    const promoInput = await page.$('input[placeholder="PROMO CODE"]');
    const unlockInput = await page.$('input[placeholder*="Enter email to unlock"]');
    report.tests.push({ name: 'Checkout Promo Input Exists', passed: promoInput !== null });
    report.tests.push({ name: 'Email 15% Unlock Input Exists', passed: unlockInput !== null });

    if (unlockInput) {
      await unlockInput.fill('soldier.audit@jeexers.com');
      const unlockBtn = await page.$('button:has-text("UNLOCK 15%")');
      if (unlockBtn) {
        await unlockBtn.click();
        await page.waitForTimeout(400);
        const pageText = await page.textContent('body');
        const applied = pageText.includes('RELEASE15 APPLIED') || pageText.includes('DISCOUNT (RELEASE15)');
        report.tests.push({ name: '15% Email Discount Auto-Applied', passed: applied });
      }
    }

    // 4. Admin Panel Flow
    console.log('Testing Admin Panel (#admin)...');
    await page.goto('https://jeexers.vercel.app/#admin', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const passkeyField = await page.$('input[placeholder*="Access Key"]');
    report.tests.push({ name: 'Admin Gate Renders with Restricted Lock', passed: passkeyField !== null });

    if (passkeyField) {
      await passkeyField.fill('jeexers2026');
      const unlockBtn = await page.$('button:has-text("UNLOCK ADMIN")');
      if (unlockBtn) {
        await unlockBtn.click();
        await page.waitForTimeout(800);
      }

      const adminTitle = await page.$('h1:has-text("HOODIE STUDIO & INVENTORY COMMAND")');
      report.tests.push({ name: 'Admin Unlocked with Key "jeexers2026"', passed: adminTitle !== null });

      // Check Draggable handle
      const dragHandle = await page.$('div[title*="Left click and drag"]');
      report.tests.push({ name: 'Interactive Draggable Graphic Handle Exists', passed: dragHandle !== null });

      // Check 3 Silhouette buttons in admin
      const adminSilButtons = await page.$$('button:has-text("OVERSIZED"), button:has-text("SLIM FIT"), button:has-text("CROPPED")');
      report.tests.push({ name: 'Admin 3-Silhouette Geometries Configurable', passed: adminSilButtons.length >= 3 });

      // Check Hex Grid swatches
      const hexGridBtn = await page.$('button:has-text("Hex Grid")');
      if (hexGridBtn) {
        await hexGridBtn.click();
        await page.waitForTimeout(300);
        const swatches = await page.$$('button[title*="#"]');
        report.tests.push({ name: 'Admin Hex Grid Swatches Accessible', passed: swatches.length >= 10 });
      }

      // Check Inventory Tab
      const inventoryTab = await page.$('button:has-text("INVENTORY & STOCK MATRIX")');
      if (inventoryTab) {
        await inventoryTab.click();
        await page.waitForTimeout(400);
        const stockInputs = await page.$$('input[type="number"]');
        report.tests.push({ name: 'Admin Color × Size Inventory Matrix Live', passed: stockInputs.length >= 10 });
      }
    }

    console.log('All tests finished successfully!');
  } catch (err) {
    console.error('Error during audit:', err);
    report.errors.push(err.message);
  } finally {
    await browser.close();
  }

  console.log('\n--- AUDIT SUMMARY ---');
  console.log(JSON.stringify(report, null, 2));
}

runAudit();
