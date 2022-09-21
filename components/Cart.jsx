import Link from 'next/link'
import React, { useRef } from 'react'
import toast from 'react-hot-toast';
import { AiOutlineDelete, AiOutlineLeft, AiOutlineMinus, AiOutlinePlus, AiOutlineShopping } from 'react-icons/ai';
// import { TiDeleteOutline } from 'react-icons/ti';
import { useStateContext } from '../context/StateContext';

import { urlFor } from '../lib/client';
import getStripe from '../lib/getStripe';

{/*     */ }

const Cart = () => {

    // handleCheckout en faisnt appel a notr backend ki est stripe contenu ds api.stripe____________________________________________________________________________

    const handleCheckout = async () => {
        // const stripe = await getStripe(), pr 'obtenir' ou pr 'specifier' ou pr 'creer' une instance de stripe.
        const stripe = await getStripe();

        // Now we're going to make an API request to our own Nextjs backend
        // Ici, je demande à stripe d'aller m poster à cette adress "/api/stripe", mn body qui est un fichier en JSON contenant l'Array 'cartItems'
        const response = await fetch('/api/stripe', {
            method: 'POST',
            headers: { 'Context-Type': 'application/json' },
            body: JSON.stringify(cartItems),
        });

        // && Si la response.statusCode es egal à 500, c'est à dire un errmessg declarer ds "api/stripe.js" ne retourn rien 
        if (response.statusCode === 500) return;

        // Et si ce n'es pa l cas, cela signifi q ns allons recevoir des donnés 'data' qui n'est d'otr choz q response.json
        const data = await response.json();

        // Et si ns avons mtn 'data' je sort un messg avc toast en disant
        toast.loading('Redirecting...');

        // Apr on appel l'instance stripe pr dir
        stripe.redirectToCheckout({ sessionId: data.id });
    }

    // handleCheckout______________________________________________________________________________

    const cartRef = useRef();

    const {
        totalPrice, totalQuantities, cartItems, setshowCart, toogleCartItemQuantity, onRemove
    } = useStateContext();

    return (
        <div className='cart-wrapper' ref={ cartRef }>
            <div className="cart-container">
                <button type="button" className='cart-heading' onClick={ () => setshowCart(false) }>
                    <AiOutlineLeft />
                    <span className='heading'>Your Cart</span>
                    <span className='cart-num-items'>({ totalQuantities } items) </span>
                </button>

                { cartItems.length < 1 && (
                    <div className="empty-cart">
                        <AiOutlineShopping size={ 150 } />
                        <h3>Your shopping bag is empty</h3>
                        <Link href='/'>
                            <button type="button" className='btn' onClick={ () => setshowCart(false) }>
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                ) }

                <div className="product-container">
                    { cartItems.length >= 1 && cartItems.map((item) => (
                        <div className="product" key={ item._id }>
                            <img src={ urlFor(item?.image[0]) } alt="" className="cart-product-image" />
                            <div className="item-desc">
                                <div className="flex top">
                                    <h5> { item.name } </h5>
                                    <h4> ${ item.price } </h4>
                                </div>
                                <div className="flex bottom">
                                    <div>
                                        <p className="quantity-desc">
                                            <span className="minus" onClick={ () => toogleCartItemQuantity(item._id, 'dec') }><AiOutlineMinus /></span>
                                            <span className="num"> { item.quantity } </span>
                                            <span className="plus" onClick={ () => toogleCartItemQuantity(item._id, 'inc') }><AiOutlinePlus /></span>
                                        </p>
                                    </div>
                                    <button type="button" className='remove-item' onClick={ () => onRemove(item) }>
                                        <AiOutlineDelete />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) }
                </div>

                { cartItems.length >= 1 && (
                    <div className="cart-bottom">
                        <div className="total">
                            <h3>Subtotal :</h3>
                            <h3> ${ totalPrice } </h3>
                        </div>
                        <div className="btn-container">
                            <button className="btn" type='botton' onClick={ handleCheckout }>Pay with Stripe</button>
                        </div>
                    </div>
                ) }
            </div>
        </div>
    )
}

export default Cart
