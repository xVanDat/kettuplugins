(function (exports, metro, patcher, assets, plugin, storage, ui, utils) {
    "use strict";

    var React = metro.common.React;
    var ReactNative = metro.common.ReactNative;
    var View = ReactNative.View;
    var Text = ReactNative.Text;
    var ScrollView = ReactNative.ScrollView;
    var TouchableOpacity = ReactNative.TouchableOpacity;
    var Forms = ui.components.Forms;
    var FormSection = Forms.FormSection;
    var FormRow = Forms.FormRow;
    var FormSwitch = Forms.FormSwitch;
    var FormRadioRow = Forms.FormRadioRow;
    var FormDivider = Forms.FormDivider;

    var showToast = ui.toasts.showToast;
    var showInputAlert = ui.alerts.showInputAlert;
    var useProxy = storage.useProxy;
    var pluginStorage = plugin.storage;

    var DEFAULT_SETTINGS = {
        enabled: true,
        overlayStyle: 1, // 0 = Blur, 1 = Discord Logo
        timeout: 0,      // 0 = ngay lập tức, 30 = 30s, 60 = 1m, 300 = 5m
        customReason: "Mở khoá ứng dụng Discord"
    };

    function syncConfigToNative() {
        var config = {
            enabled: pluginStorage.enabled !== false,
            overlayStyle: pluginStorage.overlayStyle !== undefined ? pluginStorage.overlayStyle : DEFAULT_SETTINGS.overlayStyle,
            timeout: pluginStorage.timeout !== undefined ? pluginStorage.timeout : DEFAULT_SETTINGS.timeout,
            customReason: pluginStorage.customReason || DEFAULT_SETTINGS.customReason
        };
        try {
            var nmp = window.nativeModuleProxy;
            var fm = (nmp && (nmp.NativeFileModule || nmp.RTNFileManager || nmp.DCDFileManager));
            if (fm && typeof fm.writeFile === "function") {
                fm.writeFile("documents", "applock_config.json", JSON.stringify(config), "utf8");
            }
        } catch (e) {
            console.warn("[DiscordAppLock] Failed to sync config to native:", e);
        }
    }

    function initDefaults() {
        if (pluginStorage.enabled === undefined) pluginStorage.enabled = DEFAULT_SETTINGS.enabled;
        if (pluginStorage.overlayStyle === undefined) pluginStorage.overlayStyle = DEFAULT_SETTINGS.overlayStyle;
        if (pluginStorage.timeout === undefined) pluginStorage.timeout = DEFAULT_SETTINGS.timeout;
        if (!pluginStorage.customReason) pluginStorage.customReason = DEFAULT_SETTINGS.customReason;
        syncConfigToNative();
    }

    function testBiometricAuth() {
        var dcdAuth = window.DCDLocalAuth;
        var reason = pluginStorage.customReason || DEFAULT_SETTINGS.customReason;
        if (dcdAuth && typeof dcdAuth.authenticate === "function") {
            dcdAuth.authenticate(reason)
                .then(function () {
                    showToast("Xác thực Touch ID / Face ID thành công!");
                })
                .catch(function (err) {
                    showToast("Xác thực thất bại: " + (err && err.message ? err.message : err));
                });
        } else {
            showToast("Tweak Native đang chạy. Vào App Switcher rồi quay lại để thử nghiệm!");
        }
    }

    function Settings() {
        useProxy(pluginStorage);
        initDefaults();

        return React.createElement(
            ScrollView,
            { style: { flex: 1 } },

            // Phần 1: Trạng thái bảo mật & Lời nhắn
            React.createElement(
                FormSection,
                { title: "BẢO MẬT SINH TRẮC HỌC (IOS)" },
                React.createElement(FormRow, {
                    label: "Bật khoá Touch ID / Face ID",
                    subLabel: "Yêu cầu xác thực vân tay, khuôn mặt hoặc mật mã iPhone khi mở Discord",
                    trailing: React.createElement(FormSwitch, {
                        value: pluginStorage.enabled,
                        onValueChange: function (val) {
                            pluginStorage.enabled = val;
                            syncConfigToNative();
                            showToast(val ? "Đã bật khoá Discord" : "Đã tắt khoá Discord");
                        }
                    })
                }),
                React.createElement(FormRow, {
                    label: "Lời nhắn xác thực (Subtitle)",
                    subLabel: pluginStorage.customReason || DEFAULT_SETTINGS.customReason,
                    onPress: function () {
                        if (typeof showInputAlert === "function") {
                            showInputAlert({
                                title: "Đổi lời nhắn xác thực",
                                placeholder: "Nhập lời nhắn hiển thị dưới popup...",
                                initialValue: pluginStorage.customReason || DEFAULT_SETTINGS.customReason,
                                onConfirm: function (val) {
                                    if (val && val.trim().length > 0) {
                                        pluginStorage.customReason = val.trim();
                                        syncConfigToNative();
                                        showToast("Đã lưu lời nhắn: " + pluginStorage.customReason);
                                    }
                                }
                            });
                        } else {
                            showToast("Lời nhắn hiện tại: " + (pluginStorage.customReason || DEFAULT_SETTINGS.customReason));
                        }
                    }
                })
            ),

            React.createElement(FormDivider, null),

            // Phần 2: Phong cách che khi vào App Switcher
            React.createElement(
                FormSection,
                { title: "CHE NỘI DUNG KHI MỞ APP SWITCHER (ĐA NHIỆM)" },
                React.createElement(FormRadioRow, {
                    label: "Nền tối + Logo Discord (Mặc định)",
                    subLabel: "Hiển thị màn hình Splash che giấu toàn bộ nội dung tin nhắn",
                    selected: pluginStorage.overlayStyle === 1,
                    onPress: function () {
                        pluginStorage.overlayStyle = 1;
                        syncConfigToNative();
                        showToast("Đã chọn: Nền tối + Logo Discord");
                    }
                }),
                React.createElement(FormRadioRow, {
                    label: "Làm mờ nền (Blur Effect)",
                    subLabel: "Hiệu ứng mờ đục toàn bộ nội dung cửa sổ chat",
                    selected: pluginStorage.overlayStyle === 0,
                    onPress: function () {
                        pluginStorage.overlayStyle = 0;
                        syncConfigToNative();
                        showToast("Đã chọn: Làm mờ nền (Blur)");
                    }
                })
            ),

            React.createElement(FormDivider, null),

            // Phần 3: Thời gian khoá lại
            React.createElement(
                FormSection,
                { title: "THỜI GIAN KHOÁ LẠI" },
                React.createElement(FormRadioRow, {
                    label: "Ngay lập tức",
                    subLabel: "Khoá ngay mỗi khi chuyển sang ứng dụng khác hoặc đa nhiệm",
                    selected: pluginStorage.timeout === 0,
                    onPress: function () {
                        pluginStorage.timeout = 0;
                        syncConfigToNative();
                        showToast("Đã chọn: Khoá ngay lập tức");
                    }
                }),
                React.createElement(FormRadioRow, {
                    label: "Sau 30 giây",
                    selected: pluginStorage.timeout === 30,
                    onPress: function () {
                        pluginStorage.timeout = 30;
                        syncConfigToNative();
                    }
                }),
                React.createElement(FormRadioRow, {
                    label: "Sau 1 phút",
                    selected: pluginStorage.timeout === 60,
                    onPress: function () {
                        pluginStorage.timeout = 60;
                        syncConfigToNative();
                    }
                }),
                React.createElement(FormRadioRow, {
                    label: "Sau 5 phút",
                    selected: pluginStorage.timeout === 300,
                    onPress: function () {
                        pluginStorage.timeout = 300;
                        syncConfigToNative();
                    }
                })
            ),

            React.createElement(FormDivider, null),

            // Phần 4: Nút thử nghiệm
            React.createElement(
                FormSection,
                { title: "KIỂM TRA HOẠT ĐỘNG" },
                React.createElement(
                    View,
                    { style: { padding: 16 } },
                    React.createElement(
                        TouchableOpacity,
                        {
                            onPress: testBiometricAuth,
                            style: {
                                backgroundColor: "#5865F2",
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                borderRadius: 8,
                                alignItems: "center"
                            }
                        },
                        React.createElement(
                            Text,
                            { style: { color: "#ffffff", fontWeight: "bold", fontSize: 15 } },
                            "Thử nghiệm mở khoá Face ID / Touch ID"
                        )
                    )
                )
            )
        );
    }

    var pluginExport = {
        onLoad: function () {
            initDefaults();
            console.log("[DiscordAppLock] Plugin Kettu loaded with custom reason support!");
        },
        onUnload: function () {
            console.log("[DiscordAppLock] Plugin Kettu unloaded!");
        },
        settings: Settings
    };

    return exports.default = pluginExport, Object.defineProperty(exports, "__esModule", { value: true }), exports;
})({}, vendetta.metro, vendetta.patcher, vendetta.ui.assets, vendetta.plugin, vendetta.storage, vendetta.ui, vendetta.utils);
