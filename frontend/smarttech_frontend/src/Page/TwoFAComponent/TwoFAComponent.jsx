import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FiArrowLeft, FiShield, FiSmartphone } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
function TwoFAComponent() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

  const sendOtp = async () => {
    // Validate phone number format
    if (!phone.startsWith('+216') || phone.length !== 12) {
        toast.info('🇹🇳 Please use +216 followed by 8 digits');
      return;
    }
    setIsLoading(true);
    await fetch('http://localhost:9000/api/2fa/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    setStep(2);
   setIsLoading(false);
  };
  
  const verifyOtp = async () => {
    const otpCode = otp.join('');
    const res = await fetch('http://localhost:9000/api/2fa/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp: otpCode })
    });
    if (res.ok) {
        toast.success("🎉 Verification Successful!");
        setTimeout(() => navigate('/'), 1500);
    } else {
        toast.error("⚠️ Invalid Code. Try Again!");
    }
    setIsLoading(false);
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
    <ToastContainer position="top-center" autoClose={3000} />
    
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-2" />
      
      <AnimatePresence mode='wait'>
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FiSmartphone className="text-3xl text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Secure Login</h1>
              <p className="text-gray-500">Enter your Tunisian mobile number</p>
            </div>

            <div className="relative">
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+216 XX XXX XXX"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            <button
              onClick={sendOtp}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Send Verification Code'
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="space-y-6"
          >
            <button 
              onClick={() => setStep(1)}
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              <FiArrowLeft className="mr-2" /> Back
            </button>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FiShield className="text-3xl text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify Identity</h1>
              <p className="text-gray-500">Enter 4-digit code sent to {phone}</p>
            </div>

            <div className="flex justify-center space-x-3">
              {otp.map((value, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={value}
                  onChange={e => handleOtpChange(e.target.value, index)}
                  className="w-16 h-16 text-2xl text-center border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              ))}
            </div>

            <button
              onClick={verifyOtp}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Verify Code'
              )}
            </button>

            <p className="text-center text-gray-500">
              Didn't receive code?{' '}
              <button 
                onClick={sendOtp}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Resend
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  </div>
);
}

export default TwoFAComponent;
