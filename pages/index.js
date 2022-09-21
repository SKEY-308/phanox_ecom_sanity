import React from 'react'

import { client } from '../lib/client'
import { Product, FooterBanner, HeroBanner } from '../components'



const Home = ({ products, banner }) => {
  return (
    <div>
      <HeroBanner heroBanner={ banner.length && banner[0] } />
      { console.log(banner) }

      <div className="products-heading">
        <h2>Best Selling Products</h2>
        <p>Speakers of many variations</p>
      </div>

      <div className="products-container">
        { products?.map((product) => (
          <Product key={ product._id } product={ product } />
        )) }
        { console.log(products) }
      </div>

      <FooterBanner footerBanner={ banner.length && banner[0] } />
    </div>
  )

};


// This gets called on every request
export async function getServerSideProps() {
  const productquery = '*[_type == "product"]';
  const bannerquery = '*[_type == "banner"]';

  // Fetch data from external API
  const products = await client.fetch(productquery)
  const banner = await client.fetch(bannerquery)


  // Pass data to the page via props '"const data = await res.json()" jsaickjfai'
  return { props: { products, banner } }
};

export default Home
