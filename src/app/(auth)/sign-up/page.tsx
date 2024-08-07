"use client";

import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "@/lib/validators/account-credentials-validator";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Ensure you're using next/navigation for client-side routing
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ZodError } from "zod";

const Page = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const { mutate, isLoading, isError, error } =
    trpc.auth.createPayloadUser.useMutation({
      onError: (err) => {
        if (err.data?.code === "CONFLICT") {
          toast.error("This email is already in use, sign in instead?");
          return;
        }

        if (err instanceof ZodError) {
          toast.error(err.issues[0].message);
          return;
        }

        toast.error("Something went wrong");
      },
      onSuccess: ({ sentToEmail }) => {
        toast.success(`Verification email sent to ${sentToEmail}`);
        router.push(`/verify-email?to=${sentToEmail}`);
      },
    });

  const onSubmit = (data: TAuthCredentialsValidator) => {
    mutate(data);
  };

  return (
    <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icons.logo className="h-20 w-20" />
          <h1 className="text-2xl font-bold">Create an account</h1>

          <Link
            className={buttonVariants({
              variant: "link",
              className: "gap-1.5",
            })}
            href="/sign-in"
          >
            Already have an account? Sign-in
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-1 py-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  className={cn({
                    "focus-visible:ring-red-500": errors.email,
                  })}
                  placeholder="you@example.com"
                />
                {errors?.email && (
                  <p className="text-red-500 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid gap-1 py-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  {...register("password")}
                  type="password"
                  className={cn({
                    "focus-visible:ring-red-500": errors.password,
                  })}
                  placeholder="Password"
                />
                {errors?.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {isError && (
                <p className="text-red-500 text-sm">{error.message}</p>
              )}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Signing up..." : "Sign up"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;





  /*const onSubmit = async ({ email, password }: TAuthCredentialsValidator) => {
    setLoading(true);
    try {
      await createPayloadUser({ email, password });
      router.push("/sign-in");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  */



//vanha:
/*"use client";

import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "@/lib/validators/account-credentials-validator";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const { data } = trpc.anyApiRoute.useQuery();
  console.log(data);

  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    //
  };

  return (
    <>
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo className="h-20 w-20" />
            <h1 className="text-2x1 font-bold">Create an account</h1>

            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
              href="/sign-in"
            >
              Already have an account? Sign-in
              <ArrowRight className="h-4 w-4"></ArrowRight>
            </Link>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register("email")}
                    className={cn({
                      "focus-visible:ring-red-500": errors.email,
                    })}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="grid gap-1 py-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    {...register("password")}
                    className={cn({
                      "focus-visible:ring-red-500": errors.password,
                    })}
                    placeholder="Password"
                  />
                </div>

                <Button>Sign up</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
*/
