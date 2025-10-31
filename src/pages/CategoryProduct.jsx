import { ChevronLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from "../assets/Loading4.webm"
import ProductListView from '../components/ProductListView'
import { getData } from '../context/DataContext'

const CategoryProduct = () => {
  const [searchData, setSearchData] = useState([])
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const category = params.category
  const navigate = useNavigate()
  const { data, fetchAllProducts } = getData()

  const getFilterData = () => {
    setLoading(true)
    try {
      // Filter products by category from existing data
      if (data && data.length > 0) {
        const filteredData = data.filter(product => 
          product.category.toLowerCase() === category.toLowerCase()
        )
        setSearchData(filteredData)
      } else {
        setSearchData([])
      }
    } catch (error) {
      console.log('Error filtering products:', error);
      setSearchData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (data && data.length > 0) {
      getFilterData()
    } else {
      // If no data, fetch it first
      fetchAllProducts()
    }
    window.scrollTo(0, 0)
  }, [data, category])
  
  return (
    <div>
      {
        loading ? (
          <div className='flex items-center justify-center h-[400px]'>
             <video muted autoPlay loop>
              <source src={Loading} type='video/webm'/>
             </video>
          </div>
        ) : searchData.length > 0 ? (
          <div className='max-w-6xl mx-auto mt-10 mb-10 px-4'>
             <button onClick={()=>navigate('/')} className='bg-gray-800 mb-5 text-white px-3 py-1 rounded-md cursor-pointer flex gap-1 items-center'><ChevronLeft/> Back</button>
             <h1 className='text-2xl font-bold mb-5 capitalize'>{category} Products ({searchData.length})</h1>
             {
              searchData.map((product, index) =>{
                return <ProductListView key={index} product={product}/>
              })
             }
          </div>
        ) : (
          <div className='max-w-6xl mx-auto mt-10 mb-10 px-4'>
            <button onClick={()=>navigate('/')} className='bg-gray-800 mb-5 text-white px-3 py-1 rounded-md cursor-pointer flex gap-1 items-center'><ChevronLeft/> Back</button>
            <div className='flex items-center justify-center h-[400px]'>
              <div className='text-center'>
                <h2 className='text-2xl font-bold text-gray-500 mb-4'>No Products Found</h2>
                <p className='text-gray-600'>No products available in the {category} category.</p>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default CategoryProduct
