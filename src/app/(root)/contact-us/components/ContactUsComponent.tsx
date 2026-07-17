import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import ContactForm from "./ContactUsForm";
import { getAppSetting } from "@/lib/get-app-setting";
import SectionHeader from "@/components/shared/SectionHeader";

const ContactUsComponent = async () => {


  const settings = await getAppSetting();
    

  return (
    <section className="py-16 bg-slate-50">

      <div className="max-w-7xl mx-auto px-4">

       

        <SectionHeader className="mb-6" title={"Contact Our Support Team"} description="Have questions about your order, shipping,
            returns, or products? We are here to help." />


        <div className="grid lg:grid-cols-2 gap-8">

          {/* Contact Form */}

          <Card className="py-5">

            <CardHeader>
              <CardTitle className="text-2xl">
                Send Us a Message
              </CardTitle>

              <p className="text-slate-600">
                Fill out the form below and our team will get back to you.
              </p>

            </CardHeader>


            <CardContent>
              <ContactForm />
            </CardContent>

          </Card>


          {/* Store Info */}

          <div className="space-y-6">

            <Card className="py-5">

              <CardHeader>
                <CardTitle>
                  Customer Support
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">

                <div className="flex gap-3">
                  <Mail />
                  <div>
                    <p className="font-medium">
                      Email
                    </p>
                    <p className="text-muted-foreground">
                      {settings?.contactEmail}
                    </p>
                  </div>
                </div>


                <div className="flex gap-3">
                  <Phone />
                  <div>
                    <p className="font-medium">
                      Phone
                    </p>
                    <p className="text-muted-foreground">
                      {settings?.contactPhone}
                    </p>
                  </div>
                </div>


                {/* <div className="flex gap-3">
                  <Clock />
                  <div>
                    <p className="font-medium">
                      Working Hours
                    </p>

                    <p className="text-muted-foreground">
                      Saturday - Thursday
                      <br />
                      9:00 AM - 8:00 PM
                    </p>

                  </div>
                </div> */}


              </CardContent>

            </Card>


            <Card className="py-5">

              <CardHeader>
                <CardTitle>
                  Store Location
                </CardTitle>
              </CardHeader>


              <CardContent className="flex gap-3">

                <MapPin />

                <p className="text-muted-foreground">
                  {settings?.address?.city}, {" "}
                  {settings?.address?.state}, {" "}
                  {settings?.address?.street}, {" "}
                  {settings?.address?.zipCode}, {" "}
                  {settings?.address?.country},
                </p>

              </CardContent>

            </Card>

          </div>

        </div>

      </div>

    </section>
  )
}

export default ContactUsComponent