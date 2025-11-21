import React, { useState } from 'react'
import { CarouselSpacing } from '@/components/CarouselSpacing'

export const Picks = () => {
  return (
    // RECOMMENDED PICKS
    <div className='bg-[#F5F5F5] py-20'>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl lg:text-2xl font-medium text-[#0D183A]">Recommended picks</h2>
        </div>
        <CarouselSpacing />
      </div>
    </div>
  )
}
