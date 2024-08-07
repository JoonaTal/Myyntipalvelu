import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../get-payload"; //Server-side eli ei absoluuttista tietä = "@"
import { stripe } from "../lib/stripe";
import Stripe from "stripe";
import { Product } from "../payload-types";

//TypeGuard taas...
function isProduct(obj: any): obj is Product {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.price === "number" &&
    typeof obj.category === "string" &&
    typeof obj.product_files !== "undefined" &&
    Array.isArray(obj.images) &&
    typeof obj.updatedAt === "string" &&
    typeof obj.createdAt === "string"
  );
}

export const paymentRouter = router({
  createSession: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      let { productIds } = input;

      if (productIds.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const payload = await getPayloadClient();

      const result = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
      });

      const products = result.docs.filter(isProduct);

      const filteredProducts = products.filter((prod) => Boolean(prod.priceId));

      const order = await payload.create({
        collection: "orders",
        data: {
          _isPaid: false,
          products: filteredProducts.map((prod) => prod.id as string),
          user: user.id,
        },
      });

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      filteredProducts.forEach((product) => {
        line_items.push({
          price: product.priceId as string, // Assert that priceId is a string
          quantity: 1,
        });
      });

      line_items.push({
        price: "price_1PlAfRGDpEwc4NsR2u3Xjyih",
        quantity: 1,
        adjustable_quantity: {
          enabled: false,
        },
      });

      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ["card", "paypal"],
          mode: "payment",
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          line_items,
        });

        return { url: stripeSession.url };
      } catch (err) {
        console.log(err);

        return { url: null };
      }
    }),

  pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input;

      const payload = await getPayloadClient();

      const { docs: orders } = await payload.find({
        collection: "orders",
        where: {
          id: {
            equals: orderId,
          },
        },
      });

      if (!orders.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [order] = orders;

      return { isPaid: order._isPaid };
    }),
});
