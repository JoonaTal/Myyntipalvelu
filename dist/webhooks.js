"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebHookHandler = void 0;
const stripe_1 = require("./lib/stripe");
const get_payload_1 = require("./get-payload");
const resend_1 = require("resend");
const ReceiptEmail_1 = require("./components/emails/ReceiptEmail");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const stripeWebHookHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const webhookRequest = req;
    const body = webhookRequest.rawBody;
    const signature = req.headers['stripe-signature'] || '';
    let event;
    try {
        event = stripe_1.stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || '');
    }
    catch (err) {
        return res
            .status(400)
            .send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`);
    }
    const session = event.data.object;
    if (!((_a = session === null || session === void 0 ? void 0 : session.metadata) === null || _a === void 0 ? void 0 : _a.userId) || !((_b = session === null || session === void 0 ? void 0 : session.metadata) === null || _b === void 0 ? void 0 : _b.orderId)) {
        return res.status(400).send(`Webhook Error: No user present in metadata`);
    }
    if (event.type === 'checkout.session.completed') {
        const payload = yield (0, get_payload_1.getPayloadClient)();
        const { docs: users } = yield payload.find({
            collection: 'users',
            where: {
                id: {
                    equals: session.metadata.userId,
                },
            },
        });
        const [user] = users;
        if (!user)
            return res.status(404).json({ error: 'No such user exists.' });
        const { docs: orders } = yield payload.find({
            collection: 'orders',
            depth: 2,
            where: {
                id: {
                    equals: session.metadata.orderId,
                },
            },
        });
        const [order] = orders;
        if (!user)
            return res.status(404).json({ error: 'No such order exists.' });
        yield payload.update({
            collection: 'orders',
            data: {
                _isPaid: true,
            },
            where: {
                id: {
                    equals: session.metadata.orderId,
                },
            },
        });
        // typesafety taas, yllätys
        try {
            // Ensure `user.email` is a string
            const userEmail = typeof user.email === 'string' ? user.email : '';
            // Ensure `session.metadata.orderId` is a string
            const orderId = typeof session.metadata.orderId === 'string' ? session.metadata.orderId : '';
            const data = yield resend.emails.send({
                from: 'Joona Talkara <joonatal@hotmail.com>',
                to: [userEmail],
                subject: 'Kiitos tilauksestasi! Tässä kuitti.',
                html: (0, ReceiptEmail_1.ReceiptEmailHtml)({
                    date: new Date(),
                    email: userEmail,
                    orderId: orderId,
                    products: order.products,
                }),
            });
            res.status(200).json({ data });
        }
        catch (error) {
            // Ensure error is of type Error and provide a meaningful message
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: errorMessage });
        }
    }
    return res.status(200).send();
});
exports.stripeWebHookHandler = stripeWebHookHandler;
