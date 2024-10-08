import MaxWidtWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";
import { Button, buttonVariants } from "@/components/ui/button";
import { CalendarFold, CheckCircle, Leaf } from "lucide-react";
import Link from 'next/link';

const perks = [
    {
        name: 'Hieno logo1',
        Icon: CalendarFold,
        description: "teksti"
    },
    {
        name: 'Hieno logo2',
        Icon: CheckCircle,
        description: "teksti"
    },
    {
        name: 'Hieno logo3',
        Icon: Leaf,
        description: "teksti"
    },
    
]

export default function Home() {
    return (
    <>
     <MaxWidtWrapper>
        <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3x1">
            <h1 className="text-4x1 font-bold tracking-tight text-gray-900 sm:text-6x1">
                SSKKY <span className='text-blue-600'>Kauppa</span>
            </h1>
            <p className="mt-6 text-lg max-w-prose">
                Tervetuloa Salon kauppatoriin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link href='/products' className={buttonVariants()}>Selaa Tuotteita</Link>
            </div>
        </div>

        <ProductReel query={{sort: "desc", limit: 4}} href="/products" title="Uusia-tuotteita"/>
    </MaxWidtWrapper>

    <section className="border-t border-gray-200 bg-gray-50">
        <MaxWidtWrapper className="py-20">
            <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
                {perks.map((perk) => (
                    <div key={perk.name} className="text-center md:flex md:items-start md:text-left lg:block lg:text-center">
                        <div className="md:flex-shrink-0 flex justify-center">
                            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900">
                                {<perk.Icon className="w-1/3 h-1/3"/>}
                            </div>
                        </div>

                        <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6"></div>
                        <h3 className="text-base font-medium text-gray-900">
                            {perk.name}
                        <p className="mt-3 text-sm text-muted-foreground">
                            {perk.description}
                        </p>
                        </h3>
                    </div>
                ))}
            </div>
        </MaxWidtWrapper>
    </section>
    </>
    )
}
