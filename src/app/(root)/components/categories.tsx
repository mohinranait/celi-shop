import { Card } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'

const Categories = () => {
  return (
    <section className="max-w-7xl mx-auto py-16 px-4">
        <h3 className="text-3xl font-bold text-foreground mb-12 text-center">Shop by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/shop?category=mens">
            <Card className="p-8 text-center hover:shadow-lg transition cursor-pointer h-full">
              <div className="bg-secondary rounded-lg h-40 flex items-center justify-center mb-4">
                <span className="text-2xl">👔</span>
              </div>
              <h4 className="text-xl font-semibold text-foreground">Men&apos;s Collection</h4>
              <p className="text-muted-foreground mt-2">Premium clothing and accessories</p>
            </Card>
          </Link>

          <Link href="/shop?category=womens">
            <Card className="p-8 text-center hover:shadow-lg transition cursor-pointer h-full">
              <div className="bg-secondary rounded-lg h-40 flex items-center justify-center mb-4">
                <span className="text-2xl">👗</span>
              </div>
              <h4 className="text-xl font-semibold text-foreground">Women&apos;s Collection</h4>
              <p className="text-muted-foreground mt-2">Stylish and elegant wear</p>
            </Card>
          </Link>

          <Link href="/shop?category=accessories">
            <Card className="p-8 text-center hover:shadow-lg transition cursor-pointer h-full">
              <div className="bg-secondary rounded-lg h-40 flex items-center justify-center mb-4">
                <span className="text-2xl">⌚</span>
              </div>
              <h4 className="text-xl font-semibold text-foreground">Accessories</h4>
              <p className="text-muted-foreground mt-2">Complete your look</p>
            </Card>
          </Link>
        </div>
      </section>
  )
}

export default Categories