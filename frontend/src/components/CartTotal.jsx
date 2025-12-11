import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = () => {
    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

    return (
        <div className='w-full bg-gray-50 p-6 rounded-xl border border-gray-100'>
            <div className='text-2xl'>
                <Title text1={"CART"} text2={"TOTALS"} />
            </div>
            
            <div className='flex flex-col gap-3 mt-4 text-sm text-gray-700'>
                <div className='flex justify-between'>
                    <p>Subtotal</p>
                    <p className='font-medium'>{currency}{getCartAmount()}.00</p>
                </div>
                <hr className='border-gray-200' />
                <div className='flex justify-between'>
                    <p>Delivery Fee</p>
                    <p className='font-medium'>{currency}{delivery_fee}.00</p>
                </div>
                <hr className='border-gray-200' />
                <div className='flex justify-between text-lg text-gray-900'>
                    <b>Total Amount</b>
                    <b>{currency}{getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00</b>
                </div>
            </div>
            <p className='text-xs text-gray-400 mt-4 text-center'>
                *Delivery charges calculated at checkout
            </p>
        </div>
    );
}

export default CartTotal;