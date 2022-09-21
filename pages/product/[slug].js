import React, { useState } from 'react'
import { AiFillStar, AiOutlineMinus, AiOutlinePlus, AiOutlineStar } from 'react-icons/ai';
import { Product } from '../../components';
import { useStateContext } from '../../context/StateContext';

import { client, urlFor } from '../../lib/client'

const ProductDetails = ({ product, products }) => {

    console.log(product);
    console.log(products);

    const { image, name, details, price } = product;

    const [index, setIndex] = useState(0);
    const { qty, incQty, decQty, onAdd, setshowCart } = useStateContext();
    const handleBuyNow = () => {
        onAdd(product, qty);

        setshowCart(true);
    }

    return (
        <div>
            <div className="product-detail-container">
                <div>
                    <div className='image-container'>
                        <img src={ urlFor(image && image[index]) } alt="" className='product-detail-image' />
                    </div>
                    {/*Commentaire*/ }
                    <div className="small-images-container">
                        { image?.map((item, i) => (
                            <img src={ urlFor(item) } key={ i } className={ i === index ? 'small-image selected-image' : 'small-image' } onMouseEnter={ () => setIndex(i) } />
                        )) }
                    </div>

                </div>

                <div className="product-detail-desc">
                    <h1>{ name }</h1>
                    <div className="reviews">
                        <div>
                            <AiFillStar />
                            <AiFillStar />
                            <AiFillStar />
                            <AiFillStar />
                            <AiOutlineStar />
                        </div>
                        <p>
                            (20)
                        </p>
                    </div>
                    <h4>Details: </h4>
                    <p> { details } </p>
                    <p className="price">$ { price } </p>
                    <div className="quantity">
                        <h3>Quantity :</h3>
                        <p className="quantity-desc">
                            <span className="minus" onClick={ decQty }><AiOutlineMinus /></span>
                            <span className="num" >{ qty }</span>
                            <span className="plus" onClick={ incQty }><AiOutlinePlus /></span>
                        </p>
                    </div>
                    <div className="buttons">
                        <button className='add-to-cart' type='button' onClick={ () => onAdd(product, qty) }>Add to Cart</button>
                        <button className='buy-now' type='button' onClick={ handleBuyNow }>Buy Now</button>
                    </div>
                </div>
            </div>

            <div className="maylike-products-wrapper">
                <h2>You may also like</h2>
                <div className="marquee">
                    <div className="maylike-products-container track">{
                        products?.map((product) => (
                            <Product key={ product._id } product={ product } />
                        )) }
                    </div>
                </div>
            </div>

        </div>
    )
}

// pages/posts/[id].js
export async function getStaticPaths() {
    if (process.env.SKIP_BUILD_STATIC_GENERATION) {
        return {
            paths: [],
            fallback: 'blocking',
        }
    }

    const query = `*[_type == "product"]{
        slug{
            current
        }
    }`;

    const products = await client.fetch(query);

    const paths = products.map((product) => ({
        params: { slug: product.slug.current },
    }));

    // { fallback: false } means other routes should 404
    return { paths, fallback: false }
}


// This gets called on every request
export async function getStaticProps({ params: { slug } }) {

    const productquery = '*[_type == "product"]';
    const products = await client.fetch(productquery)

    const productsquery = `*[_type == "product" && slug.current == '${slug}'][0]`;
    const product = await client.fetch(productsquery)


    // Pass data to the page via props '"const data = await res.json()" jsaickjfai'
    return { props: { product, products } }
}


export default ProductDetails