import React, { useContext, useEffect } from 'react'
import { SignUp } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import { ShopContext } from '../context/ShopContext'

const Signup = () => {
  const { user, isLoaded } = useUser()
  const { getToken, isSignedIn } = useAuth()
  const { setToken } = useContext(ShopContext)
  const navigate = useNavigate()

  // Once user is authenticated via Clerk, store token and redirect
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Get Clerk session token and store it
      getToken().then((token) => {
        if (token) {
          localStorage.setItem('token', token)
          setToken(token)
          setTimeout(() => navigate('/'), 500)
        } else {
        }
      }).catch(err => {
      })
    }
  }, [isLoaded, isSignedIn, user, getToken, setToken, navigate])

  return (
    <div className='min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4 py-8'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='text-5xl mb-3'>💊</div>
          <h1 className='text-2xl font-bold text-gray-900'>Radhe Pharmacy</h1>
          <p className='text-gray-600 mt-2'>Order medicines online</p>
        </div>

        {/* Clerk SignUp Component */}
        <SignUp 
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'w-full shadow-none',
              cardBox: 'w-full',
              headerTitle: 'text-2xl font-bold text-center text-gray-900',
              headerSubtitle: 'text-center text-gray-600',
              socialButtonsBlockButton: 'border-2 border-gray-300 rounded-xl py-3 hover:border-emerald-600',
              formFieldInput: 'border-2 border-gray-300 rounded-xl py-3 px-4 focus:border-emerald-600',
              formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-700 font-bold py-3 rounded-xl',
              dividerText: 'text-gray-600',
              footerActionText: 'text-gray-600',
              footerActionLink: 'text-emerald-600 font-semibold hover:underline',
            }
          }}
          signInUrl="/login"
        />

        {/* Footer */}
        <p className='text-xs text-gray-600 text-center mt-6'>
          By continuing, you agree to our <span className='font-semibold text-gray-900'>Terms</span> and <span className='font-semibold text-gray-900'>Privacy</span>
        </p>
      </div>
    </div>
  )
}

export default Signup
