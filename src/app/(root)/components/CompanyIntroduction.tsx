import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function CompanyIntroduction() {
  return (
    <section className="py-20">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* Image */}
        <div>
          <Image
            src="https://cdn.prod.website-files.com/605826c62e8de87de744596e/6298b33e6aafa619b517757c_Blog-Coverasdfghjs.jpg"
            alt="Company"
            width={450}
            height={450}
            className="w-full h-112.5 object-cover rounded-2xl"
          />
        </div>


        {/* Content */}
        <div>
          <p className="text-primary font-semibold mb-3">
            About Our Company
          </p>

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            17+ Years of Excellence in Delivering Premium Industrial Products
          </h2>


          <p className="text-muted-foreground mb-4">
            We are a trusted supplier of high-quality industrial equipment,
            machinery and solutions serving customers worldwide.
          </p>


          <p className="text-muted-foreground mb-8">
            With more than 17 years of experience, we focus on innovation,
            reliability, and customer satisfaction to deliver products that
            exceed industry standards.
          </p>


          <Button>
            Learn More
            <ArrowRight className="ml-2 h-4 w-4"/>
          </Button>
        </div>

      </div>
    </section>
  );
}