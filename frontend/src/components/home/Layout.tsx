import React from 'react'
import Header from '../Header'
import Footer from './Footer'
import Navbar from './Navbar'

const Layout = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen bg-white'>
        <Navbar />

         <main className='flex-1 w-full'>
          {children}
        </main>

        <Footer />
    </div>
  )
}

export default Layout

