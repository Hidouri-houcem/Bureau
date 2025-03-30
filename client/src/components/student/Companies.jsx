import React from 'react'
import { assets } from '../../assets/assets'

const Companies = () => {
  return (
    <div className='pt-16 '>
      <p className='text-base text-gray-500'>Trusted by learners from </p>
      <div className='flex flex-wrap items-center justify-center gap-6 md:gap-16 md:mt-10 mt-5 '>
        <a href="https://www.microsoft.com/fr-tn"><img src={assets.microsoft_logo} alt="Microsoft" className='w-20 md:w-28' /></a>
        <a href="https://www.walmart.com/"><img src={assets.walmart_logo} alt="Walmart" className='w-20 md:w-28' /></a>
        <a href="https://www.accenture.com/fr-fr"><img src={assets.accenture_logo} alt="Accenture" className='w-20 md:w-28' /></a>
        <a href="https://www.adobe.com/fr/"><img src={assets.adobe_logo} alt="Adobe" className='w-20 md:w-28' /></a>
        <a href="https://www.paypal.com/fr/home"><img src={assets.paypal_logo} alt="Paypal" className='w-20 md:w-28' /></a>
      </div>
    </div>
  )
}

export default Companies
