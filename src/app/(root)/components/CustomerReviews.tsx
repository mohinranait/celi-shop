import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Star,
  Quote,
} from "lucide-react";


const reviews = [
  {
    name: "John Smith",
    company: "ABC Industries",
    message:
      "Excellent product quality and professional service. We have been working together for years.",
  },
  {
    name: "Michael Lee",
    company: "Global Engineering",
    message:
      "Reliable supplier with outstanding customer support and fast delivery.",
  },
  {
    name: "David Wilson",
    company: "Tech Solutions",
    message:
      "Their products consistently meet our expectations and quality requirements.",
  },
];


export default function CustomerReviews() {
  return (
    <section className="py-20">

      <div className="container mx-auto">

        <div className="text-center mb-14">

          <p className="text-primary font-semibold">
            Customer Reviews
          </p>


          <h2 className="text-4xl font-bold mt-3">
            What Our Clients Say About Us
          </h2>

        </div>


        <div className="grid md:grid-cols-3 gap-6">


          {reviews.map((review) => (
            <Card key={review.name} className="relative">

              <CardContent className="p-6">

                <Quote
                  className="
                    text-primary/30
                    mb-4
                  "
                />

                <p className="text-muted-foreground mb-5">
                  {review.message}
                </p>


                <div className="flex mb-4">
                  {[1,2,3,4,5].map((star)=>(
                    <Star
                      key={star}
                      size={16}
                      fill="currentColor"
                    />
                  ))}
                </div>


                <div>
                  <h4 className="font-bold">
                    {review.name}
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    {review.company}
                  </p>
                </div>


              </CardContent>


            </Card>
          ))}


        </div>

      </div>

    </section>
  );
}