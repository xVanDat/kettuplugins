import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsPath = path.join(__dirname, "index.js");
const code = fs.readFileSync(jsPath, "utf8");

// Validate syntax
new Function("vendetta", `return ${code}`);

const hash = crypto.createHash("sha256").update(code).digest("hex");
const manifest = {
    name: "CustomProfileEnhanced",
    description: "Locally customize profiles, including avatars, banners, Nitro appearance, badges, collectibles, connections, custom statuses and account switcher previews.",
    authors: [
        {
            name: "xVanDat",
            id: "0"
        }
    ],
    main: "index.js",
    vendetta: {
        icon: "ic_account_circle_24px"
    },
    hash
};

const manifestJson = JSON.stringify(manifest, null, 4) + "\n";

// Write to root
fs.writeFileSync(path.join(__dirname, "manifest.json"), manifestJson, "utf8");

// Also sync to CustomProfileEnhanced/ subfolder
const subDir = path.join(__dirname, "CustomProfileEnhanced");
fs.mkdirSync(subDir, { recursive: true });
fs.copyFileSync(jsPath, path.join(subDir, "index.js"));
fs.writeFileSync(path.join(subDir, "manifest.json"), manifestJson, "utf8");

console.log("Syntax OK! Updated manifest.json with SHA-256 hash:", hash);
