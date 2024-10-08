import MaxWidtWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";
import { PRODUCT_CATEGORIES } from "@/config";

type Param = string | string[] | undefined;

interface ProductPageProps {
  searchParams: { [key: string]: Param };
}

const parse = (param: Param) => {
  return typeof param === "string" ? param : undefined;
};

const ProductsPage = ({ searchParams }: ProductPageProps) => {
  const sort = parse(searchParams.sort);
  const category = parse(searchParams.category);

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === category
  )?.label;

  return (
    <MaxWidtWrapper>
      <ProductReel
        title={label ?? "Selaa tuotteita"}
        query={{
          category,
          limit: 40,
          sort: sort === "desc" || sort === "asdc" ? sort : undefined,
        }}
      />
    </MaxWidtWrapper>
  );
};

export default ProductsPage;
