import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import SignIn from './pages/SignIn'
import Navbar from './components/Navbar'
import axios from 'axios'
import Footer from './components/Footer'
import SingleProduct from './pages/SingleProduct'
import CategoryProduct from './pages/CategoryProduct'
import { useCart } from './context/CartContext'
import ProtectedRoute from './components/ProtectedRoute'


const App = () => {
  const [location, setLocation] = useState()
  const [openDropdown, setOpenDropdown] = useState(false)
  const { cartItem, setCartItem } = useCart()

  const getLocation = async () => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude, longitude } = pos.coords
      console.log('Location obtained:', latitude, longitude);

      // Using a CORS-friendly geocoding service
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      try {
        const location = await axios.get(url)
        const locationData = location.data
        setLocation({
          county: locationData.locality || 'Unknown City',
          state: locationData.principalSubdivision || 'Unknown State',
          country: locationData.countryName || 'Unknown Country',
          postcode: locationData.postcode || ''
        })
        setOpenDropdown(false)
        console.log('Location data:', locationData);

      } catch (error) {
        console.log('Error getting location data:', error);
        // Set a default location if API fails
        setLocation({
          county: 'Unknown City',
          state: 'Unknown State',
          country: 'Unknown Country',
          postcode: ''
        })
      }

    }, (error) => {
      console.log('Error getting location:', error);
      setLocation({
        county: 'Location access denied',
        state: 'Please enable location services',
        country: '',
        postcode: ''
      })
    })
  }

  //Load cart from local storage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItem')
    if(storedCart){
      setCartItem(JSON.parse(storedCart))
    }
  }, []);

  //save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItem', JSON.stringify(cartItem))
  }, [cartItem])

  return (
    <BrowserRouter>
      <Navbar location={location} getLocation={getLocation} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/products' element={<Products />}></Route>
        <Route path='/products/:id' element={<SingleProduct />}></Route>
        <Route path='/category/:category' element={<CategoryProduct />}></Route>
        <Route path='/about' element={<About />}></Route>
        <Route path='/contact' element={<Contact />}></Route>
        <Route path='/signin' element={<SignIn />}></Route>
        <Route path='/cart' element={<ProtectedRoute>
          <Cart location={location} getLocation={getLocation} />
        </ProtectedRoute>}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
