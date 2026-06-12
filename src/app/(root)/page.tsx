
import HeroSection from './components/hero-area'
import Categories from './components/categories'
import SliderCategories from './components/SliderCategories'
import SectionHeader from '@/components/shared/SectionHeader';
import NewProducts from './components/NewProducts';
import TopSelling from './components/TopSelling';
import FeatureProducts from './components/FeatureProducts';
import OfferProducts from './components/OfferProducts';
import ContactUsComponent from './contact-us/components/ContactUsComponent';
import CompanyIntroduction from './components/CompanyIntroduction';
import WhyChooseUs from './components/WhyChooseUs';
import CustomerReviews from './components/CustomerReviews';
import { FaqPageComponent } from './components/FaqComponent';
import { getAppSetting } from '@/lib/get-app-setting';

const HomePage = async () => {

  const appSetting = await getAppSetting();

  const enableCategory = appSetting?.layouts?.categorySection || 1;

  if (!appSetting) return <div>Loading...</div>

  return (
    <div>
      {
        appSetting?.features?.bannerSlider &&
        <HeroSection />
      }


      {
        appSetting?.features?.aboutCompany &&
        <CompanyIntroduction />
      }


      {
        appSetting?.features?.whyChooseUs &&
        <WhyChooseUs />
      }




      {
        enableCategory === 1 ?
          <SliderCategories /> :
          <Categories />
      }

      {/* Latest product section */}
      {
        appSetting?.features?.latestSection &&
        <section className=" py-4 lg:py-10 px-2">
          <SectionHeader title='New Products' description="Explore your popular products, you can buy here." seeAllLink='/shop' seeAllText='All Products' className='pb-4' />
          <NewProducts />
        </section>
      }



      {/* top Selling product section */}
      {
        appSetting?.features?.bestSelling &&
        <section className=" py-10 px-2">
          <SectionHeader title='Best Selling Products' description="Explore your popular products, you can buy here." seeAllLink='/shop' seeAllText='All Products' className='pb-4' />
          <TopSelling />
        </section>
      }


      {/* Feature products */}
      {
        appSetting?.features?.featureSection &&
        <section className=" py-10 px-2">
          <SectionHeader title='Features Products' description="Explore your popular products, you can buy here." seeAllLink='/shop' seeAllText='All Products' className='pb-4' />
          <FeatureProducts />
        </section>
      }


      {/* Offer products */}
      {
        appSetting?.features?.offerSection &&
        <section className=" py-10 px-2">
          <SectionHeader title='Offer Products' description="Explore your popular products, you can buy here." seeAllLink='/shop' seeAllText='All Products' className='pb-4' />
          <OfferProducts />
        </section>
      }

      {
        appSetting?.features?.faq &&
      <FaqPageComponent />
      }

       {
        appSetting?.features?.review &&
      <CustomerReviews />
      }

       {
        appSetting?.features?.contact &&
      <ContactUsComponent />
      }


    </div>
  )
}

export default HomePage