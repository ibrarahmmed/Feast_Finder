import React from 'react'
import Banner from '../../components/Banner'
import Catagories from './Catagories'
import OurServices from './OurServices'
import SpecialDishes from './SpecialDishes'
import Testimonials from './Testimonials'

const Home = () => {
  return (
    <div>
      <Banner/>
      <Catagories/>
      <SpecialDishes/>
      <Testimonials/>
      <OurServices/>
    </div>
  )
}

export default Home