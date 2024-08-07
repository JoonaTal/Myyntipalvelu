import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        const verificationLink = `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${encodeURIComponent(token)}`;
        return `
          <p>Click the link below to verify your email address:</p>
          <a href="${verificationLink}" target="_blank" rel="noopener noreferrer">Verify your account</a>
        `;
      },
    },
  },
  access: {
    read: () => true,
    create: () => true,
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
