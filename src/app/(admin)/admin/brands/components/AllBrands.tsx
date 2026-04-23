'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import React, { useState } from 'react'
import BrandForm from './BrandForm';
import { GlobalModal } from '@/components/shared/GlobalModal';
import { Switch } from '@/components/ui/switch';

const AllBrands = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className='max-w-7xl mx-auto'>
       <Switch  />
     <div>
       <div>
        <h1 className='text-2xl font-bold mb-4'>All Brands</h1>
        <p className='text-gray-600'>List of all brands will be displayed here.</p>
      </div>
      <div>
        <Button onClick={() => setIsOpen(true)} type='button'>
          Add New Brand
        </Button>
      </div>
     </div>

      <Card>
        <CardContent>

        </CardContent>
      </Card>


      {/* <BrandForm isOpen={isOpen} setIsOpen={setIsOpen} /> */}

       <BrandForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  )
}

export default AllBrands