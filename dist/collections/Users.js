"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
exports.Users = {
    slug: "users",
    auth: {
        verify: {
            generateEmailHTML: function (_a) {
                var token = _a.token;
                var verificationLink = "".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/verify-email?token=").concat(encodeURIComponent(token));
                return "\n          <p>Click the link below to verify your email address:</p>\n          <a href=\"".concat(verificationLink, "\" target=\"_blank\" rel=\"noopener noreferrer\">Verify your account</a>\n        ");
            },
        },
    },
    access: {
        read: function () { return true; },
        create: function () { return true; },
    },
    fields: [
        {
            name: "role",
            defaultValue: "user",
            required: true,
            type: "select",
            options: [
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" },
            ],
        },
    ],
};
