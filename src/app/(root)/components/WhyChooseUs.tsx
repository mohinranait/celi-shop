import { fetchData } from "@/lib/fetch-data";
import { iconMap } from "@/lib/iconMap";
import { ISiteContentResponse } from "@/redux/service/site-content/type";

export default async function WhyChooseUs() {

  const fetchsiteContent = await fetchData<ISiteContentResponse>({
    api: "admin/site-content",
    revalidate: 3000,
  }, 1);

  const siteContent = fetchsiteContent?.data;
  const data = siteContent?.whyChooseUs;

  const features = data?.items || [];


  return (
    <section className="bg-muted/40 py-20">

      <div className="container px-4 lg:px-0 mx-auto">

        <div className="text-center mb-14">

          <p className="text-primary font-semibold">
            {data?.title}
          </p>


          <h2 className=" text-2xl lg:text-4xl font-bold mt-3">
             {data?.heading}
          </h2>

        </div>


        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {features.map((item) => {
          const Icon = iconMap[item.icon];

            return (
              <div
                key={item.title}
                className="
                  bg-background
                  rounded-xl
                  p-6
                  border
                  hover:shadow
                  transition
                "
              >

                <div className="
                    w-14 h-14 rounded-full 
                    bg-primary/10 
                    flex items-center justify-center 
                    mb-5
                ">
                  <Icon className="text-primary" />
                </div>


                <h3 className="font-bold text-lg mb-3">
                  {item.title}
                </h3>


                <p className="text-muted-foreground">
                  {item.description}
                </p>


              </div>
            );
          })}

        </div>


      </div>

    </section>
  );
}