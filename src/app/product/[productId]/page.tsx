import MaxWidtWrapper from "@/components/MaxWidthWrapper";
import { getPayloadClient } from "@/get-payload";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Product } from "@/payload-types"; // Import the Product type
import { formatPrice } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/config";
import { Check, Shield } from "lucide-react";
import ImageSlider from "@/components/ImageSlider";
import ProductReel from "@/components/ProductReel";
import AddToCartButton from "@/components/AddToCartButton";

interface PageProps {
  params: {
    productId: string;
  };
}

const BREADCRUMBS = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "Products", href: "/products" },
];

//Type Guard
const isProduct = (value: any): value is Product => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.name === "string" &&
    typeof value.price === "number" &&
    typeof value.category === "string" &&
    "product_files" in value
  );
};

const Page = async ({ params }: PageProps) => {
  const { productId } = params;

  const payload = await getPayloadClient();

  const { docs: products } = await payload.find({
    collection: "products",
    limit: 1,
    where: {
      id: {
        equals: productId,
      },
      approvedForSale: {
        equals: "approved",
      },
    },
  });

  const product = products[0];

  //type guard
  if (!product || !isProduct(product)) return notFound();

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label;

  const validUrls = product.images
    .map(({ image }) => (typeof image === "string" ? image : image.url))
    .filter(Boolean) as string[];

  return (
    <MaxWidtWrapper className="bg-white">
      <div className="bg-white">
        <div className="mx-auto max-w-2x1 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          {/* Product details*/}
          <div className="lg:max-w-1g lg:self-end">
            <ol className="flex items-center space-x-2">
              {BREADCRUMBS.map((breadcrumb, i) => (
                <li key={breadcrumb.href}>
                  <div className="flex items-center text-sm">
                    <Link
                      href={breadcrumb.href}
                      className="font-medium text-sm text-muted-foreground hover:text-gray-900"
                    >
                      {breadcrumb.name}
                    </Link>
                    {i !== BREADCRUMBS.length - 1 ? (
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-4">
              <h1 className="text-3x1 font-bold tracking-tight text-gray-900 sm:text-4x1">
                {product.name}
              </h1>
            </div>

            <section className="mt-4">
              <div className="flex items-center">
                <p>{formatPrice(product.price)}</p>

                <div className="ml-4 border-1 text-muted-foreground border-gray-300 pl-4">
                  {label}
                </div>
              </div>

              <div className="mt-4 space-y-6">
                <p className="text-base text-muted-foreground">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 flex items-center">
                <Check
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-green-500"
                />
                <p className="ml-2 text-sm text-muted-foreground">
                  Eligible for instant delivery
                </p>
              </div>
            </section>
          </div>

          {/*kuvat */}
          <div className="mt-10 lg:col-start-2 lg:row-start-2 lg:mt-0 lg:self-center">
            <div className="aspect-square rounded-lg">
              <ImageSlider urls={validUrls} />
            </div>
          </div>

          {/* lisaa ostoskoriin */}
          <div className="mt-10 lg:col-start-1 lg:row-span-2 lg:max-w-lg lg:self-start">
            <div>
              <div className="mt-10">
                <AddToCartButton product={product} />
              </div>
              <div className="mt-6 text-center">
                <div className="group inline-flex text-sm text-medium">
                  <Shield
                    aria-hidden="true"
                    className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400"
                  />
                  <span className="text-muted-foreground hover:text-gray-700">
                    30 day return
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductReel
        href="/products"
        query={{ category: product.category, limit: 4 }}
        title={`Similar ${label}`}
        subtitle={`Browse similar ${label} just like ${product.name}`}
      />
    </MaxWidtWrapper>
  );
};

export default Page;
