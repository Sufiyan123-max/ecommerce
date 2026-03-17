import { useEffect, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { GiShoppingBag } from 'react-icons/gi';
import { LuNotebookText } from 'react-icons/lu';
import { MdDeliveryDining } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import emptyCart from "../assets/empty-cart.png";
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Cart = ({location, getLocation}) => {
  const { cartItem, updateQuantity, deleteItem, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: isAuthenticated ? (user?.name || '') : '',
    address: location?.county || '',
    state: location?.state || '',
    postcode: location?.postcode || '',
    country: location?.country || '',
    phoneNo: ''
  });
  const [loading, setLoading] = useState(false);

  // Update delivery info when location changes
  useEffect(() => {
    if (location) {
      setDeliveryInfo(prev => ({
        ...prev,
        address: location.county || prev.address,
        state: location.state || prev.state,
        postcode: location.postcode || prev.postcode,
        country: location.country || prev.country
      }));
    }
  }, [location]);

  // Update delivery info when user changes
  useEffect(() => {
    if (isAuthenticated && user?.name) {
      setDeliveryInfo(prev => ({
        ...prev,
        fullName: user.name
      }));
    }
  }, [isAuthenticated, user]);

  // Calculate total price based on quantity and price
  const totalPrice = cartItem.reduce((total, item) => total + (item.price * item.quantity), 0);
  const handlingCharge = 5;
  const grandTotal = totalPrice + handlingCharge;

  const handleDeliveryInfoChange = (e) => {
    setDeliveryInfo({
      ...deliveryInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleDetectLocation = async () => {
    try {
      await getLocation();
      toast.success('Location detected successfully!');
    } catch (error) {
      toast.error('Failed to detect location. Please try again.');
    }
  };

  const handleSubmitDeliveryInfo = async () => {
    if (!deliveryInfo.fullName || !deliveryInfo.address || !deliveryInfo.phoneNo) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://ecommerce-97pd.onrender.com/api/delivery-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...deliveryInfo,
          userId: isAuthenticated ? user?._id : null,
          userEmail: isAuthenticated ? user?.email : null
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Delivery information saved successfully!');
      } else {
        toast.error(data.message || 'Failed to save delivery information');
      }
    } catch (error) {
      console.error('Delivery info error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!deliveryInfo.fullName || !deliveryInfo.address || !deliveryInfo.phoneNo) {
      toast.error('Please fill in delivery information first');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: isAuthenticated ? user?._id : null,
        userEmail: isAuthenticated ? user?.email : null,
        items: cartItem,
        deliveryInfo: deliveryInfo,
        totalAmount: grandTotal,
        paymentMethod: 'Cash on Delivery',
        status: 'pending'
      };

      const response = await fetch('https://ecommerce-97pd.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Your order has been accepted! We will contact you soon for delivery.');
        clearCart();
        navigate('/');
      } else {
        toast.error(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mt-10 max-w-6xl mx-auto mb-5 px-4 md:px-0'>
      {
        cartItem.length > 0 ? <div>
          <h1 className='font-bold text-2xl '>My Cart ({cartItem.length})</h1>
          <div>
            <div className='mt-10'>
              {cartItem.map((item, index) => {
                return <div key={index} className='bg-gray-100 p-5 rounded-md flex items-center justify-between mt-3 w-full'>
                  <div className='flex items-center gap-4'>
                    <img src={item.image} alt={item.title} className='w-20 h-20 rounded-md' />
                    <div>
                      <h1 className='md:w-[300px] line-clamp-2 '>{item.title}</h1>
                      <p className='text-red-500 font-semibold text-lg'>${item.price}</p>
                    </div>
                  </div>
                  <div className='bg-red-500 text-white flex gap-4 p-2 rounded-md font-bold text-xl'>
                    <button onClick={()=>updateQuantity(cartItem, item.id, "decrease")} className='cursor-pointer'>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={()=>updateQuantity(cartItem, item.id, "increase")} className='cursor-pointer'>+</button>
                  </div>
                  <span onClick={()=>deleteItem(item.id)} className='hover:bg-white/60 transition-all rounded-full p-3 hover:shadow-2xl'>
                    <FaRegTrashAlt className='text-red-500 text-2xl cursor-pointer' />
                  </span>
                </div>
              })}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 md:gap-20'>
              <div className='bg-gray-100 rounded-md p-7 mt-4 space-y-2'>
                <h1 className='text-gray-800 font-bold text-xl'>Delivery Info</h1>
                <div className='flex flex-col space-y-1'>
                  <label htmlFor="fullName">Full Name *</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={deliveryInfo.fullName}
                    onChange={handleDeliveryInfoChange}
                    placeholder='Enter your name' 
                    className='p-2 rounded-md' 
                    required
                  />
                </div>
                <div className='flex flex-col space-y-1'>
                  <label htmlFor="address">Address *</label>
                  <input 
                    type="text" 
                    name="address"
                    value={deliveryInfo.address}
                    onChange={handleDeliveryInfoChange}
                    placeholder='Enter your address' 
                    className='p-2 rounded-md' 
                    required
                  />
                </div>
                <div className='flex w-full gap-5'>
                  <div className='flex flex-col space-y-1 w-full'>
                    <label htmlFor="state">State</label>
                    <input 
                      type="text" 
                      name="state"
                      value={deliveryInfo.state}
                      onChange={handleDeliveryInfoChange}
                      placeholder='Enter your state' 
                      className='p-2 rounded-md w-full' 
                    />
                  </div>
                  <div className='flex flex-col space-y-1 w-full'>
                    <label htmlFor="postcode">PostCode</label>
                    <input 
                      type="text" 
                      name="postcode"
                      value={deliveryInfo.postcode}
                      onChange={handleDeliveryInfoChange}
                      placeholder='Enter your postcode' 
                      className='p-2 rounded-md w-full' 
                    />
                  </div>
                </div>
                <div className='flex w-full gap-5'>
                  <div className='flex flex-col space-y-1 w-full'>
                    <label htmlFor="country">Country</label>
                    <input 
                      type="text" 
                      name="country"
                      value={deliveryInfo.country}
                      onChange={handleDeliveryInfoChange}
                      placeholder='Enter your country' 
                      className='p-2 rounded-md w-full' 
                    />
                  </div>
                  <div className='flex flex-col space-y-1 w-full'>
                    <label htmlFor="phoneNo">Phone No *</label>
                    <input 
                      type="text" 
                      name="phoneNo"
                      value={deliveryInfo.phoneNo}
                      onChange={handleDeliveryInfoChange}
                      placeholder='Enter your Number' 
                      className='p-2 rounded-md w-full' 
                      required
                    />
                  </div>
                </div>
                <button 
                  onClick={handleSubmitDeliveryInfo}
                  disabled={loading}
                  className='bg-red-500 text-white px-3 py-1 rounded-md mt-3 cursor-pointer disabled:opacity-50'
                >
                  {loading ? 'Saving...' : 'Submit'}
                </button>
                <div className='flex items-center justify-center w-full text-gray-700'>
                  ---------OR-----------
                </div>
                <div className='flex justify-center'>
                  <button onClick={handleDetectLocation} className='bg-red-500 text-white px-3 py-2 rounded-md'>Detect Location</button>
                </div>
              </div>
              <div className='bg-white border border-gray-100 shadow-xl rounded-md p-7 mt-4 space-y-2 h-max'>
                <h1 className='text-gray-800 font-bold text-xl'>Bill details</h1>
                <div className='flex justify-between items-center'>
                  <h1 className='flex gap-1 items-center text-gray-700'><span><LuNotebookText /></span>Items total</h1>
                  <p>${totalPrice.toFixed(2)}</p>
                </div>
                <div className='flex justify-between items-center'>
                  <h1 className='flex gap-1 items-center text-gray-700'><span><MdDeliveryDining /></span>Delivery Charge</h1>
                  <p className='text-red-500 font-semibold'><span className='text-gray-600 line-through'>$25</span> FREE</p>
                </div>
                <div className='flex justify-between items-center'>
                  <h1 className='flex gap-1 items-center text-gray-700'><span><GiShoppingBag /></span>Handling Charge</h1>
                  <p className='text-red-500 font-semibold'>${handlingCharge}</p>
                </div>
                <hr className='text-gray-200 mt-2'/>
                <div className='flex justify-between items-center'>
                  <h1 className='font-semibold text-lg'>Grand total</h1>
                  <p className='font-semibold text-lg'>${grandTotal.toFixed(2)}</p>
                </div>
                <div className='bg-gray-50 p-3 rounded-md mt-4'>
                  <h1 className='font-semibold text-gray-700 mb-2'>Payment Method</h1>
                  <p className='text-green-600 font-medium'>Cash on Delivery</p>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className='bg-red-500 text-white px-3 py-2 rounded-md w-full cursor-pointer mt-3 disabled:opacity-50'
                >
                  {loading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          </div>
        </div> : <div className='flex flex-col gap-3 justify-center items-center h-[600px]'>
          <h1 className='text-red-500/80 font-bold text-5xl text-muted'>Oh no! Your cart is empty</h1>
          <img src={emptyCart} alt="" className='w-[400px]'/>
          <button onClick={()=>navigate('/products')} className='bg-red-500 text-white px-3 py-2 rounded-md cursor-pointer '>Continue Shopping</button>
        </div>
      }
    </div>
  )
}

export default Cart
