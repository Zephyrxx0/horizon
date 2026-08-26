import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, ChevronRight, Upload, Eye, EyeOff, Loader } from 'lucide-react';

const VisaApplicationPortal = () => {
  const [currentStage, setCurrentStage] = useState(0); // 0-4
  const [applicationStarted, setApplicationStarted] = useState(false);
  const [showStatusCheck, setShowStatusCheck] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    destinationCountry: '',
    visaType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    passportNumber: '',
    passportExpiry: '',
    dateOfBirth: '',
    documents: [],
    paymentMethod: '',
    applicationType: 'individual',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);

  // Visa options by country
  const visaOptions = {
    USA: ['B1/B2 (Tourist/Business)', 'F1 (Student)', 'H1B (Work)'],
    UK: ['Tourist Visa', 'Student Visa', 'Work Visa'],
    Canada: ['Visitor Visa', 'Study Permit', 'Work Permit'],
    Australia: ['Tourist Visa', 'Student Visa', 'Skilled Migration'],
    Schengen: ['Schengen Tourist', 'Schengen Business'],
  };

  const countries = Object.keys(visaOptions);

  // Visa pricing (mocked)
  const visaPricing = {
    'B1/B2 (Tourist/Business)': 7500,
    'F1 (Student)': 8500,
    'H1B (Work)': 10000,
    'Tourist Visa': 6500,
    'Student Visa': 7500,
    'Work Visa': 9000,
    'Visitor Visa': 6000,
    'Study Permit': 8000,
    'Work Permit': 9500,
    'Tourist Visa': 5000,
    'Student Visa': 7000,
    'Skilled Migration': 10000,
    'Schengen Tourist': 5500,
    'Schengen Business': 6500,
  };

  const platformFee = 1500;
  const governmentFee = 5000;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate current stage
  const validateStage = () => {
    const newErrors = {};

    if (currentStage === 0) {
      if (!formData.destinationCountry)
        newErrors.destinationCountry = 'Please select a destination';
      if (!formData.visaType) newErrors.visaType = 'Please select a visa type';
    }

    if (currentStage === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name required';
      if (!formData.email.trim()) newErrors.email = 'Email required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
      if (!formData.phone) newErrors.phone = 'Phone required';
      if (formData.phone.length < 10) newErrors.phone = 'Phone must be 10+ digits';
      if (!formData.passportNumber) newErrors.passportNumber = 'Passport number required';
      if (!/^[A-Z]{2}\d{7}$/.test(formData.passportNumber.replace(/\s/g, ''))) {
        newErrors.passportNumber = 'Invalid format. Use: AA1234567';
      }
      if (!formData.passportExpiry) newErrors.passportExpiry = 'Expiry date required';
      const expiryDate = new Date(formData.passportExpiry);
      const sixMonthsAhead = new Date();
      sixMonthsAhead.setMonth(sixMonthsAhead.getMonth() + 6);
      if (expiryDate < sixMonthsAhead) {
        newErrors.passportExpiry = 'Passport must be valid for 6+ months';
      }
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth required';
    }

    if (currentStage === 2) {
      if (formData.documents.length === 0) newErrors.documents = 'Upload at least one document';
    }

    if (currentStage === 3) {
      if (!formData.paymentMethod) newErrors.paymentMethod = 'Select a payment method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Move to next stage
  const handleNext = () => {
    if (validateStage()) {
      if (currentStage < 4) {
        setCurrentStage(currentStage + 1);
      }
    }
  };

  // Move to previous stage
  const handlePrevious = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
    }
  };

  // Handle document upload
  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, documents: 'File size must be less than 5MB' }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, { name: file.name, size: file.size, type: file.type }],
      }));
    });
  };

  // Remove document
  const removeDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  // Submit application
  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const id = 'VISA' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setApplicationId(id);
      setReferenceNumber(id);
      setApplicationStatus({
        status: 'received',
        date: new Date().toLocaleDateString(),
        timeline: [
          {
            status: 'Application Received',
            date: new Date().toLocaleDateString(),
            completed: true,
          },
          { status: 'Documents Under Review', date: 'In Progress', completed: false },
          { status: 'Interview Scheduling', date: 'Pending', completed: false },
          { status: 'Visa Decision', date: 'Pending', completed: false },
        ],
      });
      setLoading(false);
      setCurrentStage(5); // Confirmation stage
    }, 2000);
  };

  // Format passport number
  const formatPassportNumber = (value) => {
    return value.replace(/\s/g, '').toUpperCase().slice(0, 9);
  };

  // Calculate total cost
  const visaFee = visaPricing[formData.visaType] || 0;
  const totalCost = visaFee + governmentFee + platformFee;

  // Stages data
  const stages = [
    { name: 'Destination', duration: '1 min' },
    { name: 'Personal Info', duration: '3 min' },
    { name: 'Documents', duration: '5 min' },
    { name: 'Payment', duration: '2 min' },
    { name: 'Confirmation', duration: '1 min' },
  ];

  if (!applicationStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 text-center">
            <div className="mb-6">
              <div className="text-5xl mb-4">🇮🇳</div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Indian Visa Service Portal
              </h1>
              <p className="text-gray-600 text-lg">Simple. Clear. Mobile-First.</p>
            </div>

            <div className="my-10 space-y-4 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">15-minute application</h3>
                  <p className="text-gray-600 text-sm">Clear step-by-step guidance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Mobile-optimized</h3>
                  <p className="text-gray-600 text-sm">Works perfectly on your phone</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Real-time tracking</h3>
                  <p className="text-gray-600 text-sm">Know exactly where you are in the process</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setApplicationStarted(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Start New Application
              </button>
              <button
                onClick={() => setShowStatusCheck(true)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-6 rounded-lg transition"
              >
                Check Application Status
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showStatusCheck && !applicationStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Check Application Status</h2>
            <input
              type="text"
              placeholder="Enter your reference number (e.g., VISA123ABC)"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
            <button
              onClick={() => {
                if (referenceNumber === applicationId) {
                  // Show mock status
                  setApplicationStatus({
                    timeline: [
                      { status: 'Application Received', date: '2024-02-12', completed: true },
                      { status: 'Documents Under Review', date: 'Feb 13-15', completed: true },
                      { status: 'Interview Scheduled', date: 'Feb 18', completed: false },
                      { status: 'Visa Decision', date: 'Feb 25', completed: false },
                    ],
                  });
                }
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render stages
  const renderStageContent = () => {
    switch (currentStage) {
      case 0:
        return (
          <StageZero
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            countries={countries}
            visaOptions={visaOptions}
          />
        );
      case 1:
        return (
          <StageOne
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            formatPassportNumber={formatPassportNumber}
          />
        );
      case 2:
        return (
          <StageTwo
            formData={formData}
            handleDocumentUpload={handleDocumentUpload}
            removeDocument={removeDocument}
            errors={errors}
          />
        );
      case 3:
        return (
          <StageThree
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            visaFee={visaFee}
            platformFee={platformFee}
            governmentFee={governmentFee}
            totalCost={totalCost}
          />
        );
      case 4:
        return (
          <StageFour
            formData={formData}
            visaFee={visaFee}
            platformFee={platformFee}
            governmentFee={governmentFee}
            totalCost={totalCost}
            loading={loading}
          />
        );
      case 5:
        return (
          <StageConfirmation applicationId={applicationId} applicationStatus={applicationStatus} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Visa Application</h1>
            {currentStage < 5 && (
              <button
                onClick={() => {
                  setApplicationStarted(false);
                  setShowStatusCheck(false);
                  setCurrentStage(0);
                  setFormData({
                    destinationCountry: '',
                    visaType: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    passportNumber: '',
                    passportExpiry: '',
                    dateOfBirth: '',
                    documents: [],
                    paymentMethod: '',
                  });
                  setErrors({});
                }}
                className="text-gray-600 hover:text-gray-900 underline"
              >
                Start Over
              </button>
            )}
          </div>

          {/* Progress indicator */}
          {currentStage < 5 && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">
                  Stage {currentStage + 1} of {stages.length}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  ~{stages.slice(currentStage).reduce((sum, s) => sum + parseInt(s.duration), 0)}{' '}
                  min remaining
                </span>
              </div>
              <div className="flex gap-2">
                {stages.map((stage, index) => (
                  <div key={index} className="flex-1">
                    <div
                      className={`h-2 rounded-full transition ${
                        index < currentStage
                          ? 'bg-green-500'
                          : index === currentStage
                            ? 'bg-blue-500'
                            : 'bg-gray-200'
                      }`}
                    ></div>
                    <p className="text-xs text-gray-600 mt-2 text-center">{stage.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">{renderStageContent()}</div>

        {/* Navigation buttons */}
        {currentStage < 5 && (
          <div className="flex gap-4">
            {currentStage > 0 && (
              <button
                onClick={handlePrevious}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-4 rounded-lg transition"
              >
                ← Back
              </button>
            )}
            {currentStage < 4 && (
              <button
                onClick={handleNext}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            )}
            {currentStage === 4 && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>✓ Submit Application</>
                )}
              </button>
            )}
          </div>
        )}

        {currentStage === 5 && (
          <button
            onClick={() => {
              setApplicationStarted(false);
              setShowStatusCheck(false);
              setCurrentStage(0);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            Back to Home
          </button>
        )}
      </div>
    </div>
  );
};

// Stage 0: Destination & Visa Type
const StageZero = ({ formData, handleInputChange, errors, countries, visaOptions }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Where are you traveling?</h2>
      <p className="text-gray-600 mb-6">Select your destination and visa type</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Destination Country
          </label>
          <select
            name="destinationCountry"
            value={formData.destinationCountry}
            onChange={handleInputChange}
            className={`w-full p-3 border-2 rounded-lg font-medium transition ${
              errors.destinationCountry
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-blue-400 focus:border-blue-500'
            }`}
          >
            <option value="">Select a country...</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.destinationCountry && (
            <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.destinationCountry}
            </div>
          )}
        </div>

        {formData.destinationCountry && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Visa Type</label>
            <div className="space-y-2">
              {visaOptions[formData.destinationCountry].map((visa) => (
                <label
                  key={visa}
                  className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition"
                >
                  <input
                    type="radio"
                    name="visaType"
                    value={visa}
                    checked={formData.visaType === visa}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 mr-3"
                  />
                  <span className="font-medium text-gray-900">{visa}</span>
                </label>
              ))}
            </div>
            {errors.visaType && (
              <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.visaType}
              </div>
            )}
          </div>
        )}

        {formData.visaType && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">
              📋 Required Documents for {formData.visaType}:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Valid Passport (6+ months validity)</li>
              <li>✓ Passport Photo (4x6 cm)</li>
              <li>✓ Proof of Address (Aadhar/Utility Bill)</li>
              <li>✓ Bank Statement (Last 3 months)</li>
              <li>✓ Employment Letter (if applicable)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// Stage 1: Personal Details
const StageOne = ({ formData, handleInputChange, errors, formatPassportNumber }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
      <p className="text-gray-600 mb-6">We'll keep this information confidential</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">First Name *</label>
          <input
            type="text"
            name="firstName"
            placeholder="E.g., Rajesh"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`w-full p-3 border-2 rounded-lg font-medium transition ${
              errors.firstName
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 focus:border-blue-500'
            }`}
          />
          {errors.firstName && (
            <span className="text-red-600 text-sm mt-1 block">{errors.firstName}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Last Name *</label>
          <input
            type="text"
            name="lastName"
            placeholder="E.g., Singh"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`w-full p-3 border-2 rounded-lg font-medium transition ${
              errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
            }`}
          />
          {errors.lastName && (
            <span className="text-red-600 text-sm mt-1 block">{errors.lastName}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address *</label>
          <input
            type="email"
            name="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full p-3 border-2 rounded-lg font-medium transition ${
              errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
            }`}
          />
          {errors.email && <span className="text-red-600 text-sm mt-1 block">{errors.email}</span>}
          <p className="text-gray-600 text-xs mt-2">We'll send confirmations here</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Phone Number (with +91) *
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, '');
              if (value.length > 12) value = value.slice(0, 12);
              handleInputChange({ target: { name: 'phone', value } });
            }}
            className={`w-full p-3 border-2 rounded-lg font-medium transition ${
              errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
            }`}
          />
          {errors.phone && <span className="text-red-600 text-sm mt-1 block">{errors.phone}</span>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Passport Number *
          </label>
          <input
            type="text"
            name="passportNumber"
            placeholder="AA1234567"
            value={formData.passportNumber}
            onChange={(e) =>
              handleInputChange({
                target: { name: 'passportNumber', value: formatPassportNumber(e.target.value) },
              })
            }
            className={`w-full p-3 border-2 rounded-lg font-medium transition uppercase ${
              errors.passportNumber
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 focus:border-blue-500'
            }`}
          />
          {errors.passportNumber && (
            <span className="text-red-600 text-sm mt-1 block">{errors.passportNumber}</span>
          )}
          <p className="text-gray-600 text-xs mt-2">
            Format: 2 letters + 7 numbers (found on page 1)
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Passport Expiry Date *
          </label>
          <input
            type="date"
            name="passportExpiry"
            value={formData.passportExpiry}
            onChange={handleInputChange}
            className={`w-full p-3 border-2 rounded-lg font-medium transition ${
              errors.passportExpiry
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 focus:border-blue-500'
            }`}
          />
          {errors.passportExpiry && (
            <span className="text-red-600 text-sm mt-1 block">{errors.passportExpiry}</span>
          )}
          <p className="text-gray-600 text-xs mt-2">Must be valid for 6+ months from now</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Date of Birth *</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className={`w-full p-3 border-2 rounded-lg font-medium transition ${
              errors.dateOfBirth
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 focus:border-blue-500'
            }`}
          />
          {errors.dateOfBirth && (
            <span className="text-red-600 text-sm mt-1 block">{errors.dateOfBirth}</span>
          )}
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-sm text-green-800">
            ✓ <strong>Data saved locally</strong> - Your information is encrypted and never stored
            on servers unless you submit.
          </p>
        </div>
      </div>
    </div>
  );
};

// Stage 2: Documents
const StageTwo = ({ formData, handleDocumentUpload, removeDocument, errors }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload your documents</h2>
      <p className="text-gray-600 mb-6">Make sure files are clear and in correct format</p>

      <div className="space-y-6">
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 text-center">
          <Upload className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-900 mb-2">Click or drag files here</p>
          <input
            type="file"
            multiple
            onChange={handleDocumentUpload}
            className="hidden"
            id="file-upload"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <label
            htmlFor="file-upload"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
          >
            Choose Files
          </label>
          <p className="text-gray-600 text-xs mt-3">PDF, JPG or PNG • Max 5MB per file</p>
        </div>

        {errors.documents && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded">
            <AlertCircle className="w-4 h-4" />
            {errors.documents}
          </div>
        )}

        {formData.documents.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">
              Uploaded Documents ({formData.documents.length})
            </h3>
            {formData.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-600">{(doc.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={() => removeDocument(index)}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h3 className="font-semibold text-yellow-900 mb-2">📋 Typical documents needed:</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>✓ Passport (pages 1-2)</li>
            <li>✓ Recent photo (4x6 cm, white background)</li>
            <li>✓ Proof of address (Aadhar, Utility Bill)</li>
            <li>✓ Bank statement (last 3 months)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Stage 3: Payment
const StageThree = ({
  formData,
  handleInputChange,
  errors,
  visaFee,
  platformFee,
  governmentFee,
  totalCost,
}) => {
  const paymentMethods = [
    'UPI (Google Pay, PhonePe)',
    'Credit/Debit Card',
    'Net Banking',
    'NEFT Transfer',
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment & Review</h2>
      <p className="text-gray-600 mb-6">Review your details and choose payment method</p>

      <div className="space-y-6">
        {/* Cost Breakdown */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Visa Processing Fee:</span>
              <span className="font-medium text-gray-900">₹{visaFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Government Fee:</span>
              <span className="font-medium text-gray-900">₹{governmentFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Platform Fee:</span>
              <span className="font-medium text-gray-900">₹{platformFee.toLocaleString()}</span>
            </div>
          </div>
          <div className="border-t-2 border-gray-300 pt-3 flex justify-between">
            <span className="font-bold text-gray-900">Total Amount:</span>
            <span className="text-2xl font-bold text-blue-600">₹{totalCost.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">Payment Method *</label>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <label
                key={method}
                className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={formData.paymentMethod === method}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 mr-3"
                />
                <span className="font-medium text-gray-900">{method}</span>
              </label>
            ))}
          </div>
          {errors.paymentMethod && (
            <span className="text-red-600 text-sm mt-2 block">{errors.paymentMethod}</span>
          )}
        </div>

        {/* Security notice */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-sm text-green-800">
            🔒 <strong>Secure payment</strong> - Your payment information is encrypted and processed
            securely. No charges are applied until you confirm.
          </p>
        </div>
      </div>
    </div>
  );
};

// Stage 4: Confirmation
const StageFour = ({ formData, visaFee, platformFee, governmentFee, totalCost, loading }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to submit?</h2>
      <p className="text-gray-600 mb-6">Review your information one last time</p>

      <div className="space-y-4">
        {/* Personal Details Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Your Details</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium text-gray-900">
                {formData.firstName} {formData.lastName}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{formData.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Destination</p>
              <p className="font-medium text-gray-900">{formData.destinationCountry}</p>
            </div>
            <div>
              <p className="text-gray-600">Visa Type</p>
              <p className="font-medium text-gray-900">{formData.visaType}</p>
            </div>
            <div>
              <p className="text-gray-600">Passport</p>
              <p className="font-medium text-gray-900">{formData.passportNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Documents</p>
              <p className="font-medium text-gray-900">{formData.documents.length} files</p>
            </div>
          </div>
        </div>

        {/* Cost Summary */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-3">Total Amount Due</h3>
          <div className="text-2xl font-bold text-blue-600">₹{totalCost.toLocaleString()}</div>
          <p className="text-sm text-gray-600 mt-1">Payment via {formData.paymentMethod}</p>
        </div>

        {/* Terms */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <p className="text-sm text-amber-900">
            <strong>⚠️ Important:</strong> By clicking "Submit Application", you confirm that all
            information is accurate and complete. Submitting false information may result in visa
            denial.
          </p>
        </div>
      </div>
    </div>
  );
};

// Stage 5: Confirmation
const StageConfirmation = ({ applicationId, applicationStatus }) => {
  return (
    <div className="text-center">
      <div className="mb-6">
        <div className="text-6xl mb-4">✓</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
        <p className="text-gray-600">Your application has been received successfully</p>
      </div>

      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
        <p className="text-sm text-gray-600 mb-2">Your Reference Number</p>
        <p className="text-2xl font-bold text-green-600 font-mono">{applicationId}</p>
        <p className="text-xs text-gray-600 mt-2">Save this number for tracking</p>
      </div>

      {applicationStatus && (
        <div className="bg-gray-50 rounded-lg p-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-4">Application Timeline</h3>
          <div className="space-y-3">
            {applicationStatus.timeline.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      step.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step.completed ? '✓' : index + 1}
                  </div>
                  {index < 3 && <div className="w-1 h-8 bg-gray-300 mt-1"></div>}
                </div>
                <div className="pt-1">
                  <p className="font-semibold text-gray-900">{step.status}</p>
                  <p className={`text-sm ${step.completed ? 'text-green-600' : 'text-gray-600'}`}>
                    {step.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-left">
        <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Check your email for confirmation (may take 5 min)</li>
          <li>✓ Upload additional documents if requested</li>
          <li>✓ Interview will be scheduled automatically</li>
          <li>✓ We'll notify you at every step</li>
        </ul>
      </div>
    </div>
  );
};

export default VisaApplicationPortal;
