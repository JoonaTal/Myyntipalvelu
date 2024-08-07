"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryValidator = void 0;
const zod_1 = require("zod");
exports.QueryValidator = zod_1.z.object({
    category: zod_1.z.string().optional(),
    sort: zod_1.z.enum(["asdc", "desc"]).optional(),
    limit: zod_1.z.number().optional(),
});
