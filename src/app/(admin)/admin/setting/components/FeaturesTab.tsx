
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { IAppSettings } from '@/models/app-setting';
type FeatureKey =
  | "wishlist"
  | "productReview"
  | "couponSystem"
  | "flashSale"
  | "bannerSlider"
  | "guestOrder"
  | "latestSection"
  | "offerSection"
  | "featureSection"
  | "bestSelling"
  | "faq"
  | "review"
  | "contact"
  | "whyChooseUs"
  | "aboutCompany";


const featureList: { key: FeatureKey; label: string }[] = [
  { key: "wishlist", label: "Wishlist System" },
  { key: "productReview", label: "Product Reviews" },
  { key: "couponSystem", label: "Coupon System" },
  { key: "flashSale", label: "Flash Sale" },
  { key: "bannerSlider", label: "Banner Slider" },
  { key: "guestOrder", label: "Guest Order" },
  { key: "latestSection", label: "Latest Section" },
  { key: "offerSection", label: "Offer Section" },
  { key: "featureSection", label: "Feature Section" },
  { key: "bestSelling", label: "Best Selling" },
  { key: "faq", label: "FAQ Section" },
  { key: "review", label: "Review System" },
  { key: "contact", label: "Contact Section" },
  { key: "whyChooseUs", label: "Why Choose US section" },
  { key: "aboutCompany", label: "About Company Section" },
];


type Props = {
  settings: IAppSettings;
  callBack: (key: string, value: boolean) => void
}
const FeaturesTab = ({ settings, callBack }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Management</CardTitle>
        <CardDescription>Enable or disable website features</CardDescription>
      </CardHeader>
      <CardContent className=" grid grid-cols-2 gap-4">
        {featureList.map((f) => (
          <div key={f.key} className="flex items-center bg-muted justify-between py-2 rounded px-3  ">
            <p className="font-medium">{f.label}</p>
            <Switch
              checked={settings.features?.[f.key]}
              onCheckedChange={(v) => callBack(`features.${f.key}`, v)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default FeaturesTab