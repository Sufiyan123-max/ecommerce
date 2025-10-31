import axios from "axios";
import { createContext, useContext, useState } from "react";

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // fetching all products from api
    const fetchAllProducts = async () => {
        setLoading(true)
        setError(null)
        try {
           // Using a working fakestore API
           const res = await axios.get('https://fakestoreapi.com/products?limit=150')
           console.log('Products loaded successfully:', res.data.length, 'items');
           
           // Add brand information to products since fakestoreapi doesn't provide it
           const productsWithBrands = res.data.map((product, index) => ({
               ...product,
               brand: getBrandByCategory(product.category) || 'Generic Brand'
           }))
           
           setData(productsWithBrands)
           
        } catch (error) {
            console.log('Error fetching products:', error);
            setError('Failed to load products. Please try again later.')
            // Set some sample data for development
            setData([
                {
                    id: 1,
                    title: "Sample Product 1",
                    price: 29.99,
                    description: "This is a sample product for development purposes.",
                    category: "electronics",
                    image: "https://via.placeholder.com/300x300?text=Product+1",
                    brand: "Sample Brand"
                },
                {
                    id: 2,
                    title: "Sample Product 2",
                    price: 49.99,
                    description: "Another sample product for development.",
                    category: "clothing",
                    image: "https://via.placeholder.com/300x300?text=Product+2",
                    brand: "Sample Brand"
                }
            ])
        } finally {
            setLoading(false)
        }
    }

    // Helper function to assign brands based on category
    const getBrandByCategory = (category) => {
        const brandMap = {
            "men's clothing": "Fashion Forward",
            "women's clothing": "Elegant Style",
            "jewelery": "Luxury Gems",
            "electronics": "TechPro",
            "clothing": "StyleMax"
        }
        return brandMap[category] || "Premium Brand"
    }

    const getUniqueCategory = (data, property) =>{
        if (!data) return []
        let newVal = data?.map((curElem) =>{
            return curElem[property]
        }).filter(item => item) // Filter out null/undefined values
        newVal = ["All",...new Set(newVal)]
        return newVal
      }
    
      const categoryOnlyData = getUniqueCategory(data, "category")
      const brandOnlyData = getUniqueCategory(data, "brand")
    return <DataContext.Provider value={{ data, setData, fetchAllProducts, categoryOnlyData, brandOnlyData, loading, error }}>
        {children}
    </DataContext.Provider>
}

export const getData = ()=> useContext(DataContext)
