import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function buildPlugin(dirPath, isRoot = false) {
    const jsPath = path.join(dirPath, "index.js");
    const manifestPath = path.join(dirPath, "manifest.json");

    if (!fs.existsSync(jsPath) || !fs.existsSync(manifestPath)) {
        return;
    }

    const code = fs.readFileSync(jsPath, "utf8");
    // Validate syntax
    new Function("vendetta", `return ${code}`);

    const hash = crypto.createHash("sha256").update(code).digest("hex");
    const currentManifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    currentManifest.hash = hash;

    const manifestJson = JSON.stringify(currentManifest, null, 4) + "\n";
    fs.writeFileSync(manifestPath, manifestJson, "utf8");

    console.log(`[OK] Updated ${path.basename(dirPath)}${isRoot ? " (root)" : ""} manifest.json (hash: ${hash.slice(0, 12)}...)`);
}

// Build root
buildPlugin(__dirname, true);

// Build subdirectories
const entries = fs.readdirSync(__dirname, { withFileTypes: true });
for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith(".")) {
        buildPlugin(path.join(__dirname, entry.name));
    }
}
