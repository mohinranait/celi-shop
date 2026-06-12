import {
  ShieldCheck,
  Truck,
  Award,
  Headphones,
} from "lucide-react";


const features = [
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    description:
      "All products are manufactured with the highest quality standards.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Reliable shipping and timely delivery across all locations.",
  },
  {
    icon: Award,
    title: "17+ Years Experience",
    description:
      "Long industry experience with thousands of satisfied clients.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our expert team is always ready to help customers.",
  },
];


export default function WhyChooseUs() {
  return (
    <section className="bg-muted/40 py-20">

      <div className="container mx-auto">

        <div className="text-center mb-14">

          <p className="text-primary font-semibold">
            Why Choose Us
          </p>


          <h2 className="text-4xl font-bold mt-3">
            We Deliver Quality You Can Trust
          </h2>

        </div>


        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {features.map((item) => {

            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                  bg-background
                  rounded-xl
                  p-6
                  border
                  hover:shadow-lg
                  transition
                "
              >

                <div className="
                    w-14 h-14 rounded-full 
                    bg-primary/10 
                    flex items-center justify-center 
                    mb-5
                ">
                  <Icon className="text-primary"/>
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