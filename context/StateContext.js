import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setshowCart] = useState(false);
    const [cartItems, setcartItems] = useState([]);
    const [totalPrice, settotalPrice] = useState(0);
    const [totalQuantities, settotalQuantities] = useState(0);
    const [qty, setqty] = useState(1);

    let foundProduct;
    let index;

    // onRemove()
    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);
        const newcartItems = cartItems.filter((item) => item._id !== product._id);

        settotalPrice((prevtotalPrice) => prevtotalPrice - foundProduct.price * foundProduct.quantity);
        settotalQuantities(prevtotalQuantities => prevtotalQuantities - foundProduct.quantity);
        setcartItems(newcartItems);
    }
    // onRemove

    // toogleCartItemQuantity()
    const toogleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex((product) => product._id === id);

        const newcartItems = cartItems.filter((item) => item._id !== id)

        if (value === 'inc') {
            setcartItems([...newcartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }])
            settotalPrice((prevtotalPrice) => prevtotalPrice + foundProduct.price)
            settotalQuantities((prevtotalQuantities) => prevtotalQuantities + 1)
        }
        else if (value === 'dec') {
            if (foundProduct.quantity > 1) {
                setcartItems([...newcartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }])
                settotalPrice((prevtotalPrice) => prevtotalPrice - foundProduct.price)
                settotalQuantities((prevtotalQuantities) => prevtotalQuantities - 1)
            }
        }
    }
    // Toggle item


    // onAdd()``
    const onAdd = (product, quantity) => {
        // Ici, verifions voir si, l'id de 'chaq item' du panier est strictement egal à l'id du produit quon veut ajouté
        const checkProductInCart = cartItems.find((item) => item._id === product._id);

        // Et si tel es le cas, tu me fais totalPrice ki es une callback fcntion (totalPrice + le prix du produit*la quantité)
        settotalPrice((prevtotalPrice) => prevtotalPrice + product.price * quantity);
        settotalQuantities((prevsettotalQuantities) => prevsettotalQuantities + quantity);

        if (checkProductInCart) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })
            setcartItems(updatedCartItems);
            setqty(1);
        }
        else {
            product.quantity = quantity;
            setcartItems([...cartItems, { ...product }]);
            setqty(1);
        }
        toast.success(`${qty} ${product.name} added to cart.`);
    }
    // Add to cart

    // Qty
    const incQty = () => {
        setqty((prevqty) => prevqty + 1)
    }

    const decQty = () => {
        setqty((prevqty) => {
            if (prevqty - 1 < 1) return 1;
            return prevqty - 1;
        })
    }
    // Qty

    return (
        <Context.Provider value={ {
            showCart, cartItems, totalPrice, totalQuantities, qty, incQty, decQty, onAdd, onRemove, toogleCartItemQuantity, setshowCart, setcartItems, settotalPrice, settotalQuantities,
        } }>
            { children }
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);