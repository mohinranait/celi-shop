import Link from "next/link";
import FooterLogo from "./FooterLogo";
import { fetchData } from "@/lib/fetch-data";
import { IAppSettings } from "@/models/app-setting";

const Footer = async () => {
    const appSetting = await fetchData<IAppSettings>({
      api: "admin/setting",
      revalidate: 3600,
      
    },1);

    const {siteName,footerLogo, siteDescription} = appSetting || {};

  return (
    <footer className="bg-foreground text-background py-12 px-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
         <FooterLogo logo={footerLogo} siteName={siteName}  />
         {
          siteDescription && 
          <p className="text-sm opacity-75 pt-2">
            {siteDescription}
          </p>
          }
        </div>
        <div>
          <h4 className="font-bold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/shop" className="hover:opacity-75">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/shop?category=mens" className="hover:opacity-75">
                Men
              </Link>
            </li>
            <li>
              <Link href="/shop?category=womens" className="hover:opacity-75">
                Women
              </Link>
            </li>
            <li>
              <Link
                href="/shop?category=accessories"
                className="hover:opacity-75"
              >
                Accessories
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Help</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/contact-us" className="hover:opacity-75">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:opacity-75">
                Shipping Info
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:opacity-75">
                Returns
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:opacity-75">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Account</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/user-auth" className="hover:opacity-75">
                Login
              </Link>
            </li>
            <li>
              <Link href="/user-auth" className="hover:opacity-75">
                Register
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:opacity-75">
                Cart
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm opacity-75">
        <p>&copy; 2024 {siteName}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
