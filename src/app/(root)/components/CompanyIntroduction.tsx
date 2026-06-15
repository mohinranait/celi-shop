import { Button } from "@/components/ui/button";
import { fetchData } from "@/lib/fetch-data";
import { cn } from "@/lib/utils";
import { ISiteContentResponse } from "@/redux/service/site-content/type";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function CompanyIntroduction() {
  const fetchsiteContent = await fetchData<ISiteContentResponse>({
    api: "admin/site-content",
    revalidate: 3000,
  }, 1);

  const siteContent = fetchsiteContent?.data;
  const company = siteContent?.companyIntroduction;


  return (
    <section className=" py-6 lg:py-16">
      <div className="container px-4 lg:px-0 mx-auto grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">

        {/* Image */}
        <div className={cn("", !company?.image?.url && "hidden lg:block")}>
          {
            company?.image?.url ?
              <Image
                src={company?.image?.url}
                alt={company?.image?.alt || 'Image'}
                width={450}
                height={450}
                className="w-full h-112.5 object-cover rounded-2xl"
              /> : <div className="w-full h-48 lg:h-112.5 bg-gray-100 flex items-center justify-center">Need image here</div>
          }
        </div>


        {/* Content */}
        <div>
          <p className="text-primary font-semibold mb-3">
            {company?.title || "About our company"}
          </p>

          <h2 className="text-2xl lg:text-4xl font-bold mb-6 leading-tight">
            {company?.heading || "Excellence"}
          </h2>


          {
            company?.description1 &&
            <p className="text-muted-foreground mb-4">
              {company?.description1}
            </p>
          }
          {
            company?.description2 &&
            <p className={cn("text-muted-foreground ", company?.buttonLink && company?.buttonText && 'mb-6')}>
              {company?.description2}
            </p>
          }



          {
            (company?.buttonLink && company?.buttonText) &&
            <Link href={company?.buttonLink} >
              <Button>
                {company?.buttonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          }
        </div>

      </div>
    </section>
  );
}