/**
 * Generic QA plan runner — Playwright library (video + screenshots + assertions).
 * Usage: node run-qa-plan.mjs <path-to-qa-plan.json>
 *
 * Writes to plan evidenceDir (or plan file directory):
 *   <issue-key>-evidence.webm
 *   qa-results.json
 *   screenshots named in plan steps
 */
import { chromium } from 'playwright';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function interpolate(value, variables) {
  if (typeof value !== 'string') return value;
  return value.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in variables)) throw new Error(`Missing plan variable: ${key}`);
    return String(variables[key]);
  });
}

function resolveUrl(baseUrl, target) {
  if (!target) throw new Error('goto step requires url or path');
  if (target.startsWith('http://') || target.startsWith('https://')) return target;
  return new URL(target.startsWith('/') ? target : `/${target}`, baseUrl).toString();
}

function locator(page, step) {
  if (step.testId) return page.getByTestId(step.testId);
  if (step.selector) return page.locator(step.selector);
  if (step.role && step.name) return page.getByRole(step.role, { name: step.name });
  throw new Error(`Step needs testId, selector, or role+name: ${JSON.stringify(step)}`);
}

async function acceptCookies(page) {
  const banner = page.locator('#onetrust-consent-sdk');
  await banner.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});

  const allowAll = page.locator('#accept-recommended-btn-handler');
  if (await allowAll.isVisible({ timeout: 5000 }).catch(() => false)) {
    await allowAll.click({ force: true });
    await banner.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await pause(500);
    return;
  }

  await page.evaluate(() => document.getElementById('onetrust-consent-sdk')?.remove());
  await pause(300);
}

async function assertFocused(page, testId) {
  const focused = await page.evaluate(() => document.activeElement?.getAttribute('data-testid') || null);
  if (focused !== testId) {
    throw new Error(`Expected focus on ${testId}, got ${focused ?? 'none'}`);
  }
}

async function runStep(page, step, ctx) {
  const { variables, evidenceDir } = ctx;

  switch (step.action) {
    case 'goto': {
      const url = resolveUrl(ctx.baseUrl, interpolate(step.url ?? step.path, variables));
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: step.timeout ?? 60000 });
      break;
    }
    case 'acceptCookies':
      await acceptCookies(page);
      break;
    case 'pause':
      await pause(step.ms ?? 500);
      break;
    case 'click':
      await locator(page, step).click({ force: step.force ?? false, timeout: step.timeout ?? 30000 });
      break;
    case 'fill':
      await locator(page, step).fill(interpolate(step.value ?? '', variables), { timeout: step.timeout ?? 30000 });
      break;
    case 'type':
      await locator(page, step).pressSequentially(interpolate(step.text ?? '', variables), {
        delay: step.delay ?? 300,
      });
      break;
    case 'check':
      await locator(page, step).click({ force: true });
      break;
    case 'clearFields': {
      for (const testId of step.testIds ?? []) {
        await page.getByTestId(testId).fill('');
      }
      break;
    }
    case 'screenshot': {
      const file = interpolate(step.file, variables);
      await page.screenshot({ path: path.join(evidenceDir, file), fullPage: step.fullPage ?? false });
      break;
    }
    case 'assertVisible':
      await locator(page, step).waitFor({ state: 'visible', timeout: step.timeout ?? 15000 });
      break;
    case 'assertHidden':
      await locator(page, step).waitFor({ state: 'hidden', timeout: step.timeout ?? 15000 });
      break;
    case 'assertFocused':
      await assertFocused(page, step.testId);
      break;
    case 'assertUrl': {
      const pattern = interpolate(step.pattern ?? step.url, variables);
      const current = page.url();
      if (!current.includes(pattern)) {
        throw new Error(`URL expected to include "${pattern}", got "${current}"`);
      }
      break;
    }
    default:
      throw new Error(`Unknown action: ${step.action}`);
  }
}

async function runSteps(page, steps, ctx) {
  for (const step of steps) {
    await runStep(page, step, ctx);
  }
}

async function main() {
  const planPath = process.argv[2];
  if (!planPath) {
    console.error('Usage: node run-qa-plan.mjs <qa-plan.json>');
    process.exit(1);
  }

  const plan = JSON.parse(await readFile(planPath, 'utf8'));
  const issueKey = plan.issueKey;
  if (!issueKey) throw new Error('plan.issueKey is required');
  if (!plan.baseUrl) throw new Error('plan.baseUrl is required');

  const planDir = path.dirname(path.resolve(planPath));
  const evidenceDir = path.resolve(plan.evidenceDir ?? planDir);
  const viewport = plan.viewport ?? { width: 390, height: 844 };
  const variables = {
    runId: Math.random().toString(16).slice(2, 10),
    ...(plan.variables ?? {}),
  };
  const videoFile = path.join(evidenceDir, `${issueKey.toLowerCase()}-evidence.webm`);

  await mkdir(evidenceDir, { recursive: true });

  const ctx = { baseUrl: plan.baseUrl.replace(/\/$/, ''), variables, evidenceDir };
  const results = {
    issueKey,
    startedAt: new Date().toISOString(),
    video: path.basename(videoFile),
    scenarios: [],
    passed: true,
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport,
    recordVideo: { dir: evidenceDir, size: { width: viewport.width, height: viewport.height } },
  });
  const page = await context.newPage();

  try {
    if (plan.beforeAll?.length) {
      await runSteps(page, plan.beforeAll, ctx);
    }

    for (const scenario of plan.scenarios ?? []) {
      const entry = {
        id: scenario.id,
        source: scenario.source ?? scenario.id,
        name: scenario.name ?? scenario.id,
        passed: false,
        error: null,
      };

      try {
        await runSteps(page, scenario.steps ?? [], ctx);
        entry.passed = true;
      } catch (error) {
        entry.error = error instanceof Error ? error.message : String(error);
        results.passed = false;
        const failShot = `fail-${scenario.id}.png`;
        await page.screenshot({ path: path.join(evidenceDir, failShot) }).catch(() => {});
        entry.failureScreenshot = failShot;
      }

      results.scenarios.push(entry);
    }
  } finally {
    const video = page.video();
    const tempVideoPath = video ? await video.path() : null;
    await context.close();
    await browser.close();

    if (tempVideoPath) {
      await rename(tempVideoPath, videoFile);
    }
  }

  results.finishedAt = new Date().toISOString();
  await writeFile(path.join(evidenceDir, 'qa-results.json'), JSON.stringify(results, null, 2));

  console.log(JSON.stringify({ passed: results.passed, video: videoFile, results: path.join(evidenceDir, 'qa-results.json') }));

  process.exit(results.passed ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
