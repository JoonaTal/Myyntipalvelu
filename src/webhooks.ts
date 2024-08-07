import express from "express"
import { WebhookRequest } from "./server"
import { stripe } from "./lib/stripe"
import type Stripe from "stripe"
import { getPayloadClient } from "./get-payload"
import { Product } from "./payload-types"
import { Resend } from "resend"
import { ReceiptEmailHtml } from "./components/emails/ReceiptEmail"

const resend = new Resend(process.env.RESEND_API_KEY)

export const stripeWebHookHandler = async (
    req: express.Request,
    res: express.Response
) => {
    const webhookRequest = req as any as WebhookRequest
const body = webhookRequest.rawBody
const signature = req.headers['stripe-signature'] || ''

let event
try {
event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET || ''
)
} catch (err) {
return res
    .status(400)
    .send(
    `Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`
    )
}

const session = event.data.object as Stripe.Checkout.Session

if (!session?.metadata?.userId || !session?.metadata?.orderId) {
return res.status(400).send(`Webhook Error: No user present in metadata`)
}

if (event.type === 'checkout.session.completed') {
const payload = await getPayloadClient()

const { docs: users } = await payload.find({
    collection: 'users',
    where: {
    id: {
        equals: session.metadata.userId,
    },
    },
})

const [user] = users

if (!user) return res.status(404).json({ error: 'No such user exists.' })

const { docs: orders } = await payload.find({
    collection: 'orders',
    depth: 2,
    where: {
    id: {
        equals: session.metadata.orderId,
    },
    },
})

const [order] = orders

if (!user) return res.status(404).json({ error: 'No such order exists.' })

await payload.update({
    collection: 'orders',
    data: {
    _isPaid: true,
    },
    where: {
    id: {
        equals: session.metadata.orderId,
    },
    },
})

// typesafety taas, yllätys
try {
    // Ensure `user.email` is a string
    const userEmail = typeof user.email === 'string' ? user.email : '';
  
    // Ensure `session.metadata.orderId` is a string
    const orderId = typeof session.metadata.orderId === 'string' ? session.metadata.orderId : '';
  
    const data = await resend.emails.send({
      from: 'Joona Talkara <joonatal@hotmail.com>',
      to: [userEmail],
      subject: 'Kiitos tilauksestasi! Tässä kuitti.',
      html: ReceiptEmailHtml({
        date: new Date(),
        email: userEmail,
        orderId: orderId,
        products: order.products as Product[],
      }),
    });
    
    res.status(200).json({ data });
  } catch (error) {
    // Ensure error is of type Error and provide a meaningful message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
}

return res.status(200).send()
}