import React, { useEffect } from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { getData } from '../context/DataContext';
import Category from './Category';

const Carousel = () => {
    const { data, fetchAllProducts, loading, error } = getData()
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchAllProducts()
    }, [])

    const handleShopNow = () => {
        navigate('/products');
    };

    const SamplePrevArrow = (props) => {
        const {className, style, onClick} = props;
        return (
            <div onClick={onClick} className={`arrow ${className}`} style={{zIndex:3}}>
                <AiOutlineArrowLeft className='arrows' style={{...style, display: "block", borderRadius:"50px", background:"#f53347" , color:"white" , position:"absolute", padding:"2px", left:"50px"}} />
            </div>
        )
    }
    const SampleNextArrow = (props) => {
        const {className, style, onClick} = props;
        return (
            <div onClick={onClick} className={`arrow ${className}`}>
                <AiOutlineArrowRight className='arrows' style={{...style, display: "block", borderRadius:"50px", background:"#f53347" , color:"white" , position:"absolute", padding:"2px", right:"50px"}} />
            </div>
        )
    }

    var settings = {
        dots: false,
        autoplay: true,
        autoplaySpeed:2000,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        pauseOnHover:false,
        nextArrow: <SampleNextArrow to="next" />,
        prevArrow: <SamplePrevArrow to="prev" />,
        accessibility: true,
        focusOnSelect: false,
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Products</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            {data && data.length > 0 ? (
                <Slider {...settings}>
                    {
                        data?.slice(0,7)?.map((item, index) => {
                            return <div key={index} className='bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] -z-10'>
                                <div className='flex flex-col md:flex-row gap-10 justify-center h-[600px] my-20 md:my-0 items-center px-4'>
                                    <div className='md:space-y-6 space-y-3'>
                                        <h3 className='text-red-500 font-semibold font-sans text-sm'>Powering Your World with the Best in Electronics</h3>
                                        <h1 className='md:text-4xl text-xl font-bold uppercase line-clamp-2 md:line-clamp-3 md:w-[500px] text-white'>{item.title}</h1>
                                        <p className='md:w-[500px] line-clamp-3 text-gray-400 pr-7'>{item.description}</p>
                                        <button 
                                            onClick={handleShopNow}
                                            className='bg-gradient-to-r from-red-500 to-purple-500 text-white px-3 py-2 rounded-md cursor-pointer mt-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 hover:from-red-600 hover:to-purple-600 transition-all duration-300'
                                            tabIndex={0}
                                        >
                                            Shop Now
                                        </button>
                                    </div>
                                    <div>
                                        <img src={item.image} alt={item.title} className='rounded-full w-[550px] hover:scale-105 transition-all shadow-2xl shadow-red-400'/>
                                    </div>
                                </div>
                            </div>
                        })
                    }              
                </Slider>
            ) : (
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-500 mb-4">No Products Available</h2>
                        <p className="text-gray-600">Please try again later.</p>
                    </div>
                </div>
            )}
            <Category/>
        </div>
    )
}

export default Carousel
