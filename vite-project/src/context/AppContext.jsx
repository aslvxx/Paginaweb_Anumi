import React, {createContext, useState, useEffect} from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) =>{
    const [currentView, setCurrentView] = useState('home');
    const [selectedScoop, setSelectedScoop] = useState(null);
    const [cart, setCart] = useState([]);
    const [showCartDrawer, setShowCartDrawer] = useState(false);

    useEffect(()=>{
        const savedCart = localStorage.getItem('anumi_cart');
        if(savedCart){
            try{
                setCart(JSON.parse(savedCart));
            }catch(e){
                console.error('Error loading cart', e);
            }
        }
    }, []);

    useEffect(() =>{
        localStorage.setItem('anumi_cart', JSON.stringify(cart));
    },[cart]);

    const navigate = (view) =>{
        setCurrentView(view);
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const addtoCart = (scoop, options) => {
        const {character, color, isGift, quantity} = options;

        setCart((prevCart) =>{
            const existingItemIndex = prevCart.findIndex(
                (item) =>
                    item.name === scoop.name &&
                    item.character === character &&
                    item.color === color &&
                    item.isGift === isGift
            );

            if(existingItemIndex > -1){
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            }else{
                const newItem ={
                    id: `${Date.now()}-${Math.random().toString(36).substr(2,9)}`,
                    name: scoop.name,
                    price: scoop.price,
                    minProducts: scoop.minProducts,
                    maxProducts: scoop.maxProducts,
                    image: scoop.image,
                    character,
                    color,
                    isGift,
                    quantity,
                };
                return[...prevCart, newItem];
            }
        })

        setShowCartDrawer(true);
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    };

    const updateCartItemQuantity = (itemId, newQuantity) => {
        if(newQuantity < 1) return;
        setCart((prevCart) =>
        prevCart.map((item) =>
            item.id === itemId ? {...item, quantity: newQuantity}: item
        )
    );
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const clearCart = () => {
        setCart([]);
    };

    return(
        <AppContext.Provider
        value={{
            currentView,
            setCurrentView,
            selectedScoop,
            setSelectedScoop,
            cart,
            setCart,
            showCartDrawer,
            setShowCartDrawer,
            navigate,
            addtoCart,
            removeFromCart,
            updateCartItemQuantity,
            cartCount,
            cartTotal,
            clearCart,
        }}
        >
            {children}
        </AppContext.Provider>
    );
};