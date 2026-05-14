'use client';
import HeroSection from './components/hero-area'
import Categories from './components/categories'
import HomeProducts from './components/products-home'
import SliderCategories from './components/SliderCategories'
import { useGetAppSettingQuery } from '@/redux/service/setting'

const HomePage = () => {
  const {data} = useGetAppSettingQuery()
  const enableCategory = data?.layouts?.categorySection || 1;
  return (
    <div>
      <HeroSection />
      {
        enableCategory === 1 ? 
        <SliderCategories /> :
        <Categories />
      }
      <HomeProducts />
    </div>
  )
}

export default HomePage