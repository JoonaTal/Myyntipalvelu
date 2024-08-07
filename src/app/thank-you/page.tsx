import { getServerSideUser } from "@/lib/payload-utils";
import Image from "next/image";
import { cookies } from "next/headers";
import { getPayloadClient } from "@/get-payload";
import { notFound, redirect } from "next/navigation";
import { PRODUCT_CATEGORIES } from "@/config";
import { Product, ProductFile, User } from "@/payload-types";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import PaymentStatus from "@/components/PaymentStatus";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const ThankYouPage = async ({ searchParams }: PageProps) => {
  const orderId = searchParams.orderId as string; // Ensure this is a string
  const nextCookies = cookies();

  const { user } = await getServerSideUser(nextCookies);
  const payload = await getPayloadClient();

  const { docs: orders } = await payload.find({
    collection: "orders",
    depth: 2,
    where: {
      id: {
        equals: orderId,
      },
    },
  });

  const [order] = orders;

  if (!order) return notFound();

  type OrderUser = { id: string; email: string } | string;

  const orderUserId =
    typeof order.user === "string"
      ? order.user
      : (order.user as { id: string }).id;

  if (orderUserId !== user?.id) {
    return redirect(`/sign-in?origin=thank-you&orderId=${order.id}`);
  }

  const products = order.products as Product[];
  const isPaid = typeof order._isPaid === 'boolean' ? order._isPaid : false;
  
  // Convert order.id to a string if necessary
  const orderIdString = String(order.id);

  const orderTotal = products.reduce((total, product) => {
    return total + (product.price || 0);
  }, 0);

  return (
    <main className="relative lg:min-h-full">
      <div className="hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          fill
          src="/checkout-thank-you.jpg"
          className="h-full w-full object-cover object-center"
          alt="Kiitos tilauksesta!"
        />
      </div>

      <div>
        <div className="mx-auto max-w-2x1 px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-2 lg:py-32 xl:gap-x-24">
          <div className="lg:col-start-2">
            <p className="text-sm font-medium text-blue-600">
              Tilaus onnistui!
            </p>
            <h1 className="mt-2 text-4x1 font-bold tracking-light text-gray-900 sm:tex-5xl">
              Kiitos tilauksesta!
            </h1>

            {isPaid ? (
              <p className="mt-2 text-base text-muted-foreground">
                Tilaus onnistui, kuitti lähetetty:
                {typeof order.user !== "string" && (order.user as { email: string }).email ? (
                  <span className="font-medium text-gray-900">
                    {(order.user as { email: string }).email}
                  </span>
                ) : null}
                .
              </p>
            ) : (
              <p className="mt-2 text-base text-muted-foreground">
                Tilaustasi käsitellään.
              </p>
            )}

            <div className="mt-16 text-sm font-medium">
              <div className="text-muted-foreground">Tilaus nr.</div>
              <div className="mt-2 text-gray-900">{order.id}</div>
            </div>

            <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
              {products.map((product) => {
                const label = PRODUCT_CATEGORIES.find(
                  ({ value }) => value === product.category
                )?.label;

                const downloadUrl = (product.product_files as ProductFile).url as string;

                const { image } = product.images[0];

                return (
                  <li key={product.id} className="flex space-x-6 py-6">
                    <div className="relative h-24 w-24">
                      {typeof image !== "string" && image.url ? (
                        <Image
                          fill
                          src={image.url}
                          alt={`${product.name} image`}
                          className="flex-none rounded-md bg-gray-100 object-cover object-center"
                        />
                      ) : null}
                    </div>

                    <div className="flex-auto flex flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="text-gray-800">{product.name}</h3>
                        <p className="my-1">Kategoria: {label}</p>
                      </div>

                      {isPaid ? (
                        <a
                          href={downloadUrl}
                          download={product.name}
                          className="text-blue-600 hover:underline underline-offset-2"
                        >
                          Download
                        </a>
                      ) : null}
                    </div>

                    <p className="flex-none font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
              <div className="flex justify-between">
                <p>Välisumma</p>
                <p className="text-gray-900">{formatPrice(orderTotal)}</p>
              </div>

              <div className="flex justify-between">
                <p>Palvelumaksu</p>
                <p className="text-gray-900">{formatPrice(orderTotal)}</p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                <p className="text-base">Summa</p>
                <p className="text-base">{formatPrice(orderTotal + 1)}</p>
              </div>
            </div>

            <PaymentStatus 
              isPaid={isPaid} 
              orderEmail={(order.user as { email: string }).email} 
              orderId={orderIdString} // Ensure orderId is a string
            />

            <div className="mt-16 border-t border-gray-200 py-6 text-right">
              <Link href="/products" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Jatko ostoksia &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankYouPage;
