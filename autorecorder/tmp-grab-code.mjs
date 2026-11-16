// temp: grab "Code" tab files from rendered doc pages (deleted after use)
import { chromium } from 'playwright';
import fs from 'fs';
const OUT = 'C:/Users/QS/AppData/Local/Temp/claude/562a9d0e02beac58/9e37cc1e-d1dc-45b9-9787-97e785c97f2f/scratchpad/lgp-gen/code2/';
const pages = process.argv.slice(2);
const b = await chromium.launch();
for (const p of pages) {
  const pg = await b.newPage();
  await pg.goto('https://docs.copilotkit.ai/langgraph-python/generative-ui/' + p, { waitUntil: 'networkidle', timeout: 90000 });
  const codeTabs = pg.locator('[role=tab][id$="-trigger-code"]');
  const n = await codeTabs.count();
  for (let i = 0; i < n; i++) {
    await codeTabs.nth(i).click();
    const panel = pg.locator('[role=tabpanel][id$="-content-code"]').nth(i);
    const files = panel.locator('[role=tab][title]');
    const fc = await files.count();
    for (let j = 0; j < fc; j++) {
      const t = await files.nth(j).getAttribute('title');
      if (!/\.(py|json)$/.test(t)) continue;
      await files.nth(j).click();
      await pg.waitForTimeout(400);
      const txt = await panel.locator('[role=tabpanel][data-state=active] pre').first().innerText();
      const f = OUT + p.replace(/\//g, '_') + '/' + t;
      fs.mkdirSync(f.substring(0, f.lastIndexOf('/')), { recursive: true });
      fs.writeFileSync(f, txt);
      console.log(p, t, txt.split('\n').length);
    }
  }
  await pg.close();
}
await b.close();
