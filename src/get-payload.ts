import dotenv from "dotenv";
import path from "path";
import type { InitOptions } from "payload/config";
import payload, { Payload } from "payload";
import nodemailer from "nodemailer";

// Load environment variables from the .env file
dotenv.config({
  path: path.resolve(__dirname, "../.env"), // Adjust the path as needed
});

// Set up Nodemailer transport
const transporter = nodemailer.createTransport({
  host: "smtp.resend.com", // Ensure this is correct
  secure: true, // Use TLS
  port: 465, // Common port for SMTP over TLS
  auth: {
    user: "resend", // Ensure this is correct
    pass: process.env.RESEND_API_KEY, // Make sure this is set in your .env
  },
});

let cached = (global as any).payload;

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  };
}

interface Args {
  initOptions?: Partial<InitOptions>;
}

export const getPayloadClient = async ({
  initOptions,
}: Args = {}): Promise<Payload> => {
  // Ensure PAYLOAD_SECRET is set
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is missing");
  }

  // Return cached client if it exists
  if (cached.client) {
    return cached.client;
  }

  // Initialize Payload client if not cached
  if (!cached.promise) {
    cached.promise = payload.init({
      email: {
        transport: transporter,
        fromAddress: "onboarding@resend.dev", // Ensure this is correct
        fromName: "KouluProjekti", // Customize as needed
      },
      secret: process.env.PAYLOAD_SECRET,
      local: initOptions?.express ? false : true,
      ...(initOptions || {}),
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (e: unknown) {
    cached.promise = null;
    throw e;
  }

  // Return the cached client
  return cached.client;
};
