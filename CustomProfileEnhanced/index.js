(function (exports, metro, patcher, assets, plugin, storage, ui, utils) {
    "use strict";

    const React = metro.common.React;
    const ReactNative = metro.common.ReactNative;
    const FluxDispatcher = metro.common.FluxDispatcher;
    const { ScrollView } = ReactNative;

    const DEFAULT_GLOBAL_BADGES_SETTINGS = {
        showModStyle: "none",
        apiUrl: "https://badges.equicord.org/",
        showCustom: true,
        showNekocord: true,
        showReviewDB: true,
        showAero: true,
        showAliucord: true,
        showRaincord: true,
        showVelocity: true,
        showEnmity: true,
        showPaicord: true,
        showBunny: true,
        showGooseMod: true,
        showReplugged: true,
        showBetterDiscord: true,
        showVendroidEnhanced: true,
        showRevenge: true,
        showReCord: true
    };

    const CLIENT_MOD_OPTIONS = [
        { label: "BadgeVault", value: "showCustom" },
        { label: "Nekocord", value: "showNekocord" },
        { label: "ReviewDB", value: "showReviewDB" },
        { label: "Aero", value: "showAero" },
        { label: "Aliucord", value: "showAliucord" },
        { label: "Raincord", value: "showRaincord" },
        { label: "Velocity", value: "showVelocity" },
        { label: "Enmity", value: "showEnmity" },
        { label: "Paicord", value: "showPaicord" },
        { label: "Bunny", value: "showBunny" },
        { label: "GooseMod", value: "showGooseMod" },
        { label: "Replugged", value: "showReplugged" },
        { label: "BetterDiscord", value: "showBetterDiscord" },
        { label: "Vendroid Enhanced", value: "showVendroidEnhanced" },
        { label: "Revenge", value: "showRevenge" },
        { label: "ReCord", value: "showReCord" }
    ];

    const FLAG = {
        STAFF: 1,
        PARTNER: 2,
        HYPESQUAD: 4,
        BUG_HUNTER_1: 8,
        BRAVERY: 64,
        BRILLIANCE: 128,
        BALANCE: 256,
        EARLY_SUPPORTER: 512,
        BUG_HUNTER_2: 16384,
        DEV_VERIFIED: 131072,
        MOD_ALUMNI: 262144,
        ACTIVE_DEVELOPER: 4194304
    };

    const BADGES = [
        { key: "Staff Discord", label: "Staff Discord", flag: FLAG.STAFF, icon: "https://cdn.discordapp.com/badge-icons/5e74e9b61934fc1f67c65515d1f7e60d.png" },
        { key: "Partnered Server Owner", label: "Partnered Server Owner", flag: FLAG.PARTNER, icon: "https://cdn.discordapp.com/badge-icons/3f9748e53446a137a052f3454e2de41e.png" },
        { key: "HypeSquad Events", label: "HypeSquad Events", flag: FLAG.HYPESQUAD, icon: "https://cdn.discordapp.com/badge-icons/bf01d1073931f921909045f3a39fd264.png" },
        { key: "Bug Hunter Lvl 1", label: "Bug Hunter Lvl 1", flag: FLAG.BUG_HUNTER_1, icon: "https://cdn.discordapp.com/badge-icons/2717692c7dca7289b35297368a940dd0.png" },
        { key: "HypeSquad Bravery", label: "HypeSquad Bravery", flag: FLAG.BRAVERY, icon: "https://cdn.discordapp.com/badge-icons/8a88d63823d8a71cd5e390baa45efa02.png" },
        { key: "HypeSquad Brilliance", label: "HypeSquad Brilliance", flag: FLAG.BRILLIANCE, icon: "https://cdn.discordapp.com/badge-icons/011940fd013da3f7fb926e4a1cd2e618.png" },
        { key: "HypeSquad Balance", label: "HypeSquad Balance", flag: FLAG.BALANCE, icon: "https://cdn.discordapp.com/badge-icons/3aa41de486fa12454c3761e8e223442e.png" },
        { key: "Early Supporter", label: "Early Supporter", flag: FLAG.EARLY_SUPPORTER, icon: "https://cdn.discordapp.com/badge-icons/7060786766c9c840eb3019e725d2b358.png" },
        { key: "Former Moderator", label: "Former Moderator", flag: FLAG.MOD_ALUMNI, icon: "https://cdn.discordapp.com/badge-icons/fee1624003e2fee35cb398e125dc479b.png" },
        { key: "Bug Hunter Lvl 2", label: "Bug Hunter Lvl 2", flag: FLAG.BUG_HUNTER_2, icon: "https://cdn.discordapp.com/badge-icons/848f79194d4be5ff5f81505cbd0ce1e6.png" },
        { key: "Early Verified Bot Developer", label: "Early Verified Bot Developer", flag: FLAG.DEV_VERIFIED, icon: "https://cdn.discordapp.com/badge-icons/6df5892e0f35b051f8b61eace34f4967.png" },
        { key: "Active Developer", label: "Active Developer", flag: FLAG.ACTIVE_DEVELOPER, icon: "https://cdn.discordapp.com/badge-icons/6bdc42827a38498929a4920da12695d9.png" }
    ];

    const OLD_NAME_BADGE_ICON = "https://cdn.discordapp.com/badge-icons/6de6d34650760ba5551a79732e98ed60.png";

    const SPECIAL_BADGES = [
        { id: "quest", label: "Completed a Quest", icon: "https://cdn.discordapp.com/badge-icons/7d9ae358c8c5e118768335dbe68b4fb8.png" },
        { id: "orbs", label: "Orbs — Apprentice", icon: "https://cdn.discordapp.com/badge-icons/83d8a1eb09a8d64e59233eec5d4d5c2d.png" },
        { id: "oldname", label: "Old username", icon: OLD_NAME_BADGE_ICON },
        { id: "gifting_level", label: "Level Reached", icon: "https://cdn.discordapp.com/badge-icons/ca105ad9cfc8580c765101d17bbb2323.png" }
    ];

    const GIFTING_BADGES = [
        { id: "gifting_icon", label: "Gifting Icon", icon: "https://cdn.discordapp.com/badge-icons/64f2413c9b9803661322aaad25826b62.png" },
        { id: "gifting_patron", label: "Gifting Patron", icon: "https://cdn.discordapp.com/badge-icons/ac305d1b9481f312ce4419e7f8296558.png" },
        { id: "gifting_champion", label: "Gifting Champion", icon: "https://cdn.discordapp.com/badge-icons/8b7792c4f65953d3ff564f23429cb79e.png" },
        { id: "gifting_luminary", label: "Gifting Luminary", icon: "https://cdn.discordapp.com/badge-icons/3119f5504b2cd09576a323908c7c3517.png" },
        { id: "gifting_hero", label: "Gifting Hero", icon: "https://cdn.discordapp.com/badge-icons/77d65b1f210014a11eb1582ee06ab684.png" },
        { id: "gifting_legend", label: "Gifting Legend", icon: "https://cdn.discordapp.com/badge-icons/7fe346cfc5da1340087d8759a9e7a395.png" }
    ];

    const NITRO_LEVELS = [
        { label: "Nitro (0 months)", icon: "https://cdn.discordapp.com/badge-icons/2ba85e8026a8614b640c2837bcdfe21b.png" },
        { label: "Bronze (1 month)", icon: "https://cdn.discordapp.com/badge-icons/4f33c4a9c64ce221936bd256c356f91f.png" },
        { label: "Silver (3 months)", icon: "https://cdn.discordapp.com/badge-icons/4514fab914bdbfb4ad2fa23df76121a6.png" },
        { label: "Gold (6 months)", icon: "https://cdn.discordapp.com/badge-icons/2895086c18d5531d499862e41d1155a6.png" },
        { label: "Platinum (12 months)", icon: "https://cdn.discordapp.com/badge-icons/0334688279c8359120922938dcb1d6f8.png" },
        { label: "Diamond (24 months)", icon: "https://cdn.discordapp.com/badge-icons/0d61871f72bb9a33a7ae568c1fb4f20a.png" },
        { label: "Emerald (36 months)", icon: "https://cdn.discordapp.com/badge-icons/11e2d339068b55d3a506cff34d3780f3.png" },
        { label: "Ruby (60 months)", icon: "https://cdn.discordapp.com/badge-icons/cd5e2cfd9d7f27a8cdcd3e8a8d5dc9f4.png" },
        { label: "Opal (72 months)", icon: "https://cdn.discordapp.com/badge-icons/5b154df19c53dce2af92c9b61e6be5e2.png" }
    ];

    const BOOST_LABELS = [
        "1 Month", "2 Months", "3 Months", "6 Months",
        "9 Months", "12 Months", "15 Months", "18 Months", "24 Months"
    ];

    const BOOST_ICONS = [
        "https://cdn.discordapp.com/badge-icons/51040c70d4f20a921ad6674ff86fc95c.png",
        "https://cdn.discordapp.com/badge-icons/0e4080d1d333bc7ad29ef6528b6f2fb7.png",
        "https://cdn.discordapp.com/badge-icons/72bed924410c304dbe3d00a6e593ff59.png",
        "https://cdn.discordapp.com/badge-icons/df199d2050d3ed4ebf84d64ae83989f8.png",
        "https://cdn.discordapp.com/badge-icons/996b3e870e8a22ce519b3a50e6bdd52f.png",
        "https://cdn.discordapp.com/badge-icons/991c9f39ee33d7537d9f408c3e53141e.png",
        "https://cdn.discordapp.com/badge-icons/cb3ae83c15e970e8f3d410bc62cb8b99.png",
        "https://cdn.discordapp.com/badge-icons/7142225d31238f6387d9f09efaa02759.png",
        "https://cdn.discordapp.com/badge-icons/ec92202290b48d0879b7413d2dde3bab.png"
    ];

    const COLOR_PRESETS = [
        { label: "Blurple", hex: "#5865F2", val: 0x5865F2 },
        { label: "Green", hex: "#57F287", val: 0x57F287 },
        { label: "Yellow", hex: "#FEE75C", val: 0xFEE75C },
        { label: "Fuchsia", hex: "#EB459E", val: 0xEB459E },
        { label: "Red", hex: "#ED4245", val: 0xED4245 },
        { label: "Cyan", hex: "#00A8FC", val: 0x00A8FC },
        { label: "Dark", hex: "#2B2D31", val: 0x2B2D31 }
    ];

    const FAKE_PLATFORMS = [
        { id: "domain", label: "Domain / Website", placeholder: "example.com", defaultUrl: function (name) { return name.startsWith("http") ? name : "https://" + name; } },
        { id: "twitter", label: "X (Twitter)", placeholder: "username", defaultUrl: function (name) { return "https://x.com/" + name.replace(/^@/, ""); } },
        { id: "github", label: "GitHub", placeholder: "username", defaultUrl: function (name) { return "https://github.com/" + name; } },
        { id: "youtube", label: "YouTube", placeholder: "username", defaultUrl: function (name) { return "https://youtube.com/@" + name.replace(/^@/, ""); } },
        { id: "twitch", label: "Twitch", placeholder: "username", defaultUrl: function (name) { return "https://twitch.tv/" + name; } },
        { id: "spotify", label: "Spotify", placeholder: "username", defaultUrl: function (name) { return "https://open.spotify.com/user/" + name; } },
        { id: "tiktok", label: "TikTok", placeholder: "username", defaultUrl: function (name) { return name.startsWith("http") ? name : name.includes("tiktok.com") ? "https://" + name.replace(/^https?:\/\//, "") : "https://tiktok.com/@" + name.replace(/^@/, ""); } },
        { id: "reddit", label: "Reddit", placeholder: "username", defaultUrl: function (name) { return "https://reddit.com/user/" + name; } },
        { id: "steam", label: "Steam", placeholder: "username", defaultUrl: function (name) { return "https://steamcommunity.com/id/" + name; } },
        { id: "leagueoflegends", label: "Riot Games", placeholder: "RiotName#TAG" },
        { id: "bluesky", label: "Bluesky", placeholder: "handle.bsky.social", defaultUrl: function (name) { return "https://bsky.app/profile/" + name; } },
        { id: "paypal", label: "PayPal", placeholder: "username", defaultUrl: function (name) { return "https://paypal.me/" + name; } },
        { id: "ebay", label: "eBay", placeholder: "username" },
        { id: "crunchyroll", label: "Crunchyroll", placeholder: "username" },
        { id: "playstation", label: "PlayStation Network", placeholder: "PSN_ID" },
        { id: "xbox", label: "Xbox", placeholder: "Gamertag" },
        { id: "amazon-music", label: "Amazon Music", placeholder: "username" },
        { id: "battlenet", label: "Battle.net", placeholder: "BattleTag#1234" },
        { id: "bungie", label: "Bungie.net", placeholder: "BungieName#1234" },
        { id: "epicgames", label: "Epic Games", placeholder: "EpicUsername" },
        { id: "facebook", label: "Facebook", placeholder: "username", defaultUrl: function (name) { return "https://facebook.com/" + name; } },
        { id: "roblox", label: "Roblox", placeholder: "RobloxName" }
    ];

    const serviceMap = {
        badgevault: "BadgeVault",
        nekocord: "Nekocord",
        reviewdb: "ReviewDB",
        aero: "Aero",
        aliucord: "Aliucord",
        raincord: "Raincord",
        velocity: "Velocity",
        enmity: "Enmity",
        paicord: "Paicord",
        bunny: "Bunny",
        goosemod: "GooseMod",
        replugged: "Replugged",
        betterdiscord: "BetterDiscord",
        vendroidenhanced: "VendroidEnhanced",
        revenge: "Revenge",
        record: "ReCord",
        vencord: "Vencord",
        equicord: "Equicord"
    };
    const blockedMods = ["vencord", "equicord"];

    // ── Helpers ────────────────────────────────────────────────────────────────
    function getDecorationUrl(assetId, animated) {
        if (animated === void 0) animated = true;
        return "https://cdn.discordapp.com/media/v1/collectibles-shop/" + assetId + "/" + (animated ? "animated" : "static");
    }

    function getGiftingBadgeDesc(type) {
        switch (type) {
            case "icon": return "Gifting Icon";
            case "patron": return "Gifting Patron";
            case "champion": return "Gifting Champion";
            case "luminary": return "Gifting Luminary";
            case "hero": return "Gifting Hero";
            case "legend": return "Gifting Legend";
            default: return "";
        }
    }

    function getLevelBadgeDesc(level) {
        return "Level " + level + " Reached";
    }

    function getStandardBadgeDesc(key) {
        switch (key) {
            case "Staff Discord": return "Discord Staff";
            case "Former Moderator": return "Discord Moderator Programs Alumni";
            default: return key;
        }
    }

    function getBadgeId(key) {
        switch (key) {
            case "Staff Discord": return "staff";
            case "Partnered Server Owner": return "partner";
            case "HypeSquad Events": return "hypesquad";
            case "Bug Hunter Lvl 1": return "bug_hunter_level_1";
            case "HypeSquad Bravery": return "hypesquad_house_1";
            case "HypeSquad Brilliance": return "hypesquad_house_2";
            case "HypeSquad Balance": return "hypesquad_house_3";
            case "Early Supporter": return "early_supporter";
            case "Former Moderator": return "certified_moderator";
            case "Bug Hunter Lvl 2": return "bug_hunter_level_2";
            case "Early Verified Bot Developer": return "verified_developer";
            case "Active Developer": return "active_developer";
            default: return key.toLowerCase().replace(/ /g, "_");
        }
    }

    function normalizeBadgeId(id) {
        if (!id) return "";
        var s = id.toLowerCase();
        s = s.replace("hypesquad_online_house_", "hypesquad_house_");
        s = s.replace("premium_early_supporter", "early_supporter");
        s = s.replace("moderator_programs_alumni", "certified_moderator");
        return s;
    }

    function getBadgeIconKey(icon) {
        if (!icon) return "";
        try {
            var parts = icon.split("/");
            var last = parts.pop() || icon;
            return last.split("?")[0].replace(/\.(png|webp|jpg|svg)$/i, "");
        } catch (e) {
            return icon;
        }
    }

    function deduplicateProfileBadges(badges) {
        if (!Array.isArray(badges)) return [];
        var seenIds = new Set();
        var seenIcons = new Set();
        return badges.filter(function (b) {
            if (!b) return false;
            var rawId = b.id || b.key || "";
            var normId = normalizeBadgeId(rawId);
            var iconKey = getBadgeIconKey(b.icon || b.iconSrc || "");
            if (normId && seenIds.has(normId)) return false;
            if (iconKey && seenIcons.has(iconKey)) return false;
            if (normId) seenIds.add(normId);
            if (iconKey) seenIcons.add(iconKey);
            return true;
        });
    }

    function formatFakeConnections(fakeConns) {
        if (!Array.isArray(fakeConns) || fakeConns.length === 0) return [];
        return fakeConns.map(function (c) {
            var plat = FAKE_PLATFORMS.find(function (p) { return p.id === c.platform; }) || FAKE_PLATFORMS[0];
            var finalUrl = c.url;
            if (!finalUrl && plat.defaultUrl && c.name) {
                try { finalUrl = plat.defaultUrl(c.name); } catch (e) { }
            }
            if (!finalUrl && c.platform === "domain" && c.name) {
                finalUrl = c.name.startsWith("http") ? c.name : "https://" + c.name + "/";
            }
            var obj = {
                type: c.platform,
                id: c.name || "connection",
                name: c.name,
                verified: true,
                visibility: 1,
                showActivity: false,
                show_activity: false,
                friendSync: false,
                friend_sync: false,
                metadataVisibility: 0,
                metadata_visibility: 0,
                twoWayLink: false,
                two_way_link: false,
                metadata: {}
            };
            if (finalUrl) obj.url = finalUrl;
            return obj;
        });
    }

    function formatNitroBadgeDesc(d) {
        var dateObj = typeof d === "string" ? new Date(d) : d;
        if (!dateObj || isNaN(dateObj.getTime())) return "Subscriber since";
        var month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        var day = dateObj.getDate().toString().padStart(2, "0");
        var yy = dateObj.getFullYear().toString().slice(-2);
        return "Subscriber since " + month + "/" + day + "/" + yy;
    }

    function formatBoostBadgeDesc(d) {
        var dateObj = typeof d === "string" ? new Date(d) : d;
        if (!dateObj || isNaN(dateObj.getTime())) return "Server boosting since";
        var day = dateObj.getDate();
        var year = dateObj.getFullYear();
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var month = months[dateObj.getMonth()] || "Jan";
        return "Server boosting since " + month + " " + day + ", " + year;
    }

    function getAsset(name, fallback) {
        return assets.getAssetIDByName(name) || (fallback ? assets.getAssetIDByName(fallback) : undefined);
    }

    function showToastMsg(msg, iconName) {
        try {
            ui.toasts.showToast(msg, iconName ? getAsset(iconName) : undefined);
        } catch (e) { }
    }

    // ── Stores & Metro Finders ────────────────────────────────────────────────
    function getUserStore() {
        return metro.findByStoreName("UserStore") || metro.findByProps("getCurrentUser", "getUser");
    }
    function getUserProfileStore() {
        return metro.findByStoreName("UserProfileStore") || metro.findByProps("getUserProfile", "getGuildMemberProfile");
    }
    function getGuildMemberStore() {
        return metro.findByStoreName("GuildMemberStore") || metro.findByProps("getMember", "getMembers");
    }
    function getPresenceStore() {
        return metro.findByStoreName("PresenceStore") || metro.findByProps("getActivities", "getStatus");
    }
    function getAuthenticationStore() {
        return metro.findByStoreName("AuthenticationStore") || metro.findByProps("getId", "getSessionId");
    }
    function getIconUtils() {
        return metro.findByProps("getUserAvatarURL", "getDefaultAvatarURL") || metro.findByProps("getUserAvatarURL");
    }
    function getSnowflakeUtils() {
        return metro.findByProps("extractTimestamp");
    }
    function getRestAPI() {
        return metro.findByProps("get", "post", "put", "patch", "del") || (metro.findByProps("HTTP") && metro.findByProps("HTTP").HTTP);
    }

    // ── Collectible SKU Resolution ────────────────────────────────────────────
    var mergedCollectiblesCache = new WeakMap();
    var emptyCollectiblesCache = new Map();

    function isRecord(v) {
        return typeof v === "object" && v !== null;
    }
    function readString(rec, camel, snake) {
        if (snake === void 0) snake = camel;
        var v = rec[camel] !== undefined ? rec[camel] : rec[snake];
        return (typeof v === "string" || typeof v === "number") ? String(v) : undefined;
    }
    function readNumber(rec, camel, snake) {
        var v = rec[camel] !== undefined ? rec[camel] : rec[snake];
        return (typeof v === "number" && Number.isFinite(v)) ? v : undefined;
    }
    function normalizeLayer(value) {
        if (!isRecord(value)) return null;
        var id = readString(value, "id");
        var type = value.type;
        var order = value.order;
        var anchor = value.anchor;
        if (!id || type == null || order == null || anchor == null) return null;
        var out = { id: id, type: type, order: order, anchor: anchor };
        if (typeof value.responsive === "boolean") out.responsive = value.responsive;
        return out;
    }
    function normalizeFrame(value, requestedSkuId) {
        if (!isRecord(value) || value.type !== 3 || !Array.isArray(value.layers)) return null;
        var skuId = readString(value, "skuId", "sku_id") || requestedSkuId;
        if (skuId !== requestedSkuId) return null;
        var layers = value.layers.map(normalizeLayer);
        if (layers.length === 0 || layers.some(function (l) { return l == null; })) return null;
        var innerWidth = readNumber(value, "innerWidth", "inner_width");
        var overflowTop = readNumber(value, "overflowTop", "overflow_top");
        var overflowBottom = readNumber(value, "overflowBottom", "overflow_bottom");
        var overflowHorizontal = readNumber(value, "overflowHorizontal", "overflow_horizontal");
        if (innerWidth == null || overflowTop == null || overflowBottom == null || overflowHorizontal == null) return null;
        return {
            skuId: skuId,
            label: readString(value, "label") || "Profile Frame",
            layers: layers,
            innerWidth: innerWidth,
            overflowTop: overflowTop,
            overflowBottom: overflowBottom,
            overflowHorizontal: overflowHorizontal,
            expiresAt: null,
            type: 3
        };
    }
    function normalizeAvatarDecoration(value, requestedSkuId) {
        if (!isRecord(value) || value.type !== 0) return null;
        var skuId = readString(value, "skuId", "sku_id") || requestedSkuId;
        var asset = readString(value, "asset");
        if (skuId !== requestedSkuId || !asset) return null;
        return { skuId: skuId, asset: asset, expiresAt: null, expires_at: null, type: 0 };
    }
    function normalizeProfileEffect(value, requestedSkuId) {
        if (!isRecord(value) || value.type !== 1) return null;
        var skuId = readString(value, "skuId", "sku_id") || requestedSkuId;
        if (skuId !== requestedSkuId) return null;
        return {
            skuId: skuId,
            title: readString(value, "title"),
            description: readString(value, "description"),
            accessibilityLabel: readString(value, "accessibilityLabel", "accessibility_label"),
            reducedMotionSrc: readString(value, "reducedMotionSrc", "reduced_motion_src"),
            thumbnailPreviewSrc: readString(value, "thumbnailPreviewSrc", "thumbnail_preview_src"),
            staticFrameSrc: readString(value, "staticFrameSrc", "static_frame_src"),
            effects: Array.isArray(value.effects) ? value.effects : undefined,
            animationType: readNumber(value, "animationType", "animation_type"),
            expiresAt: null,
            expireAt: null,
            type: 1
        };
    }
    function normalizeNameplate(value, requestedSkuId) {
        if (!isRecord(value) || value.type !== 2) return null;
        var skuId = readString(value, "skuId", "sku_id") || requestedSkuId;
        var asset = readString(value, "asset");
        var palette = readString(value, "palette");
        if (skuId !== requestedSkuId || !asset || !palette) return null;
        return {
            skuId: skuId,
            asset: asset,
            label: readString(value, "label") || "Nameplate",
            palette: palette,
            expiresAt: null,
            expires_at: null,
            type: 2
        };
    }
    function findCollectible(value, requestedSkuId, normalize, visited) {
        if (!visited) visited = new Set();
        if (!isRecord(value) || visited.has(value)) return null;
        visited.add(value);
        var direct = normalize(value, requestedSkuId);
        if (direct) return direct;
        var keys = ["items", "variants", "bundledProducts", "bundled_products"];
        for (var i = 0; i < keys.length; i++) {
            var children = value[keys[i]];
            if (!Array.isArray(children)) continue;
            for (var j = 0; j < children.length; j++) {
                var c = findCollectible(children[j], requestedSkuId, normalize, visited);
                if (c) return c;
            }
        }
        return null;
    }
    async function resolveCollectible(skuId, normalize) {
        if (!/^\d+$/.test(skuId)) return null;
        var RestAPI = getRestAPI();
        if (!RestAPI || !RestAPI.get) return null;
        var response = await RestAPI.get({ url: "/collectibles-products/" + skuId, retries: 2 });
        return findCollectible(response && response.body, skuId, normalize);
    }
    function extractSkuId(value) {
        var linkMatch = value.match(/[?&#]itemSkuId=(\d+)/i);
        if (linkMatch) return linkMatch[1];
        var skuMatch = value.match(/\b\d{15,22}\b/);
        return skuMatch ? skuMatch[0] : undefined;
    }
    function parseSkuInput(value) {
        return extractSkuId(value) || (value.replace(/\D/g, "") || undefined);
    }
    function withCollectibles(original, frame, nameplate) {
        if (isRecord(original)) {
            var cached = mergedCollectiblesCache.get(original);
            if (cached && cached.frame === frame && cached.nameplate === nameplate) return cached.value;
            var value = Object.assign({}, original);
            if (frame) {
                value.profileFrame = frame;
                value.profile_frame = frame;
            }
            if (nameplate) value.nameplate = nameplate;
            mergedCollectiblesCache.set(original, { frame: frame, nameplate: nameplate, value: value });
            return value;
        }
        var cacheKey = (frame ? frame.skuId : "") + ":" + (nameplate ? nameplate.skuId : "");
        if (emptyCollectiblesCache.has(cacheKey)) return emptyCollectiblesCache.get(cacheKey);
        var val = {};
        if (frame) {
            val.profileFrame = frame;
            val.profile_frame = frame;
        }
        if (nameplate) val.nameplate = nameplate;
        emptyCollectiblesCache.set(cacheKey, val);
        return val;
    }

    // ── State & Storage ───────────────────────────────────────────────────────
    var storedData = {};
    var isEnabled = false;
    var allAccountsData = {};
    var allAccountsEnabled = {};
    var globalBadgesSettings = Object.assign({}, DEFAULT_GLOBAL_BADGES_SETTINGS);
    var GlobalBadgesState = {};
    var statuses = {};
    var activities = new Map();
    var mergedActivities = new WeakMap();
    var fakeAccounts = [];
    var activeFakeId = null;
    var realUserSnapshot = null;
    var _dataVersion = 0;
    var _cachedMyId = null;

    function getMyUserId() {
        try {
            var authId = getAuthenticationStore() && getAuthenticationStore().getId && getAuthenticationStore().getId();
            if (authId) {
                _cachedMyId = authId;
                return authId;
            }
        } catch (e) { }
        try {
            var u = getUserStore() && getUserStore().getCurrentUser && getUserStore().getCurrentUser();
            if (u && u.id) {
                _cachedMyId = u.id;
                return u.id;
            }
        } catch (e) { }
        return _cachedMyId || "";
    }

    function isMe(userId) {
        if (!userId) return false;
        if (_cachedMyId && _cachedMyId === userId) return true;
        var myId = getMyUserId();
        return Boolean(myId && myId === userId);
    }

    function getCustomDataForUser(userId) {
        if (!userId) return null;
        if (allAccountsData[userId] && allAccountsEnabled[userId] !== false) {
            return { data: allAccountsData[userId], enabled: true };
        }
        if (isMe(userId) && isEnabled) {
            return { data: storedData, enabled: true };
        }
        return null;
    }

    function saveDataToStorage() {
        try {
            plugin.storage.storedData = Object.assign({}, storedData);
            plugin.storage.isEnabled = isEnabled;
            plugin.storage.allAccountsData = Object.assign({}, allAccountsData);
            plugin.storage.allAccountsEnabled = Object.assign({}, allAccountsEnabled);
            plugin.storage.globalBadgesSettings = Object.assign({}, globalBadgesSettings);
            plugin.storage.customStatuses = Object.assign({}, statuses);
            plugin.storage.fakeAccountIds = fakeAccounts.map(function (f) { return f.id; });
        } catch (e) { }
    }

    function syncCurrentUserData(forcedId) {
        var myId = forcedId || getMyUserId();
        if (myId) {
            _cachedMyId = myId;
            if (allAccountsData[myId]) {
                storedData = allAccountsData[myId];
                isEnabled = allAccountsEnabled[myId] !== false;
            } else if (allAccountsData[""]) {
                storedData = allAccountsData[""];
                isEnabled = allAccountsEnabled[""] !== false;
                allAccountsData[myId] = storedData;
                allAccountsEnabled[myId] = isEnabled;
                delete allAccountsData[""];
                delete allAccountsEnabled[""];
                saveDataToStorage();
            } else {
                storedData = {};
                isEnabled = false;
            }
        }
    }

    function loadDataFromStorage() {
        try {
            plugin.storage.storedData = plugin.storage.storedData || {};
            plugin.storage.isEnabled = plugin.storage.isEnabled ?? false;
            plugin.storage.allAccountsData = plugin.storage.allAccountsData || {};
            plugin.storage.allAccountsEnabled = plugin.storage.allAccountsEnabled || {};
            plugin.storage.globalBadgesSettings = Object.assign({}, DEFAULT_GLOBAL_BADGES_SETTINGS, plugin.storage.globalBadgesSettings || {});
            plugin.storage.customStatuses = plugin.storage.customStatuses || {};
            plugin.storage.fakeAccountIds = plugin.storage.fakeAccountIds || [];

            allAccountsData = Object.assign({}, plugin.storage.allAccountsData);
            allAccountsEnabled = Object.assign({}, plugin.storage.allAccountsEnabled);
            storedData = Object.assign({}, plugin.storage.storedData);
            isEnabled = Boolean(plugin.storage.isEnabled);
            globalBadgesSettings = Object.assign({}, DEFAULT_GLOBAL_BADGES_SETTINGS, plugin.storage.globalBadgesSettings);
            statuses = Object.assign({}, plugin.storage.customStatuses);
            syncCurrentUserData();
        } catch (e) { }
    }

    function resetCustomProfileCache() {
        _dataVersion++;
        syncStaffSpoof();
    }

    function forceAccountPanelRerender() {
        try {
            var US = getUserStore();
            var UPS = getUserProfileStore();
            if (US && US.emitChange) US.emitChange();
            if (UPS && UPS.emitChange) UPS.emitChange();
            var MAS = metro.findByProps("getUsers", "getValidUsers");
            if (MAS && MAS.emitChange) MAS.emitChange();
            var myId = getMyUserId();
            if (myId && FluxDispatcher && FluxDispatcher.dispatch) {
                FluxDispatcher.dispatch({ type: "USER_UPDATE", user: { id: myId } });
            }
        } catch (e) { }
    }

    // ── Global Badges ─────────────────────────────────────────────────────────
    async function loadBadges(apiUrl, settingsStore) {
        if (!apiUrl) return;
        try {
            var url = apiUrl.endsWith("/") ? apiUrl + "users" : apiUrl + "/users";
            var fetchFn = (utils && utils.safeFetch) ? utils.safeFetch : fetch;
            var res = await fetchFn(url, { cache: "no-store" });
            var globalBadges = await res.json();
            var filteredUsers = {};
            var enabledMods = {
                aero: settingsStore.showAero,
                velocity: settingsStore.showVelocity,
                badgevault: settingsStore.showCustom,
                nekocord: settingsStore.showNekocord,
                reviewdb: settingsStore.showReviewDB,
                aliucord: settingsStore.showAliucord,
                raincord: settingsStore.showRaincord,
                enmity: settingsStore.showEnmity,
                paicord: settingsStore.showPaicord,
                bunny: settingsStore.showBunny,
                goosemod: settingsStore.showGooseMod,
                replugged: settingsStore.showReplugged,
                betterdiscord: settingsStore.showBetterDiscord,
                vendroidenhanced: settingsStore.showVendroidEnhanced,
                revenge: settingsStore.showRevenge,
                record: settingsStore.showReCord
            };

            if (globalBadges && globalBadges.users) {
                for (var key in globalBadges.users) {
                    filteredUsers[key] = (globalBadges.users[key] || []).filter(function (b) {
                        var mod = b && b.mod;
                        if (!mod || blockedMods.indexOf(mod) !== -1) return false;
                        if (enabledMods[mod] === false) return false;
                        return true;
                    }).map(function (b) {
                        var modFormatted = serviceMap[b.mod] || b.mod;
                        var prefix = settingsStore.showModStyle === "prefix" ? (modFormatted + " - ") : "";
                        var suffix = settingsStore.showModStyle === "suffix" ? (" - " + modFormatted) : "";
                        var tooltip = prefix + b.tooltip + suffix;
                        return Object.assign({}, b, { key: b.tooltip, tooltip: tooltip });
                    });
                }
            }
            GlobalBadgesState = filteredUsers;
        } catch (e) { }
    }

    function getGlobalBadgesList(userId) {
        return (GlobalBadgesState[userId] || []).map(function (badge, idx) {
            return {
                id: "global_badges_badge_" + userId + "_" + idx,
                iconSrc: badge.badge,
                description: badge.tooltip
            };
        });
    }

    // ── Local Custom Statuses ─────────────────────────────────────────────────
    var origGetActivities = null;
    var patchedGetActivities = null;

    function rebuildActivities() {
        activities = new Map(Object.entries(statuses).map(function (entry) {
            return [
                entry[0],
                {
                    id: "custom",
                    name: "Custom Status",
                    type: 4,
                    state: entry[1].text,
                    flags: 0
                }
            ];
        }));
        mergedActivities = new WeakMap();
    }

    function saveStatus(userId, text) {
        var trimmed = (text || "").trim().slice(0, 128);
        if (!trimmed) {
            deleteStatus(userId);
            return;
        }
        statuses = Object.assign({}, statuses);
        statuses[userId] = { text: trimmed };
        rebuildActivities();
        saveDataToStorage();
        var PS = getPresenceStore();
        if (PS && PS.emitChange) PS.emitChange();
    }

    function deleteStatus(userId) {
        var next = Object.assign({}, statuses);
        delete next[userId];
        statuses = next;
        rebuildActivities();
        saveDataToStorage();
        var PS = getPresenceStore();
        if (PS && PS.emitChange) PS.emitChange();
    }

    function promptLocalCustomStatusModal(user) {
        if (!user || !user.id) return;
        var existing = (statuses[user.id] && statuses[user.id].text) || "";
        var display = user.globalName || user.username || user.id;
        ui.alerts.showInputAlert({
            title: "Local Custom Status (" + display + ")",
            placeholder: "Enter custom status (leave empty to remove)...",
            initialValue: existing,
            confirmText: "Save",
            cancelText: "Cancel",
            onConfirm: function (val) {
                if (!val || !val.trim()) {
                    deleteStatus(user.id);
                    showToastMsg("Removed local custom status for " + display, "TrashIcon");
                } else {
                    saveStatus(user.id, val);
                    showToastMsg("Saved local custom status for " + display, "Check");
                }
            }
        });
    }

    function initCustomStatuses() {
        rebuildActivities();
        var PS = getPresenceStore();
        if (!PS || origGetActivities || typeof PS.getActivities !== "function") return;
        origGetActivities = PS.getActivities;
        patchedGetActivities = function (userId, guildId) {
            var currentActivities = origGetActivities.call(PS, userId, guildId) || [];
            var customStatus = activities.get(userId);
            if (!customStatus) return currentActivities;
            var status = PS.getStatus ? PS.getStatus(userId, guildId) : "online";
            if (status && status !== "online" && status !== "idle" && status !== "dnd") return currentActivities;
            var perUser = mergedActivities.get(currentActivities);
            if (perUser && perUser.has(userId)) return perUser.get(userId);
            var merged = currentActivities.filter(function (a) { return a && a.type !== 4; });
            merged.push(customStatus);
            if (!perUser) {
                perUser = new Map();
                mergedActivities.set(currentActivities, perUser);
            }
            perUser.set(userId, merged);
            return merged;
        };
        PS.getActivities = patchedGetActivities;
        if (PS.emitChange) PS.emitChange();
    }

    function stopCustomStatuses() {
        var PS = getPresenceStore();
        if (PS && origGetActivities && PS.getActivities === patchedGetActivities) {
            PS.getActivities = origGetActivities;
        }
        origGetActivities = null;
        patchedGetActivities = null;
        activities.clear();
        mergedActivities = new WeakMap();
        if (PS && PS.emitChange) PS.emitChange();
    }

    // ── Fake Account Switcher ─────────────────────────────────────────────────
    var _masStore = null;
    var _origGetUsers = null;
    var _origGetValidUsers = null;

    function patchMultiAccountStore() {
        if (!_masStore || _origGetUsers) return;
        _origGetUsers = _masStore.getUsers.bind(_masStore);
        _origGetValidUsers = _masStore.getValidUsers ? _masStore.getValidUsers.bind(_masStore) : function () { return []; };

        function applyCustomName(u) {
            if (!u || !u.id) return u;
            var cData = allAccountsData[u.id];
            var cEnabled = allAccountsEnabled[u.id];
            if (!cData || !cEnabled) return u;
            var patched = Object.assign({}, u);
            if (cData.username) {
                patched.username = cData.username;
                patched.legacyUsername = cData.username;
            }
            if (cData.globalName) patched.globalName = cData.globalName;
            if (cData.avatar) patched.avatar = cData.avatar;
            return patched;
        }

        _masStore.getUsers = function () {
            var real = _origGetUsers() || [];
            var realIds = new Set(real.map(function (u) { return u.id; }));
            var extras = fakeAccounts.filter(function (f) { return !realIds.has(f.id); }).map(function (f) {
                return {
                    id: f.id,
                    username: f.username,
                    globalName: f.globalName || f.username,
                    discriminator: f.discriminator || "0",
                    avatar: f.avatar || null,
                    tokenStatus: 2,
                    pushSyncToken: null
                };
            });
            return real.map(applyCustomName).concat(extras);
        };

        _masStore.getValidUsers = function () {
            var real = _origGetValidUsers() || [];
            var realIds = new Set(real.map(function (u) { return u.id; }));
            var extras = fakeAccounts.filter(function (f) { return !realIds.has(f.id); }).map(function (f) {
                return {
                    id: f.id,
                    username: f.username,
                    globalName: f.globalName || f.username,
                    discriminator: f.discriminator || "0",
                    avatar: f.avatar || null,
                    tokenStatus: 2,
                    pushSyncToken: null
                };
            });
            return real.map(applyCustomName).concat(extras);
        };

        _masStore.getHasLoggedInAccounts = function () { return true; };
    }

    function unpatchMultiAccountStore() {
        if (!_masStore || !_origGetUsers) return;
        _masStore.getUsers = _origGetUsers;
        if (_origGetValidUsers) _masStore.getValidUsers = _origGetValidUsers;
        _origGetUsers = null;
        _origGetValidUsers = null;
        if (_masStore.emitChange) _masStore.emitChange();
    }

    function simulateSwitch(fake) {
        var US = getUserStore();
        var me = US && US.getCurrentUser && US.getCurrentUser();
        if (!me) return;
        if (!realUserSnapshot) {
            realUserSnapshot = {
                username: me.username,
                globalName: me.globalName || me.username,
                avatar: me.avatar,
                banner: me.banner || null,
                bio: me.bio || "",
                accentColor: me.accentColor || null,
                discriminator: me.discriminator || "0",
                publicFlags: me.publicFlags || 0,
                flags: me.flags || 0,
                premiumType: me.premiumType || 0
            };
        }
        activeFakeId = fake.id;
        var cData = allAccountsData[fake.id];
        var username = (cData && cData.username) || fake.username;
        var globalName = (cData && cData.globalName) || fake.globalName || username;
        var avatar = (cData && cData.avatar) || fake.avatar || null;
        var banner = ((cData && cData.nitro) ? cData.banner : null) || fake._banner || null;
        var bio = (cData && cData.bio) || fake._bio || "";
        var accentColor = (cData && cData.accentColor !== undefined) ? cData.accentColor : (fake._accentColor || null);
        var premiumType = (cData && cData.nitro) ? 2 : (fake._premiumType || 0);

        FluxDispatcher.dispatch({
            type: "USER_UPDATE",
            user: {
                id: me.id,
                username: username,
                global_name: globalName,
                avatar: avatar,
                banner: banner,
                bio: bio,
                accent_color: accentColor,
                discriminator: fake.discriminator || "0",
                public_flags: fake._publicFlags || 0,
                flags: fake._flags || 0,
                premium_type: premiumType
            }
        });
        if (_masStore && _masStore.emitChange) _masStore.emitChange();
        showToastMsg("Switched preview to " + (globalName || username), "Check");
    }

    function restoreRealAccount() {
        if (!realUserSnapshot) return;
        var US = getUserStore();
        var me = US && US.getCurrentUser && US.getCurrentUser();
        if (!me) return;
        FluxDispatcher.dispatch({
            type: "USER_UPDATE",
            user: {
                id: me.id,
                username: realUserSnapshot.username,
                global_name: realUserSnapshot.globalName,
                avatar: realUserSnapshot.avatar || null,
                banner: realUserSnapshot.banner || null,
                bio: realUserSnapshot.bio || "",
                accent_color: realUserSnapshot.accentColor || null,
                discriminator: realUserSnapshot.discriminator || "0",
                public_flags: realUserSnapshot.publicFlags || 0,
                flags: realUserSnapshot.flags || 0,
                premium_type: realUserSnapshot.premiumType || 0
            }
        });
        activeFakeId = null;
        realUserSnapshot = null;
        if (_masStore && _masStore.emitChange) _masStore.emitChange();
        showToastMsg("Restored real account", "Check");
    }

    function addToSwitcher(userId) {
        if (!userId || fakeAccounts.some(function (f) { return f.id === userId; })) return;
        var US = getUserStore();
        var UPS = getUserProfileStore();
        var user = US && US.getUser && US.getUser(userId);
        var profile = (UPS && UPS.getUserProfile && UPS.getUserProfile(userId)) || {};
        var username = (user && user.username) || ("User_" + userId.slice(-4));
        fakeAccounts.push({
            id: userId,
            username: username,
            globalName: (user && user.globalName) || username,
            discriminator: (user && user.discriminator) || "0",
            avatar: (user && user.avatar) || null,
            bot: Boolean(user && user.bot),
            _bio: profile.bio || "",
            _banner: profile.banner || null,
            _accentColor: profile.accentColor || null,
            _publicFlags: (user && user.publicFlags) || 0,
            _flags: (user && user.flags) || 0,
            _premiumType: (user && user.premiumType) || 0
        });
        saveDataToStorage();
        patchMultiAccountStore();
        if (_masStore && _masStore.emitChange) _masStore.emitChange();
        showToastMsg("Added " + ((user && user.globalName) || username) + " to Switcher", "Check");
    }

    function removeFromSwitcher(userId) {
        var idx = fakeAccounts.findIndex(function (f) { return f.id === userId; });
        if (idx === -1) return;
        if (activeFakeId === userId) restoreRealAccount();
        fakeAccounts.splice(idx, 1);
        saveDataToStorage();
        if (_masStore && _masStore.emitChange) _masStore.emitChange();
    }

    function onSwitchEvent(action) {
        var userId = action && (action.userId || action.user_id || action.id);
        var fake = fakeAccounts.find(function (f) { return f.id === userId; });
        if (fake) simulateSwitch(fake);
    }
    function onRemoveAccountEvent(action) {
        var userId = action && (action.userId || action.user_id || action.id);
        if (userId) removeFromSwitcher(userId);
    }

    function initFakeAccount() {
        FluxDispatcher.subscribe("MULTI_ACCOUNT_SWITCH_FAILURE", onSwitchEvent);
        FluxDispatcher.subscribe("MULTI_ACCOUNT_SWITCH_ATTEMPT", onSwitchEvent);
        FluxDispatcher.subscribe("MULTI_ACCOUNT_REMOVE_ACCOUNT", onRemoveAccountEvent);
        var mod = metro.findByProps("getUsers", "getValidUsers", "getHasLoggedInAccounts") || metro.findByStoreName("MultiAccountStore");
        if (mod && typeof mod.getUsers === "function") {
            _masStore = mod;
        }
        var savedIds = (plugin.storage && plugin.storage.fakeAccountIds) || [];
        var US = getUserStore();
        var UPS = getUserProfileStore();
        for (var i = 0; i < savedIds.length; i++) {
            var id = savedIds[i];
            if (fakeAccounts.some(function (f) { return f.id === id; })) continue;
            var user = US && US.getUser && US.getUser(id);
            var profile = (UPS && UPS.getUserProfile && UPS.getUserProfile(id)) || {};
            var username = (user && user.username) || ("User_" + String(id).slice(-4));
            fakeAccounts.push({
                id: id,
                username: username,
                globalName: (user && user.globalName) || username,
                discriminator: (user && user.discriminator) || "0",
                avatar: (user && user.avatar) || null,
                bot: Boolean(user && user.bot),
                _bio: profile.bio || "",
                _banner: profile.banner || null,
                _accentColor: profile.accentColor || null,
                _publicFlags: (user && user.publicFlags) || 0,
                _flags: (user && user.flags) || 0,
                _premiumType: (user && user.premiumType) || 0
            });
        }
        if (_masStore) {
            patchMultiAccountStore();
            if (_masStore.emitChange) _masStore.emitChange();
        }
    }

    function cleanupFakeAccount() {
        FluxDispatcher.unsubscribe("MULTI_ACCOUNT_SWITCH_FAILURE", onSwitchEvent);
        FluxDispatcher.unsubscribe("MULTI_ACCOUNT_SWITCH_ATTEMPT", onSwitchEvent);
        FluxDispatcher.unsubscribe("MULTI_ACCOUNT_REMOVE_ACCOUNT", onRemoveAccountEvent);
        if (activeFakeId) restoreRealAccount();
        fakeAccounts = [];
        unpatchMultiAccountStore();
        _masStore = null;
    }

    // ── Staff Spoof ───────────────────────────────────────────────────────────
    var patchedProto = null;
    var origIsStaff = null;
    var origIsStaffPersonal = null;
    var origHasAnyStaffLevel = null;
    var origHasFlag = null;

    function isLocalStaff(user) {
        if (!user || !user.id) return false;
        var custom = getCustomDataForUser(user.id);
        return Boolean(custom && custom.enabled && ((custom.data.badgeFlags || 0) & 1));
    }

    function syncStaffSpoof() {
        try {
            var US = getUserStore();
            if (US && US.emitChange) US.emitChange();
        } catch (e) { }
    }

    function installStaffSpoof(getRawCurrentUser) {
        try {
            var u = getRawCurrentUser && getRawCurrentUser();
            var proto = u && Object.getPrototypeOf(u);
            if (!proto || patchedProto) return;
            patchedProto = proto;
            if (proto.isStaff) {
                origIsStaff = proto.isStaff;
                proto.isStaff = function () { return isLocalStaff(this) || origIsStaff.apply(this, arguments); };
            }
            if (proto.isStaffPersonal) {
                origIsStaffPersonal = proto.isStaffPersonal;
                proto.isStaffPersonal = function () { return isLocalStaff(this) || origIsStaffPersonal.apply(this, arguments); };
            }
            if (proto.hasAnyStaffLevel) {
                origHasAnyStaffLevel = proto.hasAnyStaffLevel;
                proto.hasAnyStaffLevel = function () { return isLocalStaff(this) || origHasAnyStaffLevel.apply(this, arguments); };
            }
            if (proto.hasFlag) {
                origHasFlag = proto.hasFlag;
                proto.hasFlag = function (flag) {
                    if (isLocalStaff(this) && (flag & 1)) {
                        return flag === 1 || origHasFlag.call(this, flag & ~1);
                    }
                    return origHasFlag.apply(this, arguments);
                };
            }
        } catch (e) { }
    }

    function uninstallStaffSpoof() {
        if (!patchedProto) return;
        if (origIsStaff) patchedProto.isStaff = origIsStaff;
        if (origIsStaffPersonal) patchedProto.isStaffPersonal = origIsStaffPersonal;
        if (origHasAnyStaffLevel) patchedProto.hasAnyStaffLevel = origHasAnyStaffLevel;
        if (origHasFlag) patchedProto.hasFlag = origHasFlag;
        patchedProto = null;
        origIsStaff = null;
        origIsStaffPersonal = null;
        origHasAnyStaffLevel = null;
        origHasFlag = null;
    }

    // ── Store Hooks & Profile Spoofing ────────────────────────────────────────
    var proxyUserCache = new WeakMap();
    var profileCache = new WeakMap();
    var badgePropsCache = new Map();
    var unpatches = [];

    var _origGetCurrentUser = null;
    var _origGetUser = null;
    var _origGetUserAvatarURL = null;
    var _origGetUserAvatarSource = null;
    var _origGetUserBannerURL = null;
    var _origExtractTimestamp = null;
    var _origGetMember = null;
    var _origGetUserProfile = null;
    var _origGetGuildMemberProfile = null;
    var _origGetAccounts = null;
    var _origDecoURL = null;

    var NITRO_LEVEL_MIN_MONTHS = [0, 1, 3, 6, 12, 24, 36, 60, 72];
    var NITRO_LEVEL_MAX_MONTHS = [1, 3, 6, 12, 24, 36, 60, 72, 108];
    var BOOST_LEVEL_MIN_MONTHS = [1, 2, 3, 6, 9, 12, 15, 18, 24];
    var BOOST_LEVEL_MAX_MONTHS = [2, 3, 6, 9, 12, 15, 18, 24, 48];

    function seededFraction(seed) {
        var h = 2166136261 >>> 0;
        for (var i = 0; i < seed.length; i++) {
            h ^= seed.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return (h >>> 0) / 4294967295;
    }

    function computeFakeSinceDate(minMonths, maxMonths, seed) {
        var now = new Date();
        var AVG = 30.4368;
        var minDays = Math.round(minMonths * AVG);
        var maxDays = Math.round(maxMonths * AVG) - 1;
        if (maxDays <= minDays) maxDays = minDays + 1;
        var frac = seededFraction(seed + ":" + minMonths + ":" + maxMonths);
        var totalDays = minDays + Math.floor(frac * (maxDays - minDays + 1));
        var d = new Date(now);
        d.setDate(d.getDate() - totalDays);
        if (d.getTime() >= now.getTime()) d.setTime(now.getTime() - 86400000);
        return d;
    }

    function getFakeNitroDate(level, seedBase) {
        var min = NITRO_LEVEL_MIN_MONTHS[level] ?? 1;
        var max = NITRO_LEVEL_MAX_MONTHS[level] ?? (min + 24);
        return computeFakeSinceDate(min, max, seedBase + ":nitro:" + level + ":" + min + ":" + max);
    }

    function getFakeBoostDate(boostIdx, seedBase) {
        var min = BOOST_LEVEL_MIN_MONTHS[boostIdx] ?? 1;
        var max = BOOST_LEVEL_MAX_MONTHS[boostIdx] ?? (min + 12);
        return computeFakeSinceDate(min, max, seedBase + ":boost:" + boostIdx + ":" + min + ":" + max);
    }

    function cleanMerge(original, overrides) {
        if (!original) return original;
        var clone = Object.create(Object.getPrototypeOf(original));
        var origKeys = Reflect.ownKeys(original);
        for (var i = 0; i < origKeys.length; i++) {
            var k = origKeys[i];
            var desc = Object.getOwnPropertyDescriptor(original, k);
            if (desc) Object.defineProperty(clone, k, desc);
        }
        var overKeys = Reflect.ownKeys(overrides);
        for (var j = 0; j < overKeys.length; j++) {
            var ok = overKeys[j];
            var oDesc = Object.getOwnPropertyDescriptor(overrides, ok);
            if (oDesc) Object.defineProperty(clone, ok, oDesc);
        }
        return clone;
    }

    function fakeCurrentUser(user, customData) {
        var data = customData || storedData;
        if (!user || !data) return user;
        if (!customData && (!isEnabled || !isMe(user.id))) return user;

        var cached = proxyUserCache.get(user);
        if (cached && cached.data === data && cached.version === _dataVersion) return cached.proxy;

        var proxy = new Proxy(user, {
            get: function (target, prop, receiver) {
                var desc = Object.getOwnPropertyDescriptor(target, prop);
                if (desc && !desc.configurable) return Reflect.get(target, prop, target);

                if (prop === "__cp_isClone") return true;
                if (prop === "username" || prop === "legacyUsername") return data.username ? data.username : target.username;
                if (prop === "globalName") return data.globalName ? data.globalName : target.globalName;
                if (prop === "displayName") return data.globalName || target.displayName || target.globalName || target.username;
                if (prop === "email") return data.email ? data.email : target.email;
                if (prop === "phone") return data.phone ? data.phone : target.phone;
                if (prop === "createdAt") return data.createdAt ? new Date(data.createdAt + "T12:00:00Z") : target.createdAt;
                if (prop === "getAvatarURL" && data.avatar) return function () { return data.avatar; };
                if (prop === "getAvatarSource" && data.avatar) return function () { return { uri: data.avatar }; };
                if (prop === "avatarDecoration") return data.decorationAsset ? null : target.avatarDecoration;
                if (prop === "avatarDecorationData") {
                    if (data.avatarDecoration) return data.avatarDecoration;
                    if (data.decorationAsset) return { asset: data.decorationAsset, skuId: data.decorationSkuId || data.decorationAsset };
                    return target.avatarDecorationData;
                }
                if (prop === "collectibles" && (data.profileFrame || data.nameplate)) {
                    return withCollectibles(target.collectibles, data.profileFrame, data.nameplate);
                }
                if ((prop === "profileFrame" || prop === "profileFrameData") && data.profileFrame) return data.profileFrame;
                if (prop === "nameplate" && data.nameplate) return data.nameplate;
                if (prop === "publicFlags") return data.badgeFlags != null ? data.badgeFlags : target[prop];
                if (prop === "flags" && data.badgeFlags != null) return (target.flags & ~1) | (data.badgeFlags & 1);
                if (prop === "premiumType") return data.nitro ? 2 : target.premiumType;
                if (prop === "premiumSince") {
                    if (data.nitro) return getFakeNitroDate(data.nitroLevel ?? 0, target.id || "self");
                    return target.premiumSince;
                }
                if (prop === "premiumGuildSince") {
                    if (data.nitro && (data.boostMonths ?? -1) >= 0) return getFakeBoostDate(data.boostMonths, target.id || "self");
                    return target.premiumGuildSince;
                }
                if (prop === "getTag") {
                    return function () {
                        var name = data.username || target.username;
                        return target.discriminator === "0" ? name : (name + "#" + target.discriminator);
                    };
                }
                if (prop === "getGlobalName") return function () { return data.globalName ? data.globalName : target.globalName; };
                if (prop === "toString") return function () { return data.globalName || target.displayName || target.globalName || target.username; };
                if ((prop === "isStaff" || prop === "hasAnyStaffLevel") && data.badgeFlags != null) {
                    return function () { return (data.badgeFlags & 1) !== 0; };
                }
                if ((prop === "hasPremium" || prop === "isPremium" || prop === "hasPaidTier2Subscription") && data.nitro) {
                    return function () { return true; };
                }

                var value = Reflect.get(target, prop, target);
                if (typeof value === "function" && typeof prop === "string") {
                    return value.bind(target);
                }
                return value;
            }
        });

        proxyUserCache.set(user, { data: data, proxy: proxy, version: _dataVersion });
        return proxy;
    }

    function getCustomProfileBadgesList(userId, previewData) {
        var custom = previewData ? { data: previewData, enabled: true } : getCustomDataForUser(userId);
        if (!custom || !custom.enabled) return [];
        var data = custom.data;
        var badges = [];
        var customIds = data.customBadgeIds || [];

        if (data.nitro) {
            var nl = data.nitroLevel ?? 0;
            var LEVEL_MONTHS = [0, 1, 3, 6, 12, 24, 36, 60, 72];
            var nitroHash = (NITRO_LEVELS[nl] && NITRO_LEVELS[nl].icon.split("/").pop().replace(".png", "")) || "2ba85e8026a8614b640c2837bcdfe21b";
            var months = LEVEL_MONTHS[nl] ?? 1;
            var since = getFakeNitroDate(nl, userId || "self");
            badges.push({
                id: "premium_tenure_" + months + "_month_v2",
                iconSrc: "https://cdn.discordapp.com/badge-icons/" + nitroHash + ".png",
                description: formatNitroBadgeDesc(since)
            });

            var bm = data.boostMonths ?? -1;
            if (bm >= 0) {
                var BOOST_LVLS = ["lvl1", "lvl2", "lvl3", "lvl4", "lvl5", "lvl6", "lvl7", "lvl8", "lvl9"];
                var boostHash = (BOOST_ICONS[bm] && BOOST_ICONS[bm].split("/").pop().replace(".png", "")) || "51040c70d4f20a921ad6674ff86fc95c";
                var boostSince = getFakeBoostDate(bm, userId || "self");
                badges.push({
                    id: "guild_booster_" + (BOOST_LVLS[bm] || "lvl1"),
                    iconSrc: "https://cdn.discordapp.com/badge-icons/" + boostHash + ".png",
                    description: formatBoostBadgeDesc(boostSince)
                });
            }
        }

        var wantedFlags = data.badgeFlags || 0;
        if (wantedFlags) {
            for (var i = 0; i < BADGES.length; i++) {
                var bDef = BADGES[i];
                if (wantedFlags & bDef.flag) {
                    var hash = bDef.icon.split("/").pop().replace(".png", "");
                    badges.push({
                        id: getBadgeId(bDef.key),
                        iconSrc: "https://cdn.discordapp.com/badge-icons/" + hash + ".png",
                        description: getStandardBadgeDesc(bDef.key)
                    });
                }
            }
        }

        if (customIds.indexOf("quest") !== -1) {
            badges.push({ id: "quest_completed", iconSrc: "https://cdn.discordapp.com/badge-icons/7d9ae358c8c5e118768335dbe68b4fb8.png", description: "Completed a Quest" });
        }
        if (customIds.indexOf("orbs") !== -1) {
            badges.push({ id: "orb_profile_badge", iconSrc: "https://cdn.discordapp.com/badge-icons/83d8a1eb09a8d64e59233eec5d4d5c2d.png", description: "Orbs — Apprentice" });
        }
        if (customIds.indexOf("oldname") !== -1) {
            badges.push({ id: "legacy_username", iconSrc: OLD_NAME_BADGE_ICON, description: data.oldName ? ("Originally known as " + data.oldName) : "Originally known as ..." });
        }
        if (customIds.indexOf("gifting_icon") !== -1) {
            badges.push({ id: "gifting_icon", iconSrc: "https://cdn.discordapp.com/badge-icons/64f2413c9b9803661322aaad25826b62.png", description: getGiftingBadgeDesc("icon") });
        }
        if (customIds.indexOf("gifting_patron") !== -1) {
            badges.push({ id: "gifting_patron", iconSrc: "https://cdn.discordapp.com/badge-icons/ac305d1b9481f312ce4419e7f8296558.png", description: getGiftingBadgeDesc("patron") });
        }
        if (customIds.indexOf("gifting_champion") !== -1) {
            badges.push({ id: "gifting_champion", iconSrc: "https://cdn.discordapp.com/badge-icons/8b7792c4f65953d3ff564f23429cb79e.png", description: getGiftingBadgeDesc("champion") });
        }
        if (customIds.indexOf("gifting_luminary") !== -1) {
            badges.push({ id: "gifting_luminary", iconSrc: "https://cdn.discordapp.com/badge-icons/3119f5504b2cd09576a323908c7c3517.png", description: getGiftingBadgeDesc("luminary") });
        }
        if (customIds.indexOf("gifting_hero") !== -1) {
            badges.push({ id: "gifting_hero", iconSrc: "https://cdn.discordapp.com/badge-icons/77d65b1f210014a11eb1582ee06ab684.png", description: getGiftingBadgeDesc("hero") });
        }
        if (customIds.indexOf("gifting_legend") !== -1) {
            badges.push({ id: "gifting_legend", iconSrc: "https://cdn.discordapp.com/badge-icons/7fe346cfc5da1340087d8759a9e7a395.png", description: getGiftingBadgeDesc("legend") });
        }
        if (customIds.indexOf("gifting_level") !== -1) {
            badges.push({ id: "gifting_level", iconSrc: "https://cdn.discordapp.com/badge-icons/ca105ad9cfc8580c765101d17bbb2323.png", description: getLevelBadgeDesc(data.levelReached ?? 1) });
        }

        return badges;
    }

    function hookUserProfile(profile, customData) {
        var data = customData || storedData;
        if (!profile || !data) return profile;
        var cached = profileCache.get(profile);
        if (cached && cached.data === data && cached.version === _dataVersion) return cached.profile;

        try {
            var merged = {};
            if (data.bio) merged.bio = data.bio;
            if (data.pronouns) merged.pronouns = data.pronouns;
            if (data.accentColor != null) merged.accentColor = data.accentColor;
            if (data.banner) merged.banner = data.banner;

            if (data.avatarDecoration || data.decorationAsset) {
                merged.avatarDecoration = null;
                merged.avatarDecorationData = data.avatarDecoration || {
                    asset: data.decorationAsset,
                    skuId: data.decorationSkuId || data.decorationAsset
                };
            }

            var overrideFlags = data.nitro || data.badgeFlags != null;
            if (overrideFlags) {
                merged.premiumType = data.nitro ? 2 : profile.premiumType;
                if (data.nitro) {
                    if (data.accentColor != null) {
                        merged.themeColors = [data.accentColor, data.accentColor2 ?? data.accentColor];
                    }
                    var seedBase = profile.userId || getMyUserId() || "self";
                    merged.premiumSince = getFakeNitroDate(data.nitroLevel ?? 0, seedBase);
                    var bm = data.boostMonths ?? -1;
                    merged.premiumGuildSince = bm >= 0 ? getFakeBoostDate(bm, seedBase) : null;
                }
                merged.publicFlags = data.badgeFlags != null ? data.badgeFlags : profile.publicFlags;
                merged.badges = [];
            }

            if (data.profileEffectId) {
                merged.profileEffectId = data.profileEffectId;
                merged.profileEffect = data.profileEffect || { expireAt: null, skuId: data.profileEffectId };
                if (!merged.premiumType) merged.premiumType = profile.premiumType || 2;
            }
            if (data.profileFrame || data.nameplate) {
                merged.collectibles = withCollectibles(profile.collectibles, data.profileFrame, data.nameplate);
            }
            if (data.profileFrame) {
                merged.profileFrame = data.profileFrame;
                merged.profileFrameData = data.profileFrame;
            }
            if (data.nameplate) merged.nameplate = data.nameplate;
            if (data.fakeConnections && data.fakeConnections.length > 0) {
                var fakeAccs = formatFakeConnections(data.fakeConnections);
                var existing = profile.connectedAccounts || profile.connected_accounts || [];
                merged.connectedAccounts = existing.concat(fakeAccs);
                merged.connected_accounts = existing.concat(fakeAccs);
            }

            var result = cleanMerge(profile, merged);
            profileCache.set(profile, { data: data, profile: result, version: _dataVersion });
            return result;
        } catch (e) {
            return profile;
        }
    }

    function installStoreHooks() {
        try {
            var US = getUserStore();
            if (US && !_origGetCurrentUser) {
                _origGetCurrentUser = US.getCurrentUser.bind(US);
                US.getCurrentUser = function () {
                    var realUser = _origGetCurrentUser();
                    if (!realUser) return realUser;
                    var custom = getCustomDataForUser(realUser.id);
                    if (custom && custom.enabled) return fakeCurrentUser(realUser, custom.data);
                    return realUser;
                };
            }
            if (US && !_origGetUser) {
                _origGetUser = US.getUser.bind(US);
                US.getUser = function (id) {
                    var user = _origGetUser(id);
                    if (!user) return user;
                    var custom = getCustomDataForUser(id);
                    if (custom && custom.enabled) return fakeCurrentUser(user, custom.data);
                    return user;
                };
            }
        } catch (e) { }

        try {
            var IconUtils = getIconUtils();
            if (IconUtils && IconUtils.getUserAvatarURL && !_origGetUserAvatarURL) {
                _origGetUserAvatarURL = IconUtils.getUserAvatarURL;
                IconUtils.getUserAvatarURL = function (user) {
                    if (user) {
                        var uid = user.id || user.userId;
                        var custom = getCustomDataForUser(uid);
                        if (custom && custom.enabled && custom.data.avatar) return custom.data.avatar;
                    }
                    return _origGetUserAvatarURL.apply(this, arguments);
                };
            }
            if (IconUtils && IconUtils.getUserAvatarSource && !_origGetUserAvatarSource) {
                _origGetUserAvatarSource = IconUtils.getUserAvatarSource;
                IconUtils.getUserAvatarSource = function (user) {
                    if (user) {
                        var uid = user.id || user.userId;
                        var custom = getCustomDataForUser(uid);
                        if (custom && custom.enabled && custom.data.avatar) return { uri: custom.data.avatar };
                    }
                    return _origGetUserAvatarSource.apply(this, arguments);
                };
            }
            if (IconUtils && IconUtils.getUserBannerURL && !_origGetUserBannerURL) {
                _origGetUserBannerURL = IconUtils.getUserBannerURL;
                IconUtils.getUserBannerURL = function (opts) {
                    var uid = opts && (opts.id || opts.userId);
                    if (uid) {
                        var custom = getCustomDataForUser(uid);
                        if (custom && custom.enabled && custom.data.nitro && custom.data.banner) return custom.data.banner;
                    }
                    return _origGetUserBannerURL.apply(this, arguments);
                };
            }
        } catch (e) { }

        try {
            var SnowflakeUtils = getSnowflakeUtils();
            if (SnowflakeUtils && SnowflakeUtils.extractTimestamp && !_origExtractTimestamp) {
                _origExtractTimestamp = SnowflakeUtils.extractTimestamp;
                SnowflakeUtils.extractTimestamp = function (id) {
                    var custom = getCustomDataForUser(id);
                    if (custom && custom.enabled && custom.data.createdAt) {
                        var parsed = new Date(custom.data.createdAt + "T12:00:00Z").getTime();
                        if (!isNaN(parsed)) return parsed;
                    }
                    return _origExtractTimestamp.call(this, id);
                };
            }
        } catch (e) { }

        try {
            var GMS = getGuildMemberStore();
            if (GMS && GMS.getMember && !_origGetMember) {
                _origGetMember = GMS.getMember.bind(GMS);
                GMS.getMember = function (guildId, userId) {
                    var member = _origGetMember(guildId, userId);
                    var custom = getCustomDataForUser(userId);
                    if (custom && custom.enabled && member) {
                        var customNick = custom.data.globalName || custom.data.username;
                        if (customNick) return Object.assign({}, member, { nick: customNick });
                    }
                    return member;
                };
            }
        } catch (e) { }

        try {
            var UPS = getUserProfileStore();
            if (UPS && UPS.getUserProfile && !_origGetUserProfile) {
                _origGetUserProfile = UPS.getUserProfile.bind(UPS);
                UPS.getUserProfile = function (userId) {
                    var profile = _origGetUserProfile(userId);
                    var custom = getCustomDataForUser(userId);
                    if (custom && custom.enabled && profile) return hookUserProfile(profile, custom.data);
                    return profile;
                };
            }
            if (UPS && UPS.getGuildMemberProfile && !_origGetGuildMemberProfile) {
                _origGetGuildMemberProfile = UPS.getGuildMemberProfile.bind(UPS);
                UPS.getGuildMemberProfile = function (userId, guildId) {
                    var profile = _origGetGuildMemberProfile(userId, guildId);
                    var custom = getCustomDataForUser(userId);
                    if (custom && custom.enabled && profile) return hookUserProfile(profile, custom.data);
                    return profile;
                };
            }
        } catch (e) { }

        try {
            var CAS = metro.findByProps("getAccounts", "getLocalAccounts") || metro.findByStoreName("ConnectedAccountsStore");
            if (CAS && !_origGetAccounts) {
                _origGetAccounts = CAS.getAccounts.bind(CAS);
                CAS.getAccounts = function () {
                    var accounts = _origGetAccounts() || [];
                    if (isEnabled && storedData.fakeConnections && storedData.fakeConnections.length > 0) {
                        return accounts.concat(formatFakeConnections(storedData.fakeConnections));
                    }
                    return accounts;
                };
            }
        } catch (e) { }

        try {
            var decoMod = metro.findByProps("getAvatarDecorationURL");
            if (decoMod && decoMod.getAvatarDecorationURL && !_origDecoURL) {
                _origDecoURL = decoMod.getAvatarDecorationURL.bind(decoMod);
                decoMod.getAvatarDecorationURL = function (opts) {
                    try {
                        var decoData = (opts && (opts.avatarDecorationData || opts.avatarDecoration)) || opts;
                        var userId = opts && opts.userId;
                        var canAnimate = (opts && (opts.canAnimate ?? opts.animated)) ?? true;
                        var custom = getCustomDataForUser(userId);
                        if (custom && custom.enabled && custom.data.decorationAsset) {
                            return getDecorationUrl(custom.data.decorationAsset, canAnimate);
                        }
                        if (isEnabled && storedData.decorationAsset) {
                            var isOurs = (decoData && decoData.asset === storedData.decorationAsset) ||
                                (decoData && decoData.skuId === storedData.decorationSkuId);
                            if (isOurs) return getDecorationUrl(storedData.decorationAsset, canAnimate);
                        }
                    } catch (e) { }
                    return _origDecoURL(opts);
                };
            }
        } catch (e) { }

        // Mobile badges rendering hook
        try {
            var jsxRuntime = metro.findByProps("jsx", "jsxs");
            var jsxCallback = function (args, ret) {
                var Component = args[0];
                if (typeof Component === "function" && (Component.name === "ProfileBadge" || Component.name === "RenderedBadge")) {
                    var id = ret && ret.props && ret.props.id;
                    if (typeof id === "string" && id.indexOf("cpe-") === 0) {
                        var cachedProps = badgePropsCache.get(id);
                        if (cachedProps) {
                            Object.assign(ret.props, cachedProps);
                        }
                    }
                }
            };
            if (jsxRuntime && jsxRuntime.jsx) unpatches.push(patcher.after("jsx", jsxRuntime, jsxCallback));
            if (jsxRuntime && jsxRuntime.jsxs) unpatches.push(patcher.after("jsxs", jsxRuntime, jsxCallback));

            var useBadgesMod = metro.findByName("useBadges", false);
            if (useBadgesMod && useBadgesMod.default) {
                unpatches.push(patcher.after("default", useBadgesMod, function (args, result) {
                    var displayProfile = args[0];
                    if (!displayProfile || !Array.isArray(result)) return;
                    var userId = displayProfile.userId || displayProfile.id;
                    if (!userId) return;

                    var customBadges = getCustomProfileBadgesList(userId);
                    var globalBadges = getGlobalBadgesList(userId);
                    var combined = deduplicateProfileBadges(customBadges.concat(globalBadges));
                    if (combined.length === 0) return;

                    var existingIds = new Set(result.map(function (b) { return b && b.id; }));
                    combined.forEach(function (badge, idx) {
                        var badgeId = "cpe-" + userId + "-" + (badge.id || idx);
                        if (existingIds.has(badgeId)) return;
                        badgePropsCache.set(badgeId, {
                            id: badgeId,
                            source: { uri: badge.iconSrc },
                            label: badge.description,
                            userId: userId
                        });
                        result.push({
                            id: badgeId,
                            description: badge.description,
                            icon: " _"
                        });
                    });
                }));
            }
        } catch (e) { }

        installStaffSpoof(function () { return _origGetCurrentUser && _origGetCurrentUser(); });
    }

    function uninstallStoreHooks() {
        uninstallStaffSpoof();
        while (unpatches.length > 0) {
            try { unpatches.pop()(); } catch (e) { }
        }
        badgePropsCache.clear();

        try {
            var US = getUserStore();
            if (US && _origGetCurrentUser) { US.getCurrentUser = _origGetCurrentUser; _origGetCurrentUser = null; }
            if (US && _origGetUser) { US.getUser = _origGetUser; _origGetUser = null; }
        } catch (e) { }
        try {
            var IconUtils = getIconUtils();
            if (IconUtils && _origGetUserAvatarURL) { IconUtils.getUserAvatarURL = _origGetUserAvatarURL; _origGetUserAvatarURL = null; }
            if (IconUtils && _origGetUserAvatarSource) { IconUtils.getUserAvatarSource = _origGetUserAvatarSource; _origGetUserAvatarSource = null; }
            if (IconUtils && _origGetUserBannerURL) { IconUtils.getUserBannerURL = _origGetUserBannerURL; _origGetUserBannerURL = null; }
        } catch (e) { }
        try {
            var SnowflakeUtils = getSnowflakeUtils();
            if (SnowflakeUtils && _origExtractTimestamp) { SnowflakeUtils.extractTimestamp = _origExtractTimestamp; _origExtractTimestamp = null; }
        } catch (e) { }
        try {
            var GMS = getGuildMemberStore();
            if (GMS && _origGetMember) { GMS.getMember = _origGetMember; _origGetMember = null; }
        } catch (e) { }
        try {
            var UPS = getUserProfileStore();
            if (UPS && _origGetUserProfile) { UPS.getUserProfile = _origGetUserProfile; _origGetUserProfile = null; }
            if (UPS && _origGetGuildMemberProfile) { UPS.getGuildMemberProfile = _origGetGuildMemberProfile; _origGetGuildMemberProfile = null; }
        } catch (e) { }
        try {
            var CAS = metro.findByProps("getAccounts", "getLocalAccounts") || metro.findByStoreName("ConnectedAccountsStore");
            if (CAS && _origGetAccounts) { CAS.getAccounts = _origGetAccounts; _origGetAccounts = null; }
        } catch (e) { }
        try {
            var decoMod = metro.findByProps("getAvatarDecorationURL");
            if (decoMod && _origDecoURL) { decoMod.getAvatarDecorationURL = _origDecoURL; _origDecoURL = null; }
        } catch (e) { }
    }

    // ── Save & Reset Profile Actions ──────────────────────────────────────────
    async function saveAccountProfileData(targetAccountId, draftData, enabledState) {
        if (enabledState === void 0) enabledState = true;
        try {
            var savedData = Object.assign({}, draftData);
            var legacyDecorationSkuId = /^\d+$/.test(savedData.decorationAsset || "") ? savedData.decorationAsset : undefined;
            var decorationSkuId = (savedData.decorationSkuId && savedData.decorationSkuId.trim()) || legacyDecorationSkuId;
            var profileEffectId = savedData.profileEffectId && savedData.profileEffectId.trim();
            var nameplateSkuId = savedData.nameplateSkuId && savedData.nameplateSkuId.trim();
            var profileFrameSkuId = savedData.profileFrameSkuId && savedData.profileFrameSkuId.trim();

            var results = await Promise.all([
                decorationSkuId ? ((savedData.avatarDecoration && savedData.avatarDecoration.skuId === decorationSkuId) ? savedData.avatarDecoration : resolveCollectible(decorationSkuId, normalizeAvatarDecoration)) : null,
                profileEffectId ? ((savedData.profileEffect && savedData.profileEffect.skuId === profileEffectId) ? savedData.profileEffect : resolveCollectible(profileEffectId, normalizeProfileEffect)) : null,
                nameplateSkuId ? ((savedData.nameplate && savedData.nameplate.skuId === nameplateSkuId) ? savedData.nameplate : resolveCollectible(nameplateSkuId, normalizeNameplate)) : null,
                profileFrameSkuId ? ((savedData.profileFrame && savedData.profileFrame.skuId === profileFrameSkuId) ? savedData.profileFrame : resolveCollectible(profileFrameSkuId, normalizeFrame)) : null
            ]);

            var avatarDecoration = results[0];
            var profileEffect = results[1];
            var nameplate = results[2];
            var profileFrame = results[3];

            if (decorationSkuId && !avatarDecoration) return { ok: false, error: "This SKU is invalid or is not an Avatar Decoration." };
            if (profileEffectId && !profileEffect) return { ok: false, error: "This SKU is invalid or is not a Profile Effect." };
            if (nameplateSkuId && !nameplate) return { ok: false, error: "This SKU is invalid or is not a Nameplate." };
            if (profileFrameSkuId && !profileFrame) return { ok: false, error: "This SKU is invalid or is not a Profile Frame." };

            if (decorationSkuId && avatarDecoration) {
                savedData.decorationSkuId = decorationSkuId;
                savedData.decorationAsset = avatarDecoration.asset;
                savedData.avatarDecoration = avatarDecoration;
            } else {
                delete savedData.decorationSkuId;
                delete savedData.decorationAsset;
                delete savedData.avatarDecoration;
            }
            if (profileEffectId && profileEffect) {
                savedData.profileEffectId = profileEffectId;
                savedData.profileEffect = profileEffect;
            } else {
                delete savedData.profileEffectId;
                delete savedData.profileEffect;
            }
            if (nameplateSkuId && nameplate) {
                savedData.nameplateSkuId = nameplateSkuId;
                savedData.nameplate = nameplate;
            } else {
                delete savedData.nameplateSkuId;
                delete savedData.nameplate;
            }
            if (profileFrameSkuId && profileFrame) {
                savedData.profileFrameSkuId = profileFrameSkuId;
                savedData.profileFrame = profileFrame;
            } else {
                delete savedData.profileFrameSkuId;
                delete savedData.profileFrame;
            }

            var activeUid = getMyUserId();
            var targetAccId = targetAccountId || activeUid;
            if (targetAccId) {
                allAccountsData[targetAccId] = savedData;
                allAccountsEnabled[targetAccId] = enabledState;
            }
            if (!targetAccId || targetAccId === activeUid || targetAccId === _cachedMyId) {
                storedData = savedData;
                isEnabled = enabledState;
                _cachedMyId = targetAccId || activeUid;
            }
            saveDataToStorage();
            resetCustomProfileCache();
            forceAccountPanelRerender();
            return { ok: true, savedData: savedData };
        } catch (err) {
            return { ok: false, error: "Could not load collectible metadata from Discord." };
        }
    }

    function resetAccountProfileData(targetAccountId) {
        var currentUid = getMyUserId();
        var targetAccId = targetAccountId || currentUid;
        if (targetAccId) {
            delete allAccountsData[targetAccId];
            delete allAccountsEnabled[targetAccId];
        }
        delete allAccountsData[""];
        delete allAccountsEnabled[""];
        if (!targetAccId || targetAccId === currentUid || targetAccId === _cachedMyId) {
            storedData = {};
            isEnabled = false;
        }
        saveDataToStorage();
        resetCustomProfileCache();
        forceAccountPanelRerender();
    }

    function setAccountProfileEnabled(targetAccountId, enabled) {
        var currentUid = getMyUserId();
        var targetAccId = targetAccountId || currentUid;
        if (targetAccId) {
            allAccountsEnabled[targetAccId] = enabled;
            if (!allAccountsData[targetAccId]) {
                allAccountsData[targetAccId] = targetAccId === currentUid ? Object.assign({}, storedData) : {};
            }
        }
        if (!targetAccId || targetAccId === currentUid || targetAccId === _cachedMyId) {
            isEnabled = enabled;
        }
        saveDataToStorage();
        resetCustomProfileCache();
        forceAccountPanelRerender();
    }

    function formatHexColor(num) {
        if (num == null || isNaN(num)) return "";
        return "#" + num.toString(16).padStart(6, "0").toUpperCase();
    }

    // ── Settings Component (Rendered in HideCallButtons Style) ────────────────
    function Settings() {
        storage.useProxy(plugin.storage);
        var tableMod = metro.findByProps("TableRow");
        var stackMod = metro.findByProps("Stack");
        var TableRow = tableMod.TableRow;
        var TableSwitchRow = tableMod.TableSwitchRow;
        var TableRowGroup = tableMod.TableRowGroup;
        var Stack = stackMod.Stack;

        var currentUid = getMyUserId();
        var stateAcc = React.useState(currentUid);
        var selectedAccountId = stateAcc[0];
        var setSelectedAccountId = stateAcc[1];

        var stateData = React.useState(function () {
            return Object.assign({}, allAccountsData[currentUid] || storedData || {});
        });
        var data = stateData[0];
        var setData = stateData[1];

        var stateSaving = React.useState(false);
        var saving = stateSaving[0];
        var setSaving = stateSaving[1];

        var statePlat = React.useState(FAKE_PLATFORMS[0].id);
        var selectedPlatform = statePlat[0];
        var setSelectedPlatform = statePlat[1];

        var forceUpdate = React.useReducer(function (x) { return x + 1; }, 0)[1];

        React.useEffect(function () {
            var tid = selectedAccountId || currentUid;
            var nextData = allAccountsData[tid] || (tid === currentUid ? storedData : {}) || {};
            setData(Object.assign({}, nextData));
        }, [selectedAccountId, currentUid]);

        function updateField(key, val) {
            setData(function (prev) {
                var next = Object.assign({}, prev);
                if (val === undefined || val === "") {
                    delete next[key];
                } else {
                    next[key] = val;
                }
                return next;
            });
        }

        function promptTextField(title, currentValue, placeholder, onSave) {
            ui.alerts.showInputAlert({
                title: title,
                initialValue: currentValue,
                placeholder: placeholder,
                confirmText: "Save",
                cancelText: "Cancel",
                onConfirm: function (val) {
                    onSave((val || "").trim());
                }
            });
        }

        var targetId = selectedAccountId || currentUid;
        var accountEnabled = targetId
            ? (allAccountsEnabled[targetId] ?? (targetId === currentUid ? isEnabled : false))
            : isEnabled;
        var badgeFlags = data.badgeFlags || 0;
        var nitroLevel = data.nitroLevel ?? -1;
        var boostLevel = data.boostMonths ?? -1;
        var customIds = data.customBadgeIds || [];
        var oldName = data.oldName || "";
        var levelReached = data.levelReached ?? 1;
        var fakeConns = data.fakeConnections || [];

        var US = getUserStore();
        var targetUserObj = targetId ? (US && US.getUser && US.getUser(targetId)) : (US && US.getCurrentUser && US.getCurrentUser());
        var targetLabel = targetUserObj
            ? ((targetUserObj.globalName || targetUserObj.username) + " (" + targetId + ")")
            : (targetId || "Current Account");

        return React.createElement(
            ScrollView,
            { style: { flex: 1 } },
            React.createElement(
                Stack,
                { style: { paddingVertical: 24, paddingHorizontal: 12 }, spacing: 24 },
                // 1. Custom Profile Control
                React.createElement(
                    TableRowGroup,
                    { title: "Custom Profile Control" },
                    React.createElement(TableSwitchRow, {
                        label: "Enable Custom Profile",
                        subLabel: "Locally apply custom profile settings on this device",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("CheckmarkLargeBoldIcon", "Check") }),
                        value: Boolean(accountEnabled),
                        onValueChange: function (v) {
                            setAccountProfileEnabled(targetId, v);
                            forceUpdate();
                        }
                    }),
                    React.createElement(TableRow, {
                        label: "Target Account / User ID",
                        subLabel: targetLabel,
                        icon: React.createElement(TableRow.Icon, { source: getAsset("PersonIcon", "ic_account_circle_24px") }),
                        onPress: function () {
                            promptTextField("Target Account User ID", targetId, "Enter Discord User ID", function (val) {
                                setSelectedAccountId(val || currentUid);
                            });
                        }
                    }),
                    React.createElement(TableRow, {
                        label: saving ? "Saving & Resolving Collectibles..." : "Save & Apply Profile Changes",
                        subLabel: "Validates Shop SKUs and applies all profile edits immediately",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("Check", "toast_image_saved") }),
                        onPress: async function () {
                            if (saving) return;
                            setSaving(true);
                            try {
                                var res = await saveAccountProfileData(targetId, data, true);
                                if (!res.ok) {
                                    showToastMsg(res.error || "Failed to save profile", "Small");
                                    return;
                                }
                                if (res.savedData) setData(Object.assign({}, res.savedData));
                                forceUpdate();
                                showToastMsg("Custom Profile saved and applied!", "Check");
                            } finally {
                                setSaving(false);
                            }
                        }
                    }),
                    React.createElement(TableRow, {
                        variant: "danger",
                        label: "Reset Custom Profile",
                        subLabel: "Restore default Discord profile for the selected account",
                        icon: React.createElement(TableRow.Icon, { variant: "danger", source: getAsset("TrashIcon", "ic_message_delete") }),
                        onPress: function () {
                            ui.alerts.showConfirmationAlert({
                                title: "Reset Custom Profile",
                                content: "Are you sure you want to reset all custom profile settings for this account?",
                                confirmText: "Reset",
                                confirmColor: "red",
                                cancelText: "Cancel",
                                onConfirm: function () {
                                    resetAccountProfileData(targetId);
                                    setData({});
                                    forceUpdate();
                                    showToastMsg("Custom Profile reset!", "TrashIcon");
                                }
                            });
                        }
                    })
                ),

                // 2. Displayed Profile Information
                React.createElement(
                    TableRowGroup,
                    { title: "Displayed Profile Information", titleStyleType: "no_border" },
                    React.createElement(TableRow, {
                        label: "Username",
                        subLabel: data.username || "Not set (tap to edit)",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("PencilIcon", "ic_edit_24px") }),
                        onPress: function () { promptTextField("Custom Username", data.username || "", "username", function (v) { updateField("username", v); }); }
                    }),
                    React.createElement(TableRow, {
                        label: "Display Name / Nickname",
                        subLabel: data.globalName || "Not set (tap to edit)",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("PencilIcon", "ic_edit_24px") }),
                        onPress: function () { promptTextField("Display Name / Nickname", data.globalName || "", "Display Name", function (v) { updateField("globalName", v); }); }
                    }),
                    React.createElement(TableRow, {
                        label: "About Me / Bio",
                        subLabel: data.bio || "Not set (tap to edit)",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("PencilIcon", "ic_edit_24px") }),
                        onPress: function () { promptTextField("About Me / Bio", data.bio || "", "Write something about yourself...", function (v) { updateField("bio", v); }); }
                    }),
                    React.createElement(TableRow, {
                        label: "Pronouns",
                        subLabel: data.pronouns || "Not set (tap to edit)",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("PencilIcon", "ic_edit_24px") }),
                        onPress: function () { promptTextField("Pronouns", data.pronouns || "", "he/him, she/her, they/them...", function (v) { updateField("pronouns", v); }); }
                    }),
                    React.createElement(TableRow, {
                        label: "Discord Member Since",
                        subLabel: data.createdAt || "Not set (YYYY-MM-DD, e.g. 2015-05-13)",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("CalendarIcon", "ic_calendar") }),
                        onPress: function () { promptTextField("Discord Member Since (YYYY-MM-DD)", data.createdAt || "", "2015-05-13", function (v) { updateField("createdAt", v); }); }
                    }),
                    React.createElement(TableRow, {
                        label: "Email Address (Local Display)",
                        subLabel: data.email || "Not set (tap to edit)",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("MailIcon", "ic_email") }),
                        onPress: function () { promptTextField("Email Address (Local Display)", data.email || "", "example@mail.com", function (v) { updateField("email", v); }); }
                    }),
                    React.createElement(TableRow, {
                        label: "Phone Number (Local Display)",
                        subLabel: data.phone || "Not set (tap to edit)",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("PhoneCallIcon", "ic_phone") }),
                        onPress: function () { promptTextField("Phone Number (Local Display)", data.phone || "", "+1 555 123 4567", function (v) { updateField("phone", v); }); }
                    })
                ),

                // 3. Appearance, Nitro & Colors
                React.createElement(
                    TableRowGroup,
                    { title: "Appearance, Nitro & Colors", titleStyleType: "no_border" },
                    React.createElement(TableSwitchRow, {
                        label: "Enable Nitro Appearance",
                        subLabel: "Unlock local banner, theme gradient colors and Nitro status",
                        icon: React.createElement(TableRow.Icon, { source: { uri: NITRO_LEVELS[0].icon } }),
                        value: Boolean(data.nitro),
                        onValueChange: function (v) { updateField("nitro", v); }
                    }),
                    React.createElement(TableRow, {
                        label: "Avatar Image URL",
                        subLabel: data.avatar ? (data.avatar.length > 50 ? data.avatar.slice(0, 50) + "..." : data.avatar) : "Not set (tap to paste image URL)",
                        icon: React.createElement(TableRow.Icon, { source: data.avatar ? { uri: data.avatar } : getAsset("ImageIcon", "ic_image") }),
                        onPress: function () { promptTextField("Avatar Image URL", data.avatar || "", "https://example.com/avatar.png", function (v) { updateField("avatar", v); }); }
                    }),
                    Boolean(data.nitro) && React.createElement(TableRow, {
                        label: "Banner Image URL (Nitro)",
                        subLabel: data.banner ? (data.banner.length > 50 ? data.banner.slice(0, 50) + "..." : data.banner) : "Not set (tap to paste banner URL)",
                        icon: React.createElement(TableRow.Icon, { source: data.banner ? { uri: data.banner } : getAsset("ImageIcon", "ic_image") }),
                        onPress: function () { promptTextField("Banner Image URL", data.banner || "", "https://example.com/banner.gif", function (v) { updateField("banner", v); }); }
                    }),
                    React.createElement(TableRow, {
                        label: "Profile Color 1 (Primary Hex)",
                        subLabel: formatHexColor(data.accentColor) || "Not set (e.g. #5865F2)",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("PaintbrushIcon", "ic_paint") }),
                        onPress: function () {
                            promptTextField("Primary Profile Color (#RRGGBB)", formatHexColor(data.accentColor), "#5865F2", function (v) {
                                var clean = v.replace(/^#/, "");
                                if (!clean) { updateField("accentColor", undefined); return; }
                                var parsed = parseInt(clean, 16);
                                if (!isNaN(parsed)) updateField("accentColor", parsed);
                            });
                        }
                    }),
                    React.createElement(TableRow, {
                        label: "Profile Color 2 (Gradient Hex)",
                        subLabel: formatHexColor(data.accentColor2) || "Not set (e.g. #EB459E)",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("PaintbrushIcon", "ic_paint") }),
                        onPress: function () {
                            promptTextField("Secondary Gradient Color (#RRGGBB)", formatHexColor(data.accentColor2), "#EB459E", function (v) {
                                var clean = v.replace(/^#/, "");
                                if (!clean) { updateField("accentColor2", undefined); return; }
                                var parsed = parseInt(clean, 16);
                                if (!isNaN(parsed)) updateField("accentColor2", parsed);
                            });
                        }
                    }),
                    COLOR_PRESETS.map(function (preset) {
                        return React.createElement(TableSwitchRow, {
                            key: preset.val,
                            label: "Preset: " + preset.label + " (" + preset.hex + ")",
                            icon: React.createElement(TableRow.Icon, { source: getAsset("PaintbrushIcon", "ic_paint") }),
                            value: data.accentColor === preset.val,
                            onValueChange: function (v) { updateField("accentColor", v ? preset.val : undefined); }
                        });
                    })
                ),

                // 4. Collectibles (Shop SKU / Link)
                React.createElement(
                    TableRowGroup,
                    { title: "Collectibles (Shop SKU / Link)", titleStyleType: "no_border" },
                    React.createElement(TableRow, {
                        label: "Avatar Decoration SKU / Shop Link",
                        subLabel: data.decorationSkuId || data.decorationAsset || "None (tap to paste Shop link or SKU ID)",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("SparklesIcon", "ic_star") }),
                        onPress: function () {
                            promptTextField("Avatar Decoration SKU / Shop Link", data.decorationSkuId || "", "Paste Discord Shop link or SKU ID", function (v) {
                                var sku = parseSkuInput(v);
                                setData(function (curr) {
                                    return Object.assign({}, curr, {
                                        decorationSkuId: sku,
                                        decorationAsset: undefined,
                                        avatarDecoration: (curr.avatarDecoration && curr.avatarDecoration.skuId === sku) ? curr.avatarDecoration : undefined
                                    });
                                });
                            });
                        }
                    }),
                    React.createElement(TableRow, {
                        label: "Profile Effect SKU / Shop Link",
                        subLabel: data.profileEffectId || "None (tap to paste Shop link or SKU ID)",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("SparklesIcon", "ic_star") }),
                        onPress: function () {
                            promptTextField("Profile Effect SKU / Shop Link", data.profileEffectId || "", "Paste Discord Shop link or SKU ID", function (v) {
                                var sku = parseSkuInput(v);
                                setData(function (curr) {
                                    return Object.assign({}, curr, {
                                        profileEffectId: sku,
                                        profileEffect: (curr.profileEffect && curr.profileEffect.skuId === sku) ? curr.profileEffect : undefined
                                    });
                                });
                            });
                        }
                    }),
                    React.createElement(TableRow, {
                        label: "Nameplate SKU / Shop Link",
                        subLabel: data.nameplateSkuId || "None (tap to paste Shop link or SKU ID)",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("SparklesIcon", "ic_star") }),
                        onPress: function () {
                            promptTextField("Nameplate SKU / Shop Link", data.nameplateSkuId || "", "Paste Discord Shop link or SKU ID", function (v) {
                                var sku = parseSkuInput(v);
                                setData(function (curr) {
                                    return Object.assign({}, curr, {
                                        nameplateSkuId: sku,
                                        nameplate: (curr.nameplate && curr.nameplate.skuId === sku) ? curr.nameplate : undefined
                                    });
                                });
                            });
                        }
                    }),
                    React.createElement(TableRow, {
                        label: "Profile Frame SKU / Shop Link (Experimental)",
                        subLabel: data.profileFrameSkuId || "None (tap to paste Shop link or SKU ID)",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("SparklesIcon", "ic_star") }),
                        onPress: function () {
                            promptTextField("Profile Frame SKU / Shop Link", data.profileFrameSkuId || "", "Paste Discord Shop link or SKU ID", function (v) {
                                var sku = parseSkuInput(v);
                                setData(function (curr) {
                                    return Object.assign({}, curr, {
                                        profileFrameSkuId: sku,
                                        profileFrame: (curr.profileFrame && curr.profileFrame.skuId === sku) ? curr.profileFrame : undefined
                                    });
                                });
                            });
                        }
                    }),
                    React.createElement(TableRow, {
                        label: "Clear All Collectibles",
                        subLabel: "Remove custom Avatar Decoration, Profile Effect, Nameplate and Frame",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("TrashIcon", "ic_message_delete") }),
                        onPress: function () {
                            setData(function (curr) {
                                var next = Object.assign({}, curr);
                                delete next.decorationSkuId;
                                delete next.decorationAsset;
                                delete next.avatarDecoration;
                                delete next.profileEffectId;
                                delete next.profileEffect;
                                delete next.nameplateSkuId;
                                delete next.nameplate;
                                delete next.profileFrameSkuId;
                                delete next.profileFrame;
                                return next;
                            });
                            showToastMsg("Cleared collectibles from draft (tap Save to apply)", "Check");
                        }
                    })
                ),

                // 5. Standard Discord Badges
                React.createElement(
                    TableRowGroup,
                    { title: "Discord Badges", titleStyleType: "no_border" },
                    BADGES.map(function (b) {
                        return React.createElement(TableSwitchRow, {
                            key: b.flag,
                            label: b.label,
                            icon: React.createElement(TableRow.Icon, { source: { uri: b.icon } }),
                            value: Boolean(badgeFlags & b.flag),
                            onValueChange: function () { updateField("badgeFlags", badgeFlags ^ b.flag); }
                        });
                    })
                ),

                // 6. Evolving Nitro Badge
                React.createElement(
                    TableRowGroup,
                    { title: "Evolving Nitro Badge", titleStyleType: "no_border" },
                    React.createElement(TableSwitchRow, {
                        label: "None",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("CloseIcon", "Small") }),
                        value: nitroLevel === -1,
                        onValueChange: function (v) {
                            if (v) {
                                updateField("nitroLevel", -1);
                                updateField("nitro", false);
                            }
                        }
                    }),
                    NITRO_LEVELS.map(function (n, idx) {
                        return React.createElement(TableSwitchRow, {
                            key: idx,
                            label: n.label,
                            icon: React.createElement(TableRow.Icon, { source: { uri: n.icon } }),
                            value: nitroLevel === idx,
                            onValueChange: function (v) {
                                if (v) {
                                    updateField("nitroLevel", idx);
                                    updateField("nitro", true);
                                } else {
                                    updateField("nitroLevel", -1);
                                }
                            }
                        });
                    })
                ),

                // 7. Special Badges
                React.createElement(
                    TableRowGroup,
                    { title: "Special Badges", titleStyleType: "no_border" },
                    SPECIAL_BADGES.map(function (sb) {
                        var active = customIds.indexOf(sb.id) !== -1;
                        return React.createElement(TableSwitchRow, {
                            key: sb.id,
                            label: sb.label,
                            icon: React.createElement(TableRow.Icon, { source: { uri: sb.icon } }),
                            value: active,
                            onValueChange: function (v) {
                                var next = v
                                    ? customIds.filter(function (x) { return x !== sb.id; }).concat([sb.id])
                                    : customIds.filter(function (x) { return x !== sb.id; });
                                updateField("customBadgeIds", next);
                            }
                        });
                    }),
                    customIds.indexOf("oldname") !== -1 && React.createElement(TableRow, {
                        label: "Old Username Displayed in Tooltip",
                        subLabel: oldName ? ("Originally known as " + oldName) : "Tap to set old username (e.g. User#0000)",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("PencilIcon", "ic_edit_24px") }),
                        onPress: function () { promptTextField("Old Username", oldName, "OldUser#0000", function (v) { updateField("oldName", v); }); }
                    }),
                    customIds.indexOf("gifting_level") !== -1 && React.createElement(TableRow, {
                        label: "Level Reached Number",
                        subLabel: "Level " + levelReached + " Reached (tap to edit)",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("PencilIcon", "ic_edit_24px") }),
                        onPress: function () {
                            promptTextField("Level Reached (1 - 10000)", String(levelReached), "1", function (v) {
                                var num = parseInt(v, 10);
                                if (!isNaN(num) && num >= 1) updateField("levelReached", num);
                            });
                        }
                    })
                ),

                // 8. Gifting Badges
                React.createElement(
                    TableRowGroup,
                    { title: "Gifting Badges", titleStyleType: "no_border" },
                    GIFTING_BADGES.map(function (gb) {
                        var active = customIds.indexOf(gb.id) !== -1;
                        return React.createElement(TableSwitchRow, {
                            key: gb.id,
                            label: gb.label,
                            icon: React.createElement(TableRow.Icon, { source: { uri: gb.icon } }),
                            value: active,
                            onValueChange: function (v) {
                                var next = v
                                    ? customIds.filter(function (x) { return x !== gb.id; }).concat([gb.id])
                                    : customIds.filter(function (x) { return x !== gb.id; });
                                updateField("customBadgeIds", next);
                            }
                        });
                    })
                ),

                // 9. Server Boost Badges
                React.createElement(
                    TableRowGroup,
                    { title: "Server Boost Badges", titleStyleType: "no_border" },
                    React.createElement(TableSwitchRow, {
                        label: "None",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("CloseIcon", "Small") }),
                        value: boostLevel === -1,
                        onValueChange: function (v) { if (v) updateField("boostMonths", -1); }
                    }),
                    BOOST_LABELS.map(function (label, idx) {
                        return React.createElement(TableSwitchRow, {
                            key: idx,
                            label: label,
                            icon: React.createElement(TableRow.Icon, { source: { uri: BOOST_ICONS[idx] } }),
                            value: boostLevel === idx,
                            onValueChange: function (v) { updateField("boostMonths", v ? idx : -1); }
                        });
                    })
                ),

                // 10. Profile Connections
                React.createElement(
                    TableRowGroup,
                    { title: "Profile Connections (" + fakeConns.length + ")", titleStyleType: "no_border" },
                    fakeConns.map(function (c) {
                        var plat = FAKE_PLATFORMS.find(function (p) { return p.id === c.platform; }) || FAKE_PLATFORMS[0];
                        return React.createElement(TableRow, {
                            key: c.id,
                            label: c.name + " (" + plat.label + ")",
                            subLabel: c.url ? (c.url + " — Tap to remove") : "Verified Connection — Tap to remove",
                            icon: React.createElement(TableRow.Icon, { source: getAsset("LinkIcon", "ic_link") }),
                            onPress: function () {
                                updateField("fakeConnections", fakeConns.filter(function (item) { return item.id !== c.id; }));
                            }
                        });
                    }),
                    React.createElement(TableRow, {
                        label: "Add Connection with Selected Platform",
                        subLabel: "Selected: " + ((FAKE_PLATFORMS.find(function (p) { return p.id === selectedPlatform; }) || FAKE_PLATFORMS[0]).label) + " (tap to enter username/domain)",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("PlusSmallIcon", "ic_add_24px") }),
                        onPress: function () {
                            var currentPlat = FAKE_PLATFORMS.find(function (p) { return p.id === selectedPlatform; }) || FAKE_PLATFORMS[0];
                            promptTextField("Add " + currentPlat.label + " Connection", "", currentPlat.placeholder || "username", function (nameVal) {
                                if (!nameVal) return;
                                var finalUrl = "";
                                if (currentPlat.defaultUrl) {
                                    try { finalUrl = currentPlat.defaultUrl(nameVal); } catch (e) { }
                                } else if (selectedPlatform === "domain") {
                                    finalUrl = nameVal.startsWith("http") ? nameVal : ("https://" + nameVal + "/");
                                }
                                var newConn = {
                                    id: Date.now().toString(),
                                    platform: selectedPlatform,
                                    name: nameVal
                                };
                                if (finalUrl) newConn.url = finalUrl;
                                updateField("fakeConnections", fakeConns.concat([newConn]));
                            });
                        }
                    }),
                    FAKE_PLATFORMS.map(function (plat) {
                        return React.createElement(TableSwitchRow, {
                            key: plat.id,
                            label: "Platform: " + plat.label,
                            subLabel: plat.placeholder,
                            icon: React.createElement(TableRow.Icon, { source: getAsset("LinkIcon", "ic_link") }),
                            value: selectedPlatform === plat.id,
                            onValueChange: function (v) { if (v) setSelectedPlatform(plat.id); }
                        });
                    })
                ),

                // 11. Fake Account Switcher & Local Status
                React.createElement(
                    TableRowGroup,
                    { title: "Fake Account Switcher & Local Status", titleStyleType: "no_border" },
                    activeFakeId && React.createElement(TableRow, {
                        label: "Restore Real Account",
                        subLabel: "Currently previewing fake account (" + activeFakeId + ")",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("RetryIcon", "ic_sync_24px") }),
                        onPress: function () {
                            restoreRealAccount();
                            forceUpdate();
                        }
                    }),
                    React.createElement(TableRow, {
                        label: "Add User to Switcher (Fake)",
                        subLabel: "Enter a User ID to add a fake entry to the Account Switcher",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("PersonPlusIcon", "ic_person_add") }),
                        onPress: function () {
                            promptTextField("Add User ID to Fake Switcher", "", "Discord User ID", function (uid) {
                                if (!uid) return;
                                addToSwitcher(uid);
                                forceUpdate();
                            });
                        }
                    }),
                    fakeAccounts.map(function (fa) {
                        return React.createElement(TableRow, {
                            key: fa.id,
                            label: "Switcher: " + (fa.globalName || fa.username) + " (" + fa.id + ")",
                            subLabel: "Tap to simulate switch • Long-press to remove",
                            icon: React.createElement(TableRow.Icon, { source: getAsset("PersonIcon", "ic_account_circle_24px") }),
                            onPress: function () {
                                simulateSwitch(fa);
                                forceUpdate();
                            },
                            onLongPress: function () {
                                removeFromSwitcher(fa.id);
                                forceUpdate();
                                showToastMsg("Removed " + fa.username + " from Switcher", "TrashIcon");
                            }
                        });
                    }),
                    React.createElement(TableRow, {
                        label: "Set Local Custom Status (My Account)",
                        subLabel: (statuses[currentUid] && statuses[currentUid].text) ? ('Current: "' + statuses[currentUid].text + '"') : "Set a local custom status on your profile",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("ChatBubbleIcon", "ic_chat") }),
                        onPress: function () {
                            if (!currentUid) return;
                            promptLocalCustomStatusModal({
                                id: currentUid,
                                username: (targetUserObj && targetUserObj.username) || "Me",
                                globalName: targetUserObj && targetUserObj.globalName
                            });
                        }
                    }),
                    React.createElement(TableRow, {
                        label: "Set Local Custom Status (By User ID)",
                        subLabel: "Set or edit a local custom status for any Discord user",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("ChatBubbleIcon", "ic_chat") }),
                        onPress: function () {
                            promptTextField("Enter User ID for Custom Status", "", "Discord User ID", function (uid) {
                                if (!uid) return;
                                var u = (US && US.getUser && US.getUser(uid)) || { id: uid, username: "User_" + uid.slice(-4) };
                                setTimeout(function () { promptLocalCustomStatusModal(u); }, 250);
                            });
                        }
                    }),
                    Object.entries(statuses).map(function (entry) {
                        var uid = entry[0];
                        var st = entry[1];
                        return React.createElement(TableRow, {
                            key: uid,
                            label: "Status (" + uid + "): " + st.text,
                            subLabel: "Tap to remove this local custom status",
                            icon: React.createElement(TableRow.Icon, { source: getAsset("TrashIcon", "ic_message_delete") }),
                            onPress: function () {
                                deleteStatus(uid);
                                forceUpdate();
                                showToastMsg("Removed custom status for " + uid, "TrashIcon");
                            }
                        });
                    })
                ),

                // 12. Global Badges
                React.createElement(
                    TableRowGroup,
                    { title: "Global Badges", titleStyleType: "no_border" },
                    React.createElement(TableRow, {
                        label: "Global Badges API URL",
                        subLabel: globalBadgesSettings.apiUrl || "https://badges.equicord.org/",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("LinkIcon", "ic_link") }),
                        onPress: function () {
                            promptTextField("Global Badges API URL", globalBadgesSettings.apiUrl, "https://badges.equicord.org/", async function (val) {
                                if (!val) return;
                                globalBadgesSettings.apiUrl = val;
                                saveDataToStorage();
                                await loadBadges(globalBadgesSettings.apiUrl, globalBadgesSettings);
                                forceUpdate();
                            });
                        }
                    }),
                    React.createElement(TableRow, {
                        label: "Reload Global Badges",
                        subLabel: "Fetch latest Global Badges data from the configured server",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("RetryIcon", "ic_sync_24px") }),
                        onPress: async function () {
                            await loadBadges(globalBadgesSettings.apiUrl, globalBadgesSettings);
                            showToastMsg("Global Badges data reloaded successfully!", "Check");
                        }
                    }),
                    React.createElement(TableSwitchRow, {
                        label: "Tooltip Style: Do not show mod name",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("CircleInformationIcon-primary", "ic_info") }),
                        value: globalBadgesSettings.showModStyle === "none",
                        onValueChange: async function (v) {
                            if (!v) return;
                            globalBadgesSettings.showModStyle = "none";
                            saveDataToStorage();
                            await loadBadges(globalBadgesSettings.apiUrl, globalBadgesSettings);
                            forceUpdate();
                        }
                    }),
                    React.createElement(TableSwitchRow, {
                        label: "Tooltip Style: Show as prefix (e.g. Replugged - Staff)",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("CircleInformationIcon-primary", "ic_info") }),
                        value: globalBadgesSettings.showModStyle === "prefix",
                        onValueChange: async function (v) {
                            if (!v) return;
                            globalBadgesSettings.showModStyle = "prefix";
                            saveDataToStorage();
                            await loadBadges(globalBadgesSettings.apiUrl, globalBadgesSettings);
                            forceUpdate();
                        }
                    }),
                    React.createElement(TableSwitchRow, {
                        label: "Tooltip Style: Show as suffix (e.g. Staff - Replugged)",
                        icon: React.createElement(TableRow.Icon, { source: getAsset("CircleInformationIcon-primary", "ic_info") }),
                        value: globalBadgesSettings.showModStyle === "suffix",
                        onValueChange: async function (v) {
                            if (!v) return;
                            globalBadgesSettings.showModStyle = "suffix";
                            saveDataToStorage();
                            await loadBadges(globalBadgesSettings.apiUrl, globalBadgesSettings);
                            forceUpdate();
                        }
                    })
                ),

                // 13. Client Mod Badges (HideCallButtons style)
                React.createElement(
                    TableRowGroup,
                    { title: "Client Mod Badges", titleStyleType: "no_border" },
                    CLIENT_MOD_OPTIONS.map(function (opt) {
                        return React.createElement(TableSwitchRow, {
                            key: opt.value,
                            label: "Show " + opt.label + " Badges",
                            icon: React.createElement(TableRow.Icon, { source: getAsset("ShieldIcon", "ic_badge_staff") }),
                            value: Boolean(globalBadgesSettings[opt.value]),
                            onValueChange: async function (v) {
                                globalBadgesSettings[opt.value] = v;
                                saveDataToStorage();
                                await loadBadges(globalBadgesSettings.apiUrl, globalBadgesSettings);
                                forceUpdate();
                            }
                        });
                    })
                )
            )
        );
    }

    function onAccountSwitch(event) {
        var newUid = event && event.user && event.user.id;
        syncCurrentUserData(newUid);
        resetCustomProfileCache();
        forceAccountPanelRerender();
    }

    var pluginExport = {
        onLoad: function () {
            loadDataFromStorage();
            initCustomStatuses();
            initFakeAccount();
            installStoreHooks();
            loadBadges(globalBadgesSettings.apiUrl, globalBadgesSettings);
            FluxDispatcher.subscribe("CONNECTION_OPEN", onAccountSwitch);
            FluxDispatcher.subscribe("MULTI_ACCOUNT_SWITCH_SUCCESS", onAccountSwitch);
            FluxDispatcher.subscribe("MULTI_ACCOUNT_SWITCH_ATTEMPT", onAccountSwitch);
            if (isEnabled) forceAccountPanelRerender();
        },
        onUnload: function () {
            FluxDispatcher.unsubscribe("CONNECTION_OPEN", onAccountSwitch);
            FluxDispatcher.unsubscribe("MULTI_ACCOUNT_SWITCH_SUCCESS", onAccountSwitch);
            FluxDispatcher.unsubscribe("MULTI_ACCOUNT_SWITCH_ATTEMPT", onAccountSwitch);
            cleanupFakeAccount();
            stopCustomStatuses();
            uninstallStoreHooks();
            forceAccountPanelRerender();
        },
        settings: Settings
    };

    return exports.default = pluginExport, Object.defineProperty(exports, "__esModule", { value: true }), exports;
})({}, vendetta.metro, vendetta.patcher, vendetta.ui.assets, vendetta.plugin, vendetta.storage, vendetta.ui, vendetta.utils);
