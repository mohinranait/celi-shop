import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const HeroSection = () => {
  return (
     
      <section className="container mx-auto bg-gradient-to-r from-foreground/10 mt-2 rounded-md to-secondary text-background py-20 px-4">
        <div className="max-w-7xl mx-auto text-center py-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            Discover Premium Products
          </h2>
          <p className="text-lg md:text-xl mb-8 text-foreground opacity-90">
            Explore our curated collection of high-quality products with multiple variants to choose from
          </p>
          <Link href="/shop">
            <Button size="lg" className="bg-background text-foreground hover:bg-secondary">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
  )
}

export default HeroSection