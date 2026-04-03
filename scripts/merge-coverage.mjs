import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { execSync } from "child_process";

const merged = "coverage/merged";
const nycOutput = `${merged}/.nyc_output`;
mkdirSync(nycOutput, { recursive: true });

const unitPath = "coverage/unit/coverage-final.json";
const e2ePaths = [".nyc_output/out.json", ".nyc_output/coverage-final.json", "coverage/coverage-final.json"];
const e2ePath = e2ePaths.find((p) => existsSync(p));

const unitData = existsSync(unitPath) ? JSON.parse(readFileSync(unitPath, "utf8")) : {};
const e2eData = e2ePath ? JSON.parse(readFileSync(e2ePath, "utf8")) : {};

const excludePatterns = [
  /src[\\/]interfaces[\\/]/, 
  /src[\\/]types[\\/]/, 
  /\.d\.ts$/
];
const allKeys = new Set([...Object.keys(unitData), ...Object.keys(e2eData)]);
const combined = {};

for (const key of allKeys) {
  if (excludePatterns.some((p) => p.test(key))) continue;
  const unit = unitData[key];
  const e2e = e2eData[key];

  if (!unit) {
    combined[key] = e2e;
    continue;
  }
  if (!e2e) {
    combined[key] = unit;
    continue;
  }

  combined[key] = { ...unit };
  combined[key].s = { ...unit.s };
  combined[key].f = { ...unit.f };
  combined[key].b = { ...unit.b };

  for (const [k, v] of Object.entries(e2e.s)) {
    combined[key].s[k] = (combined[key].s[k] || 0) + v;
  }
  for (const [k, v] of Object.entries(e2e.f)) {
    combined[key].f[k] = (combined[key].f[k] || 0) + v;
  }
  for (const [k, arr] of Object.entries(e2e.b)) {
    if (!combined[key].b[k]) {
      if (arr.some(v => v > 0)) {
        combined[key].b[k] = arr;
      }
    } else {
      combined[key].b[k] = combined[key].b[k].map((val, i) => val + (arr[i] || 0));
    }
  }
}

writeFileSync(`${nycOutput}/out.json`, JSON.stringify(combined));

execSync(
  `npx nyc report --temp-dir ${nycOutput} --report-dir ${merged} --reporter text --reporter lcov --reporter html --exclude-after-remap`,
  { stdio: ["inherit", "inherit", "ignore"] },
);
