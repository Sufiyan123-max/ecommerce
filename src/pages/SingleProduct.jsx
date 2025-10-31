import React, { useEffect, useState } from 'react';
import { IoCartOutline } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import Loading from "../assets/Loading4.webm";
import Breadcrums from '../components/Breadcrums';
import { useCart } from '../context/CartContext';
import { getData } from '../context/DataContext';

const SingleProduct = () => {
    const params = useParams()
    const [singleProduct, setSingleProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const { addToCart } = useCart()
    const { data, fetchAllProducts } = getData()

    const getSingleProduct = () => {
        setLoading(true)
        try {
            if (data && data.length > 0) {
                // Find product by ID from existing data
                const product = data.find(item => item.id.toString() === params.id)
                if (product) {
                    setSingleProduct(product)
                } else {
                    setSingleProduct(null)
                }
            } else {
                setSingleProduct(null)
            }
        } catch (error) {
            console.log('Error finding product:', error);
            setSingleProduct(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (data && data.length > 0) {
            getSingleProduct()
        } else {
            // If no data, fetch it first
            fetchAllProducts()
        }
    }, [data, params.id])

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <video muted autoPlay loop>
                    <source src={Loading} type='video/webm' />
                </video>
            </div>
        )
    }

    if (!singleProduct) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <div className='text-center'>
                    <h2 className='text-2xl font-bold text-gray-500 mb-4'>Product Not Found</h2>
                    <p className='text-gray-600'>The product you're looking for doesn't exist.</p>
                </div>
            </div>
        )
    }

    return (
        <div className='px-4 pb-4 md:px-0'>
            <Breadcrums title={singleProduct.title}/>
            <div className='max-w-6xl mx-auto md:p-6 grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/* product image */}
                <div className='w-full'>
                    <img src={singleProduct.image} 
                    alt={singleProduct.title} 
                    className='rounded-2xl w-full object-cover'/>
                </div>
                {/* product details */}
                <div className='flex flex-col gap-6'>
                    <h1 className='md:text-3xl text-xl font-bold text-gray-800'>{singleProduct.title}</h1>
                    <div className='text-gray-700'>{singleProduct.brand?.toUpperCase()} / {singleProduct.category?.toUpperCase()}</div>
                    <p className='text-xl text-red-500 font-bold'>${singleProduct.price}</p>
                    <p className='text-gray-600'>{singleProduct.description}</p>

                    {/* quantity selector */}
                    <div className='flex items-center gap-4'>
                        <label htmlFor="" className='text-sm font-medium text-gray-700'>Quantity:</label>
                        <input type="number" min={1} defaultValue={1} className='w-20 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-500'/>
                    </div>

                    <div className='flex gap-4 mt-4'>
                        <button 
                            onClick={()=>addToCart(singleProduct)} 
                            className='px-6 flex gap-2 py-2 text-lg bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500'
                        >
                            <IoCartOutline className='w-6 h-6'/> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleProduct
