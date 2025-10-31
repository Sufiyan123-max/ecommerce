// import { UserButton, useUser } from '@clerk/clerk-react'
import React from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ResponsiveMenu = ({ openNav, setOpenNav }) => {
    const { user, isAuthenticated, signOut } = useAuth()
    
    return (
        <div className={`${openNav ? "left-0" : "-left-[100%]"} fixed bottom-0 top-0 z-20 flex h-screen w-[75%] flex-col justify-between bg-white px-8 pb-6 pt-16 text-black md:hidden rounded-r-xl shadow-md transition-all`}>
            <div>
                <div className='flex items-center justify-start gap-3'>
                    {
                        isAuthenticated ? (
                            <div className="w-[50px] h-[50px] bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            </div>
                        ) : (
                            <FaUserCircle size={50} />
                        )
                    }
                    <div>
                        <h1>Hello, {isAuthenticated ? (user?.name || user?.email) : 'Guest'}</h1>
                        <h1 className='text-sm text-slate-500'>
                            {isAuthenticated ? 'Premium User' : 'Sign in for better experience'}
                        </h1>
                    </div>
                </div>
                <nav className='mt-12'>
                    <ul className='flex flex-col gap-7 text-2xl font-semibold'>
                        <Link to={'/'} onClick={()=>setOpenNav(false)} className="cursor-pointer"><li>Home</li></Link>
                        <Link to={"/products"} onClick={()=>setOpenNav(false)} className="cursor-pointer"><li>Products</li></Link>
                        <Link to={"/about"} onClick={()=>setOpenNav(false)} className="cursor-pointer"><li>About</li></Link>
                        <Link to={"/contact"} onClick={()=>setOpenNav(false)} className="cursor-pointer"><li>Contact</li></Link>
                        {isAuthenticated && (
                            <button 
                                onClick={() => {
                                    signOut();
                                    setOpenNav(false);
                                }} 
                                className="text-left text-red-500"
                            >
                                <li>Sign Out</li>
                            </button>
                        )}
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default ResponsiveMenu
