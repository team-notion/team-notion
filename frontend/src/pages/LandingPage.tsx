import Layout from '@/components/home/Layout'
import About from '@/components/home/sections/About'
import Clients from '@/components/home/sections/Clients'
import Hero from '@/components/home/sections/Hero'
import { Picks } from '@/components/home/sections/Picks'
import TopPicks from '@/components/home/sections/TopPicks'
import Review from '@/components/home/sections/Review'
import Stats from '@/components/home/sections/Stats'
import React from 'react'

const LandingPage = () => {
  return (
    <Layout>
      <Hero />
      <Clients />
      <About />
      <Stats />
      <Picks />
      <TopPicks />
      <Review />
    </Layout>
  )
}

export default LandingPage