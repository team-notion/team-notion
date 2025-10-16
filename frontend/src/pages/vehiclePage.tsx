import { CarouselSpacing } from '@/components/CarouselSpacing'
import Footer from '@/components/home/Footer'
import Navbar from '@/components/home/Navbar'
import TopPicks from '@/components/home/sections/TopPicks'
import Vehicles from '@/components/Vehicles'
import React from 'react'

const vehiclePage = () => {
  return (
    <div className='flex flex-col min-h-screen'>
        <Navbar />

        <main className='flex-1 w-full '>
            <TopPicks />

          
          <Vehicles />
           
        </main>

        <Footer />
    </div>
  )
}

export default vehiclePage