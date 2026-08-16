import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const PhoneOtpAuth = () => {
  const { backendUrl, setToken, navigate } = useContext(ShopContext)
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [debugOtp, setDebugOtp] = useState('')
  const otpRefs = useRef([])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleSendOtp = async (e) => {
    e?.preventDefault()
    const cleaned = phone.replace(/[\s\-()]/g, '')
    if (!/^\d{10}$/.test(cleaned)) {
      toast.error('Please enter a valid 10-digit mobile number')
      return
    }
    setLoading(true)
    try {
      const response = await axios.post(backendUrl + '/api/user/send-otp', { phoneNumber: cleaned })
      if (response.data.success) {
        setStep(2)
        setCooldown(60)
        if (response.data.debugOtp) {
          setDebugOtp(response.data.debugOtp)
        }
        toast.success('OTP sent successfully')
      } else {
        toast.error(response.data.message || 'Failed to send OTP')
        if (response.data.cooldown) setCooldown(response.data.cooldown)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e?.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) {
      toast.error('Please enter the 6-digit OTP')
      return
    }
    setLoading(true)
    try {
      const response = await axios.post(backendUrl + '/api/user/verify-otp', {
        phoneNumber: phone,
        otp: code,
      })
      if (response.data.success) {
        localStorage.setItem('token', response.data.token)
        setToken(response.data.token)
        toast.success('Login successful!')
        setTimeout(() => navigate('/'), 500)
      } else {
        toast.error(response.data.message || 'Invalid OTP')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '')
    if (!digit) return
    const newOtp = [...otp]
    newOtp[index] = digit.slice(-1)
    setOtp(newOtp)
    if (index < 5 && digit) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleBack = () => {
    setStep(1)
    setOtp(['', '', '', '', '', ''])
    setDebugOtp('')
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4 py-8'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='text-5xl mb-3'>💊</div>
          <h1 className='text-2xl font-bold text-gray-900'>Radhe Pharmacy</h1>
          <p className='text-gray-600 mt-2'>Order medicines online</p>
        </div>

        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8'>
          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <h2 className='text-xl font-bold text-gray-900 mb-1'>Login / Sign Up</h2>
              <p className='text-sm text-gray-500 mb-6'>
                Enter your mobile number. We'll send you an OTP to verify.
              </p>

              <label className='block text-sm font-semibold text-gray-700 mb-2'>Mobile Number</label>
              <div className='flex items-center border-2 border-gray-200 rounded-xl focus-within:border-emerald-500 transition-colors overflow-hidden'>
                <span className='px-4 py-3 bg-gray-50 text-gray-700 font-medium border-r border-gray-200'>+91</span>
                <input
                  type='tel'
                  inputMode='numeric'
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder='9876543210'
                  className='w-full px-4 py-3 focus:outline-none'
                  autoFocus
                />
              </div>

              <button
                type='submit'
                disabled={loading || cooldown > 0}
                className='w-full mt-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98]'
              >
                {loading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <span className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
                    Sending...
                  </span>
                ) : cooldown > 0 ? (
                  `Resend OTP in ${cooldown}s`
                ) : (
                  'Send OTP'
                )}
              </button>

              <p className='text-xs text-gray-600 text-center mt-6'>
                By continuing, you agree to our <span className='font-semibold text-gray-900'>Terms</span> and{' '}
                <span className='font-semibold text-gray-900'>Privacy</span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <h2 className='text-xl font-bold text-gray-900 mb-1'>Verify OTP</h2>
              <p className='text-sm text-gray-500 mb-6'>
                Enter the 6-digit code sent to <span className='font-semibold text-gray-800'>+91 {phone}</span>
              </p>

              <div className='flex justify-between gap-2 mb-6'>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type='tel'
                    inputMode='numeric'
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className='w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors'
                  />
                ))}
              </div>

              {debugOtp && (
                <div className='bg-amber-50 border border-amber-200 text-amber-700 text-xs p-3 rounded-lg mb-4 text-center'>
                  DEBUG MODE: Your OTP is <span className='font-bold'>{debugOtp}</span>
                </div>
              )}

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98]'
              >
                {loading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <span className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
                    Verifying...
                  </span>
                ) : (
                  'Verify & Login'
                )}
              </button>

              <div className='flex items-center justify-between mt-4 text-sm'>
                <button type='button' onClick={handleBack} className='text-gray-500 hover:text-gray-700 font-medium'>
                  ← Change number
                </button>
                <button
                  type='button'
                  onClick={handleSendOtp}
                  disabled={cooldown > 0 || loading}
                  className='text-emerald-600 hover:text-emerald-700 font-semibold disabled:text-gray-300'
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default PhoneOtpAuth