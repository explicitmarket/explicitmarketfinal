import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, FileText, Camera, Shield, ArrowRight, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../lib/store';

export function KYCPage() {
  const [step, setStep] = useState(1);
  const [isDark, setIsDark] = useState(true);
  const { user, submitKYC } = useStore();

  useEffect(() => {
    const stored = localStorage.getItem('theme-mode');
    if (stored) setIsDark(stored === 'dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Theme styling
  const bgClass = isDark ? 'bg-black text-white' : 'bg-white text-black';
  const cardBgClass = isDark
    ? 'bg-slate-900/40 border border-slate-800/50 backdrop-blur-md'
    : 'bg-slate-50/40 border border-slate-200/50 backdrop-blur-md';
  const textMutedClass = isDark ? 'text-slate-500' : 'text-slate-600';
  const dividerClass = isDark ? 'border-slate-800/30' : 'border-slate-200/30';
  const inputClass = isDark
    ? 'bg-slate-900/50 border-slate-800 text-white placeholder-slate-600'
    : 'bg-slate-100/50 border-slate-300 text-black placeholder-slate-400';
  const buttonSecondaryClass = isDark
    ? 'bg-slate-800/50 hover:bg-slate-700/50'
    : 'bg-slate-200/50 hover:bg-slate-300/50';
  const alertSuccessClass = isDark
    ? 'bg-emerald-500/10 border border-emerald-500/30'
    : 'bg-emerald-500/10 border border-emerald-500/30';
  const alertWarningClass = isDark
    ? 'bg-yellow-500/10 border border-yellow-500/30'
    : 'bg-yellow-500/10 border border-yellow-500/30';
  const alertErrorClass = isDark
    ? 'bg-red-500/10 border border-red-500/30'
    : 'bg-red-500/10 border border-red-500/30';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    address: '',
    documentType: 'passport',
    documentFront: null as File | null,
    documentBack: null as File | null,
    faceSelfie: null as File | null,
    agreedToTerms: false
  });

  const [uploadProgress, setUploadProgress] = useState({
    documentFront: 0,
    documentBack: 0,
    faceSelfie: 0
  });

  // Debug logging
  useEffect(() => {
    console.log('📋 KYC Page - User:', user);
    console.log('🔍 KYC Status:', user?.kycStatus);
    console.log('📝 Show Form?', user?.kycStatus === 'NOT_SUBMITTED' || user?.kycStatus === 'REJECTED' || !user?.kycStatus);
  }, [user]);

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (name: string, file: File | null) => {
    if (file) {
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setUploadProgress(prev => ({
          ...prev,
          [name]: progress
        }));
      }, 300);
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const validateStep = () => {
    if (step === 1) {
      return formData.firstName && formData.lastName && formData.dateOfBirth && formData.country;
    }
    if (step === 2) {
      return formData.address && formData.city && formData.state && formData.zipCode;
    }
    if (step === 3) {
      return formData.documentFront && formData.documentBack;
    }
    if (step === 4) {
      return formData.faceSelfie;
    }
    return true;
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (formData.agreedToTerms && user) {
      await submitKYC(user.id, formData);
      setStep(6);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: '👤' },
    { number: 2, title: 'Address', icon: '🏠' },
    { number: 3, title: 'ID Document', icon: '📄' },
    { number: 4, title: 'Selfie', icon: '📸' },
    { number: 5, title: 'Review', icon: '✓' }
  ];

  // if user status changes we can adjust current step
  useEffect(() => {
    if (user?.kycStatus === 'APPROVED') {
      setStep(7); // approved status page
    }
    if (user?.kycStatus === 'PENDING') {
      setStep(6); // pending status page
    }
    if (user?.kycStatus === 'REJECTED') {
      setStep(1); // allow resubmission from step 1
    }
    if (user?.kycStatus === 'NOT_SUBMITTED' || !user?.kycStatus) {
      setStep(1); // show form for new users
    }
  }, [user?.kycStatus]);

  const isDisabled = user?.kycStatus === 'PENDING' || user?.kycStatus === 'APPROVED';

  return (
    <div className={`${bgClass} min-h-screen transition-colors duration-500`}>
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 pb-20 md:pb-6">
        {/* Theme Toggle */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2.5 rounded-lg transition-colors ${cardBgClass}`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Status Alerts */}
        {user?.kycStatus === 'PENDING' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${alertWarningClass} rounded-lg p-4`}
          >
            <p className="text-yellow-400 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              Your KYC submission is pending review. This typically takes 24-48 hours.
            </p>
          </motion.div>
        )}

        {user?.kycStatus === 'APPROVED' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${alertSuccessClass} rounded-lg p-4`}
          >
            <p className="text-emerald-400 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Your identity has been verified. You have full access to the platform.
            </p>
          </motion.div>
        )}

        {user?.kycStatus === 'REJECTED' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${alertErrorClass} rounded-lg p-4`}
          >
            <p className="text-red-400 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Your previous submission was rejected. Please resubmit your KYC.
            </p>
          </motion.div>
        )}

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${cardBgClass} rounded-lg overflow-hidden p-6 md:p-8`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-500" />
              <span className="text-blue-500 font-light tracking-widest text-sm">IDENTITY VERIFICATION</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight">Know Your Customer (KYC)</h1>
            <p className={`${textMutedClass} max-w-2xl`}>
              Complete our verification process to unlock full trading features and higher withdrawal limits
            </p>
          </div>
        </motion.div>

        {/* Progress Steps - Only show when NOT_SUBMITTED or rejected */}
        {(user?.kycStatus === 'NOT_SUBMITTED' || user?.kycStatus === 'REJECTED') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${cardBgClass} rounded-lg p-6`}
          >
            <div className="flex items-center justify-between mb-4">
              {steps.map((s, idx) => (
                <div key={s.number} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step > s.number
                        ? 'bg-emerald-500 text-white'
                        : step === s.number
                        ? 'bg-blue-600 text-white ring-2 ring-blue-600/50'
                        : isDark
                        ? 'bg-slate-800 text-slate-500 border border-slate-700'
                        : 'bg-slate-200 text-slate-600 border border-slate-300'
                    }`}
                  >
                    {step > s.number ? '✓' : s.number}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                        step > s.number
                          ? 'bg-emerald-500'
                          : isDark
                          ? 'bg-slate-700/50'
                          : 'bg-slate-300/50'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              {steps.map((s) => (
                <div key={s.number}>
                  <p className={textMutedClass}>{s.title}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 1: Personal Information */}
        {step === 1 && (user?.kycStatus === 'NOT_SUBMITTED' || user?.kycStatus === 'REJECTED') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`${cardBgClass} rounded-lg p-6 space-y-6`}
          >
            <div>
              <h2 className="text-2xl font-light tracking-tight mb-1">Personal Information</h2>
              <p className={textMutedClass}>Please provide your personal details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`text-sm font-medium ${textMutedClass} mb-2 block`}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  className={`w-full px-4 py-2.5 ${inputClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
                />
              </div>
              <div>
                <label className={`text-sm font-medium ${textMutedClass} mb-2 block`}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  className={`w-full px-4 py-2.5 ${inputClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
                />
              </div>
              <div>
                <label className={`text-sm font-medium ${textMutedClass} mb-2 block`}>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 ${inputClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
                />
              </div>
              <div>
                <label className={`text-sm font-medium ${textMutedClass} mb-2 block`}>Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 ${inputClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
                >
                  <option value="">Select country</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setStep(1)}
                className={`flex-1 py-2.5 ${buttonSecondaryClass} text-white font-medium rounded-lg transition-colors`}
              >
                Skip (Limited Access)
              </button>
              <button
                onClick={handleNext}
                disabled={!validateStep()}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  validateStep()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : isDark
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Address Information */}
        {step === 2 && (user?.kycStatus === 'NOT_SUBMITTED' || user?.kycStatus === 'REJECTED') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`${cardBgClass} rounded-lg p-6 space-y-6`}
          >
            <div>
              <h2 className="text-2xl font-light tracking-tight mb-1">Residential Address</h2>
              <p className={textMutedClass}>Where do you currently reside?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={`text-sm font-medium ${textMutedClass} mb-2 block`}>Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  className={`w-full px-4 py-2.5 ${inputClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
                />
              </div>
              <div>
                <label className={`text-sm font-medium ${textMutedClass} mb-2 block`}>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                  className={`w-full px-4 py-2.5 ${inputClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
                />
              </div>
              <div>
                <label className={`text-sm font-medium ${textMutedClass} mb-2 block`}>State/Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="NY"
                  className={`w-full px-4 py-2.5 ${inputClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
                />
              </div>
              <div>
                <label className={`text-sm font-medium ${textMutedClass} mb-2 block`}>Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="10001"
                  className={`w-full px-4 py-2.5 ${inputClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleBack}
                className={`flex-1 py-2.5 ${buttonSecondaryClass} text-white font-medium rounded-lg transition-colors`}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!validateStep()}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  validateStep()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : isDark
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: ID Document Upload */}
        {step === 3 && (user?.kycStatus === 'NOT_SUBMITTED' || user?.kycStatus === 'REJECTED') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`${cardBgClass} rounded-lg p-6 space-y-6`}
          >
            <div>
              <h2 className="text-2xl font-light tracking-tight mb-1">Government ID Document</h2>
              <p className={textMutedClass}>Upload a clear photo of your government-issued ID</p>
            </div>

            <div>
              <label className={`text-sm font-medium ${textMutedClass} mb-2 block`}>Document Type</label>
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 ${inputClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600`}
              >
                <option value="passport">Passport</option>
                <option value="driver_license">Driver's License</option>
                <option value="national_id">National ID Card</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Front Side */}
              <div>
                <label className={`text-sm font-medium ${textMutedClass} mb-3 block`}>Front Side</label>
                <div className={`border-2 border-dashed ${dividerClass} rounded-lg p-6 text-center hover:border-blue-600 transition-colors cursor-pointer relative`}>
                  {formData.documentFront ? (
                    <div className="space-y-2">
                      <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto" />
                      <p className="font-medium">{formData.documentFront.name}</p>
                      <div className={`w-full h-2 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded-full overflow-hidden`}>
                        <div
                          className="h-full bg-emerald-500 transition-all"
                          style={{ width: `${uploadProgress.documentFront}%` }}
                        />
                      </div>
                      <p className={`text-xs ${textMutedClass}`}>{uploadProgress.documentFront}%</p>
                    </div>
                  ) : (
                    <>
                      <FileText className={`h-12 w-12 ${textMutedClass} mx-auto mb-3`} />
                      <p className="font-medium">Click to upload</p>
                      <p className={`text-xs ${textMutedClass}`}>PNG, JPG up to 10MB</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('documentFront', e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Back Side */}
              <div>
                <label className={`text-sm font-medium ${textMutedClass} mb-3 block`}>Back Side</label>
                <div className={`border-2 border-dashed ${dividerClass} rounded-lg p-6 text-center hover:border-blue-600 transition-colors cursor-pointer relative`}>
                  {formData.documentBack ? (
                    <div className="space-y-2">
                      <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto" />
                      <p className="font-medium">{formData.documentBack.name}</p>
                      <div className={`w-full h-2 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded-full overflow-hidden`}>
                        <div
                          className="h-full bg-emerald-500 transition-all"
                          style={{ width: `${uploadProgress.documentBack}%` }}
                        />
                      </div>
                      <p className={`text-xs ${textMutedClass}`}>{uploadProgress.documentBack}%</p>
                    </div>
                  ) : (
                    <>
                      <FileText className={`h-12 w-12 ${textMutedClass} mx-auto mb-3`} />
                      <p className="font-medium">Click to upload</p>
                      <p className={`text-xs ${textMutedClass}`}>PNG, JPG up to 10MB</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('documentBack', e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleBack}
                className={`flex-1 py-2.5 ${buttonSecondaryClass} text-white font-medium rounded-lg transition-colors`}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!validateStep()}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  validateStep()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : isDark
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Selfie Verification */}
        {step === 4 && (user?.kycStatus === 'NOT_SUBMITTED' || user?.kycStatus === 'REJECTED') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`${cardBgClass} rounded-lg p-6 space-y-6`}
          >
            <div>
              <h2 className="text-2xl font-light tracking-tight mb-1">Selfie Verification</h2>
              <p className={textMutedClass}>Please upload a clear selfie holding your ID document</p>
            </div>

            <div className={`bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3`}>
              <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
              <p className="text-sm text-blue-400">Make sure your face is clearly visible and the ID is readable</p>
            </div>

            <div>
              <div className={`border-2 border-dashed ${dividerClass} rounded-lg p-12 text-center hover:border-blue-600 transition-colors cursor-pointer relative`}>
                {formData.faceSelfie ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto" />
                    <p className="font-medium">{formData.faceSelfie.name}</p>
                    <div className={`w-full h-2 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded-full overflow-hidden max-w-xs mx-auto`}>
                      <div
                        className="h-full bg-emerald-500 transition-all"
                        style={{ width: `${uploadProgress.faceSelfie}%` }}
                      />
                    </div>
                    <p className={`text-xs ${textMutedClass}`}>{uploadProgress.faceSelfie}% uploaded</p>
                  </div>
                ) : (
                  <>
                    <Camera className={`h-16 w-16 ${textMutedClass} mx-auto mb-3`} />
                    <p className="font-medium text-lg">Click to upload selfie</p>
                    <p className={`text-sm ${textMutedClass}`}>PNG, JPG up to 10MB</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('faceSelfie', e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleBack}
                className={`flex-1 py-2.5 ${buttonSecondaryClass} text-white font-medium rounded-lg transition-colors`}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!validateStep()}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  validateStep()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : isDark
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Review and Submit */}
        {step === 5 && (user?.kycStatus === 'NOT_SUBMITTED' || user?.kycStatus === 'REJECTED') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`${cardBgClass} rounded-lg p-6 space-y-6`}
          >
            <div>
              <h2 className="text-2xl font-light tracking-tight mb-1">Review Information</h2>
              <p className={textMutedClass}>Please review your information before submitting</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`${isDark ? 'bg-slate-800/50' : 'bg-slate-100/50'} border ${dividerClass} rounded-lg p-4 space-y-3`}>
                <h3 className="font-light tracking-tight">Personal Details</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className={textMutedClass}>Name</p>
                    <p>{formData.firstName} {formData.lastName}</p>
                  </div>
                  <div>
                    <p className={textMutedClass}>Date of Birth</p>
                    <p>{formData.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className={textMutedClass}>Country</p>
                    <p>{formData.country}</p>
                  </div>
                </div>
              </div>

              <div className={`${isDark ? 'bg-slate-800/50' : 'bg-slate-100/50'} border ${dividerClass} rounded-lg p-4 space-y-3`}>
                <h3 className="font-light tracking-tight">Address</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className={textMutedClass}>Address</p>
                    <p>{formData.address}</p>
                  </div>
                  <div>
                    <p className={textMutedClass}>City, State, Zip</p>
                    <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                  </div>
                </div>
              </div>

              <div className={`${isDark ? 'bg-slate-800/50' : 'bg-slate-100/50'} border ${dividerClass} rounded-lg p-4 space-y-3`}>
                <h3 className="font-light tracking-tight">Documents</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <p>ID Front: {formData.documentFront?.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <p>ID Back: {formData.documentBack?.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <p>Selfie: {formData.faceSelfie?.name}</p>
                  </div>
                </div>
              </div>

              <div className={`${isDark ? 'bg-slate-800/50' : 'bg-slate-100/50'} border ${dividerClass} rounded-lg p-4 space-y-3`}>
                <h3 className="font-light tracking-tight">Document Type</h3>
                <p className="capitalize">{formData.documentType.replace('_', ' ')}</p>
              </div>
            </div>

            <div className={`bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleInputChange}
                  className={`mt-1 w-4 h-4 rounded cursor-pointer`}
                />
                <span className="text-sm text-blue-400">
                  I confirm that all information provided is accurate and true. I understand this is for identity verification purposes and agree to the KYC policy.
                </span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleBack}
                className={`flex-1 py-2.5 ${buttonSecondaryClass} text-white font-medium rounded-lg transition-colors`}
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.agreedToTerms}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  formData.agreedToTerms
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : isDark
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Submit <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 6: Pending */}
        {step === 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${cardBgClass} rounded-lg p-12 text-center space-y-6`}
          >
            <div className="flex justify-center">
              <div className={`w-20 h-20 ${isDark ? 'bg-yellow-500/20' : 'bg-yellow-500/10'} rounded-full flex items-center justify-center`}>
                <FileText className="h-12 w-12 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-light tracking-tight mb-2">Under Review</h2>
              <p className={`${textMutedClass} max-w-md mx-auto`}>
                Your KYC documents have been received and are currently under review. This typically takes 24-48 hours. We'll notify you via email once the verification is complete.
              </p>
            </div>
            <div className={`${isDark ? 'bg-slate-800/50' : 'bg-slate-100/50'} border ${dividerClass} rounded-lg p-4`}>
              <p className={`text-sm ${textMutedClass}`}>Reference Number</p>
              <p className="text-lg font-mono font-bold text-blue-600">KYC-2024-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
            </div>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </motion.div>
        )}

        {/* Step 7: Approved */}
        {step === 7 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${cardBgClass} rounded-lg p-12 text-center space-y-6`}
          >
            <div className="flex justify-center">
              <div className={`w-20 h-20 ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-500/10'} rounded-full flex items-center justify-center`}>
                <CheckCircle className="h-12 w-12 text-emerald-500" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-light tracking-tight mb-2">Identity Verified</h2>
              <p className={`${textMutedClass} max-w-md mx-auto`}>
                Congratulations! Your identity has been successfully verified. You now have full access to all trading features and higher withdrawal limits.
              </p>
            </div>
            <div className={`${isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/10'} border border-emerald-500/30 rounded-lg p-4 space-y-2`}>
              <p className={`text-sm ${textMutedClass}`}>Verification Status</p>
              <p className="text-lg font-bold text-emerald-500">✓ Approved</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => window.location.href = '/wallet'}
                className={`px-8 py-3 ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-500/10'} text-emerald-500 font-bold rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors`}
              >
                View Wallet
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 8: Rejected */}
        {step === 8 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${cardBgClass} rounded-lg p-12 text-center space-y-6`}
          >
            <div className="flex justify-center">
              <div className={`w-20 h-20 ${isDark ? 'bg-red-500/20' : 'bg-red-500/10'} rounded-full flex items-center justify-center`}>
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-light tracking-tight mb-2">Verification Rejected</h2>
              <p className={`${textMutedClass} max-w-md mx-auto`}>
                Your KYC verification was rejected. This may be due to document quality or other verification issues. You can submit new documents by clicking the button below.
              </p>
            </div>
            <div className={`${isDark ? 'bg-red-500/10' : 'bg-red-500/10'} border border-red-500/30 rounded-lg p-4 space-y-2`}>
              <p className={`text-sm ${textMutedClass}`}>Verification Status</p>
              <p className="text-lg font-bold text-red-500">✗ Rejected</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStep(1);
                  setFormData({
                    firstName: '',
                    lastName: '',
                    dateOfBirth: '',
                    country: '',
                    state: '',
                    city: '',
                    zipCode: '',
                    address: '',
                    documentType: 'passport',
                    documentFront: null,
                    documentBack: null,
                    faceSelfie: null,
                    agreedToTerms: false
                  });
                }}
                className="flex-1 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
              >
                Resubmit KYC
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className={`flex-1 px-8 py-3 ${buttonSecondaryClass} text-white font-bold rounded-lg transition-colors`}
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
