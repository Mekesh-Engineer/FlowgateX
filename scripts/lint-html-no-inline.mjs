#!/usr/bin/env node

/**
 * lint-html-no-inline.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Custom CI-friendly linter that fails the build when:
 *   1. Inline `style="..."` attributes appear in index.html
 *   2. Inline `<style>` blocks appear in index.html
 *   3. Hardcoded hex (#rrggbb / #rgb) or rgb()/hsl() color values appear
 *      in index.html (outside of <meta> tags and JSON-LD blocks)
 *
 * Usage:
 *   node scripts/lint-html-no-inline.mjs            # defaults to index.html
 *   node scripts/lint-html-no-inline.mjs index.html
 *
 * Exit codes:
 *   0 = clean
 *   1 = violations found
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const filePath = resolve(process.argv[2] || 'index.html');
const html = readFileSync(filePath, 'utf-8');
const lines = html.split('\n');

const violations = [];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function addViolation(line, lineNum, rule, detail) {
    violations.push({ line: lineNum, rule, detail, source: line.trim() });
}

// Skip lines inside <script type="application/ld+json"> blocks, <meta>, and <link> tags
function isAllowedContext(line) {
    const trimmed = line.trim();
    return (
        trimmed.startsWith('<meta ') ||
        trimmed.startsWith('<link ') ||
        trimmed.startsWith('<!--')
    );
}

// ─── Rule 1: No inline style="..." attributes ────────────────────────────────
const INLINE_STYLE_ATTR = /\bstyle\s*=\s*["']/i;

// ─── Rule 2: No <style> blocks ───────────────────────────────────────────────
const STYLE_OPEN_TAG = /<style[\s>]/i;

// ─── Rule 3: No hardcoded color values (hex, rgb, hsl, rgba, hsla) ───────────
// Matches: #abc, #aabbcc, #aabbccdd, rgb(...), rgba(...), hsl(...), hsla(...)
const HARDCODED_COLOR = /#[0-9a-fA-F]{3,8}\b|(?:rgba?|hsla?)\s*\(/;

// ─── Scan ─────────────────────────────────────────────────────────────────────

let insideScript = false;
let insideStyleBlock = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Track <script type="application/ld+json"> blocks (colours allowed inside)
    if (/<script\b[^>]*type\s*=\s*["']application\/ld\+json["']/i.test(line)) {
        insideScript = true;
        continue;
    }
    if (insideScript) {
        if (/<\/script>/i.test(line)) insideScript = false;
        continue;
    }

    // Rule 2 — detect <style> opening
    if (STYLE_OPEN_TAG.test(line)) {
        addViolation(line, lineNum, 'no-inline-style-block', 'Inline <style> block detected. Move to external CSS file.');
        insideStyleBlock = true;
        continue;
    }
    if (insideStyleBlock) {
        if (/<\/style>/i.test(line)) insideStyleBlock = false;
        continue;
    }

    // Rule 1 — inline style attributes
    if (INLINE_STYLE_ATTR.test(line)) {
        addViolation(line, lineNum, 'no-inline-style-attr', 'Inline style="..." attribute found. Use a CSS class instead.');
    }

    // Rule 3 — hardcoded colours (skip allowed contexts)
    if (!isAllowedContext(line) && HARDCODED_COLOR.test(line)) {
        // Extract the offending colour token for the report
        const match = line.match(HARDCODED_COLOR);
        addViolation(line, lineNum, 'no-hardcoded-color', `Hardcoded color value "${match[0]}..." found. Use a CSS variable from styles/base/critical.css or styles/base/variables.css.`);
    }
}

// ─── Report ───────────────────────────────────────────────────────────────────

if (violations.length === 0) {
    console.log(`\n  ✅  ${filePath} — No inline styles or hardcoded colours found.\n`);
    process.exit(0);
} else {
    console.error(`\n  ❌  ${filePath} — ${violations.length} violation(s) found:\n`);
    for (const v of violations) {
        console.error(`  Line ${v.line} [${v.rule}]`);
        console.error(`    ${v.detail}`);
        console.error(`    > ${v.source.substring(0, 120)}`);
        console.error('');
    }
    process.exit(1);
}
