import React, { useState } from 'react';
import { Shield, AlertTriangle, Camera, RefreshCw, X, Check, Mail } from 'lucide-react';

const WaiverPage = () => {
  const [activeTab, setActiveTab] = useState('waiver');
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    emergencyContact: '',
    emergencyPhone: '',
    isMinor: false,
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    witnessName: ''
  });

  const tabs = [
    { id: 'waiver', name: 'Waiver Form', icon: <Shield className="w-5 h-5" /> },
    { id: 'media', name: 'Media Policy', icon: <Camera className="w-5 h-5" /> },
    { id: 'refund', name: 'Refund Policy', icon: <RefreshCw className="w-5 h-5" /> },
    { id: 'rules', name: 'Park Rules', icon: <AlertTriangle className="w-5 h-5" /> }
  ];

  const parkRules = [
    { rule: 'No smoking', icon: '🚫', description: 'Smoking is prohibited throughout the facility' },
    { rule: 'No drugs', icon: '🚫', description: 'Illegal substances are strictly forbidden' },
    { rule: 'No dogs', icon: '🚫', description: 'Pets are not allowed for safety and hygiene reasons' },
    { rule: 'No alcohol', icon: '🚫', description: 'Alcoholic beverages are not permitted' },
    { rule: 'No loud music', icon: '🚫', description: 'Keep music at respectful volumes' },
    { rule: 'Damage liability', icon: '💰', description: 'Participants are liable for any damage they cause to equipment, facilities, or property' },
    { rule: 'Family-friendly environment', icon: '✅', description: 'Maintain appropriate behavior for all ages' },
    { rule: 'Youth-friendly space', icon: '✅', description: 'Safe environment for children and teens' },
    { rule: 'Senior-friendly activities', icon: '✅', description: 'Accessible activities for older adults' },
    {rule: 'Lost & Found',icon: '🔍',description: 'We are not responsible for any lost items. Please take care of your belongings. If we find anything, you can claim it at our Lost & Found desk.'}
  ];

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Check if participant is under age of majority (18 in Nova Scotia)
      if (field === 'dateOfBirth') {
        const age = calculateAge(value);
        newData.isMinor = age !== null && age < 18;
      }
      
      return newData;
    });
  };

  const handleWaiverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!waiverAccepted || !termsAccepted) {
      alert('Please accept both the waiver and terms & conditions before submitting.');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.emergencyContact || !formData.emergencyPhone) {
      alert('Please fill in all required fields.');
      return;
    }

    // Check if minor and parent info is required
    if (formData.isMinor && (!formData.parentName || !formData.parentEmail || !formData.parentPhone)) {
      alert('Parent/guardian information is required for participants under 18.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send waiver email with today's date automatically
      const waiverData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.emergencyPhone,
        dateOfBirth: formData.dateOfBirth,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        isMinor: formData.isMinor,
        parentName: formData.parentName,
        parentEmail: formData.parentEmail,
        parentPhone: formData.parentPhone,
        witnessName: formData.witnessName,
        waiverAccepted: true,
        termsAccepted: true,
        signedAt: new Date().toISOString(),
        signedDate: new Date().toLocaleDateString('en-CA') // Today's date automatically
      };

      console.log('Sending waiver email...', waiverData);

      const response = await fetch('/.netlify/functions/send-waiver-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(waiverData)
      });

      const result = await response.json();
      console.log('Waiver email response:', result);

      if (response.ok) {
        // Show success popup
        setShowSuccessPopup(true);
      } else {
        throw new Error(result.error || 'Failed to submit waiver');
      }
    } catch (error) {
      console.error('Error submitting waiver:', error);
      alert('There was an error submitting your waiver. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      dateOfBirth: '',
      emergencyContact: '',
      emergencyPhone: '',
      isMinor: false,
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      witnessName: ''
    });
    setWaiverAccepted(false);
    setTermsAccepted(false);
  };

  const isFormValid = () => {
    const basicValid = formData.fullName && 
                      formData.email && 
                      formData.emergencyContact && 
                      formData.emergencyPhone && 
                      waiverAccepted && 
                      termsAccepted;
    
    if (formData.isMinor) {
      return basicValid && formData.parentName && formData.parentEmail && formData.parentPhone;
    }
    
    return basicValid;
  };

  return (
    <div className="pt-20">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Waiver Signed Successfully!</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <h4 className="font-semibold text-blue-900 mb-2">Check Your Email</h4>
                    <p className="text-sm text-blue-800">
                      We've sent your signed waiver to <strong>{formData.email}</strong>
                      {formData.isMinor && formData.parentEmail && (
                        <span> and to the parent/guardian at <strong>{formData.parentEmail}</strong></span>
                      )}. 
                      Please check your inbox (and spam folder) for the confirmation email.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <h4 className="font-semibold text-yellow-800 mb-2">Important Reminder</h4>
                    <p className="text-sm text-yellow-700">
                      You must bring this signed waiver email (printed or on your phone) 
                      when you arrive at Splash Fun Land. Entry will not be permitted without it.
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={closeSuccessPopup}
                className="w-full py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Waiver & Policies</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Please review our policies, safety guidelines, and terms of service before your visit. 
            Your safety and enjoyment are our top priorities.
          </p>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Waiver Form Tab */}
          {activeTab === 'waiver' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Sports Waiver</h2>
              </div>

              <div className="prose max-w-none">
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-red-800 text-lg mb-2">IMPORTANT LEGAL NOTICE</h4>
                      <p className="text-red-700 font-medium">
                        BY SIGNING THIS DOCUMENT YOU WILL WAIVE OR GIVE UP CERTAIN LEGAL RIGHTS, 
                        INCLUDING THE RIGHT TO SUE OR CLAIM COMPENSATION FOLLOWING AN ACCIDENT
                      </p>
                      <p className="text-red-700 font-bold mt-2">PLEASE READ CAREFULLY!</p>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8 p-6 bg-primary-50 border border-primary-200 rounded-lg">
                  <h3 className="text-2xl font-bold text-primary-900 mb-2">
                    RELEASE OF LIABILITY, WAIVER OF CLAIMS,<br />
                    ASSUMPTION OF RISKS AND INDEMNITY AGREEMENT
                  </h3>
                  <p className="text-primary-700 font-medium">(hereinafter referred to as the "Release Agreement")</p>
                </div>

                <div className="space-y-6 text-gray-700 leading-relaxed">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>ORGANIZATION NAME:</strong> Wise_SFL Corporation operating Splash Fun Land</p>
                    <p><strong>SPORT ACTIVITIES:</strong> Water sports, beach soccer, volleyball, recreational activities, and related services (to be referred to as "SPORT" in this document)</p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">DEFINITION</h4>
                    <p>
                      In this Release Agreement, the term "SPORT" shall include all activities, events or services provided, 
                      arranged, organized, conducted, sponsored or authorized by Wise_SFL Corporation and its directors, 
                      officers, employees, instructors, guides, agents, representatives, independent contractors, 
                      subcontractors, suppliers, sponsors, successors and assigns (all of whom are hereinafter referred 
                      as "the Releasees") and shall include, but is not limited to: running; jumping; climbing; physical 
                      contact; throwing, passing, hitting or kicking of an object; rental of Equipment; orientational and 
                      instructional courses, seminars and sessions; travel, transport and accommodation; and other such 
                      activities, events and services in any way connected with or related to SPORT.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">RENTAL AGREEMENT</h4>
                    <p>
                      I accept full responsibility for the Equipment rented and agree to pay for any damage to the 
                      Equipment and replace the Equipment at full retail value if not returned by the agreed date.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">SAFETY</h4>
                    <p>
                      I have been advised to wear all protective equipment that is required by the rules and regulations 
                      of the governing body for my SPORT. I am aware that the physical exertion required for SPORT and 
                      the forces exerted on the body can activate or aggravate pre-existing physical injuries, conditions, 
                      symptoms or congenital defects. I have been advised to seek medical advice if I know or suspect 
                      that my physical condition may be incompatible with SPORT.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">ASSUMPTION OF RISKS</h4>
                    <p>
                      I am aware that SPORT involves many risks, dangers and hazards. The risks, dangers and hazards, 
                      including but not limited to: loss of balance; difficulty or inability to control one's speed and 
                      direction; impact or collision with other participants or equipment; failure of equipment; variation 
                      or changes in the playing surface including steepness, rocks, gravel or other natural objects; 
                      changing weather conditions; exposure to temperature extremes or inclement weather; travel or 
                      transport to and from the sites used for SPORT; failing to play safely or within the limitations 
                      of one's own abilities, negligence of other participants; and NEGLIGENCE ON THE PART OF THE 
                      RELEASEES, INCLUDING THE FAILURE ON THE PART OF THE RELEASEES TO SAFEGUARD OR PROTECT ME 
                      FROM THE RISKS, DANGERS AND HAZARDS OF SPORT.
                    </p>
                    <p className="font-bold text-lg mt-4">
                      I AM AWARE OF THE RISKS, DANGERS AND HAZARDS ASSOCIATED WITH SPORT AND I FREELY ACCEPT AND 
                      FULLY ASSUME ALL SUCH RISKS, DANGERS AND HAZARDS AND THE POSSIBILITY OF PERSONAL INJURY, 
                      DEATH, PROPERTY DAMAGE OR LOSS RESULTING THEREFROM.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">RELEASE OF LIABILITY, WAIVER OF CLAIMS AND INDEMNITY AGREEMENT</h4>
                    <p>
                      In consideration of the RELEASEES agreeing to my participation in SPORT and permitting my use of 
                      their services, equipment and other facilities, and for other good and valuable consideration, 
                      the receipt and sufficiency of which is acknowledged, I hereby agree as follows:
                    </p>
                    
                    <ol className="list-decimal list-inside space-y-4 mt-4 ml-4">
                      <li>
                        <strong>TO WAIVE ANY AND ALL CLAIMS</strong> that I have or may in the future have against the 
                        RELEASEES AND TO RELEASE THE RELEASEES from any and all liability for any loss, damage, expense 
                        or injury, including death, that I may suffer or that my next of kin may suffer, as a result of 
                        my participation in SPORT or my use of the Equipment DUE TO ANY CAUSE WHATSOEVER, INCLUDING 
                        NEGLIGENCE, BREACH OF CONTRACT, OR BREACH OF ANY STATUTORY OR OTHER DUTY OF CARE, INCLUDING ANY 
                        DUTY OF CARE OWED UNDER THE OCCUPIERS LIABILITY ACT, ON THE PART OF THE RELEASEES, AND FURTHER 
                        INCLUDING THE FAILURE ON THE PART OF THE RELEASEES TO SAFEGUARD OR PROTECT ME FROM THE RISKS, 
                        DANGERS AND HAZARDS OF PARTICIPATING IN SPORT REFERRED TO ABOVE; OR DUE TO NEGLIGENCE, BREACH 
                        OF CONTRACT, OR BREACH OF WARRANTY ON THE PART OF THE RELEASEES IN RESPECT OF THE DESIGN, 
                        MANUFACTURE, SELECTION, INSTALLATION, MAINTENANCE, INSPECTION, SERVICE OR REPAIR OF THE EQUIPMENT, 
                        or in respect of the provision of or the failure to provide any warnings, directions, instructions 
                        or guidance as to the use of the Equipment.
                      </li>
                      
                      <li>
                        <strong>TO HOLD HARMLESS AND INDEMNIFY THE RELEASEES</strong> for any and all liability for any 
                        property damage, loss or personal injury to any third party resulting from my participation in 
                        SPORT or use of the Equipment;
                      </li>
                      
                      <li>
                        This Release Agreement shall be effective and binding upon my heirs, next of kin, executors, 
                        administrators, assigns and representatives, in the event of my death or incapacity;
                      </li>
                      
                      <li>
                        This Release Agreement and any rights, duties and obligations as between the parties to this 
                        Release Agreement shall be governed by and interpreted solely in accordance with the laws of 
                        Nova Scotia and no other jurisdiction; and
                      </li>
                      
                      <li>
                        Any litigation involving the parties to this Release Agreement shall be brought solely within 
                        Nova Scotia and shall be within the exclusive jurisdiction of the Courts of Nova Scotia.
                      </li>
                    </ol>
                    
                    <p className="mt-4">
                      In entering into this Release Agreement I am not relying on any oral or written representations 
                      or statements made by the Releasees with respect to the safety of participating in SPORT, other 
                      than what is set forth in this Release Agreement.
                    </p>
                    
                    <p className="font-bold text-lg mt-4">
                      I CONFIRM THAT I HAVE READ AND UNDERSTOOD THIS RELEASE AGREEMENT PRIOR TO SIGNING IT, AND I AM 
                      AWARE THAT BY SIGNING THIS RELEASE AGREEMENT I AM WAIVING CERTAIN LEGAL RIGHTS WHICH I OR MY 
                      HEIRS, NEXT OF KIN, EXECUTORS, ADMINISTRATORS, ASSIGNS AND REPRESENTATIVES MAY HAVE AGAINST THE 
                      RELEASEES.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleWaiverSubmit} className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">Participant Information & Digital Signature</h4>
                  
                  {/* Today's Date Display */}
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        Signing Date: {new Date().toLocaleDateString('en-CA', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (Please print clearly) *</label>
                      <input 
                        type="text" 
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                        required 
                        placeholder="Participant's full legal name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                        required 
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                      <input 
                        type="date" 
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                        required
                      />
                      {formData.dateOfBirth && (
                        <p className="text-sm text-gray-600 mt-1">
                          Age: {calculateAge(formData.dateOfBirth)} years old
                          {formData.isMinor && (
                            <span className="text-red-600 font-medium"> - Guardian signature required (under 18)</span>
                          )}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact *</label>
                      <input 
                        type="text" 
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                        required 
                        placeholder="Emergency contact name"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Phone *</label>
                      <input 
                        type="tel" 
                        value={formData.emergencyPhone}
                        onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                        required 
                        placeholder="+1 (902) 333-3456"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Witness Name (Optional)</label>
                      <input 
                        type="text" 
                        value={formData.witnessName}
                        onChange={(e) => handleInputChange('witnessName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                        placeholder="Witness name (if applicable)"
                      />
                    </div>
                  </div>

                  {/* Parent/Guardian Information for Minors */}
                  {formData.isMinor && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h5 className="font-semibold text-red-900 mb-3">Parent/Guardian Information (Required for participants under 18)</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-red-700 mb-1">Parent/Guardian Name *</label>
                          <input 
                            type="text" 
                            value={formData.parentName}
                            onChange={(e) => handleInputChange('parentName', e.target.value)}
                            className="w-full px-3 py-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                            required={formData.isMinor}
                            placeholder="Parent/Guardian full name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-red-700 mb-1">Parent/Guardian Email *</label>
                          <input 
                            type="email" 
                            value={formData.parentEmail}
                            onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                            className="w-full px-3 py-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                            required={formData.isMinor}
                            placeholder="parent@example.com"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-red-700 mb-1">Parent/Guardian Phone *</label>
                          <input 
                            type="tel" 
                            value={formData.parentPhone}
                            onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                            className="w-full px-3 py-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                            required={formData.isMinor}
                            placeholder="+1 (902) 333-3456"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-3">Digital Signature & Agreements</h5>
                      
                      <label className="flex items-start space-x-3 mb-4">
                        <input 
                          type="checkbox" 
                          className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                          checked={waiverAccepted}
                          onChange={(e) => setWaiverAccepted(e.target.checked)}
                          required
                        />
                        <span className="text-sm text-gray-700">
                          <strong>I acknowledge and accept this Release Agreement.</strong> I have read and understand 
                          this waiver and release of liability, and I voluntarily agree to the terms and conditions 
                          stated above. I understand that I am waiving certain legal rights by signing this agreement.
                          {formData.isMinor && (
                            <span className="block mt-2 text-red-700 font-medium">
                              As the parent/guardian, I am signing this waiver on behalf of the minor participant 
                              and agree to be bound by all terms of this agreement.
                            </span>
                          )}
                        </span>
                      </label>
                      
                      <label className="flex items-start space-x-3">
                        <input 
                          type="checkbox" 
                          className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          required
                        />
                        <span className="text-sm text-gray-700">
                          <strong>I agree to all facility terms and conditions.</strong> I accept the park rules, 
                          media policy, refund policy, and all other terms of service for Splash Fun Land.
                        </span>
                      </label>
                    </div>

                    {!isFormValid() && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-700 font-medium">
                            {formData.isMinor && (!formData.parentName || !formData.parentEmail || !formData.parentPhone)
                              ? 'Parent/guardian information is required for participants under 18.'
                              : 'Please fill in all required fields and accept both agreements.'
                            }
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit"
                    disabled={!isFormValid() || isSubmitting}
                    className={`mt-6 w-full py-3 font-semibold rounded-lg transition-colors ${
                      isFormValid() && !isSubmitting
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Submitting Digital Signature...</span>
                      </div>
                    ) : (
                      isFormValid() ? 'Submit Digital Signature' : 'Please Complete All Requirements'
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Media Policy Tab */}
          {activeTab === 'media' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Media Policy</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Camera className="w-8 h-8 text-primary-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Photography and Videography</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Splash Fun Land reserves the right to take photographs and videos of participants during 
                      activities for the following purposes:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>Marketing and promotional materials</li>
                      <li>Social media content</li>
                      <li>Website and advertising use</li>
                      <li>Security and safety monitoring</li>
                      <li>Documentation of activities and events</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Security Cameras</h4>
                  <p className="text-gray-700">
                    For the safety and security of all participants, Splash Fun Land operates security cameras 
                    throughout the facility. These recordings are used exclusively for security purposes and 
                    are stored securely with limited access.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-semibold text-green-900 mb-3">Personal Photography</h4>
                  <p className="text-green-800">
                    Participants are welcome to take their own photos and videos during their visit. 
                    We encourage sharing your experience on social media and tagging us!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Refund Policy Tab */}
          {activeTab === 'refund' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Refund Policy</h2>
              
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <X className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-red-900 mb-3">No Refund Policy</h3>
                      <p className="text-red-800 leading-relaxed">
                        <strong>All sales are final.</strong> No refunds will be provided after payment has been processed. 
                        This policy applies to all bookings, activities, and services at Splash Fun Land.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h4 className="font-semibold text-yellow-900 mb-3">Weather-Related Cancellations</h4>
                    <p className="text-yellow-800 text-sm leading-relaxed">
                      In case of severe weather conditions that make activities unsafe, we may offer:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-yellow-800 text-sm space-y-1">
                      <li>Rescheduling to another available date</li>
                      <li>Credit toward future bookings</li>
                      <li>Alternative indoor activities (when available)</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Facility Closure</h4>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      If we must close due to unforeseen circumstances:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-blue-800 text-sm space-y-1">
                      <li>Full credit for future use</li>
                      <li>Priority rebooking when reopened</li>
                      <li>Extended validity period for credits</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Important Considerations</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Please ensure your booking details are correct before payment</li>
                    <li>• Contact us immediately if you notice any errors in your booking</li>
                    <li>• Consider purchasing travel insurance for added protection</li>
                    <li>• Review all policies before completing your booking</li>
                  </ul>
                </div>

                <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                  <h4 className="font-semibold text-primary-900 mb-3">Questions About This Policy?</h4>
                  <p className="text-primary-800 mb-3">
                    If you have questions about our refund policy or need assistance with your booking, 
                    please contact us before completing your purchase.
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Park Rules Tab */}
          {activeTab === 'rules' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Park Rules & Guidelines</h2>
              
              <div className="mb-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  To ensure a safe, enjoyable experience for everyone, please follow these important rules and guidelines 
                  during your visit to Splash Fun Land.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {parkRules.map((rule, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg border-2 ${
                      rule.rule.includes('No') || rule.rule.includes('liability')
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{rule.icon}</div>
                      <div>
                        <h3 className={`text-lg font-semibold mb-2 ${
                          rule.rule.includes('No') || rule.rule.includes('liability')
                            ? 'text-red-900' 
                            : 'text-green-900'
                        }`}>
                          {rule.rule}
                        </h3>
                        <p className={`text-sm ${
                          rule.rule.includes('No') || rule.rule.includes('liability')
                            ? 'text-red-700' 
                            : 'text-green-700'
                        }`}>
                          {rule.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-900 mb-3">Safety Guidelines</h4>
                  <ul className="space-y-2 text-blue-800">
                    <li>• Follow all instructions from Splash Fun Land staff</li>
                    <li>• Wear appropriate swimwear and footwear for water activities</li>
                    <li>• Stay hydrated and take breaks as needed</li>
                    <li>• Report any injuries or incidents to staff immediately</li>
                    <li>• Supervise children at all times</li>
                    <li>• Use sunscreen and protective clothing</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h4 className="font-semibold text-purple-900 mb-3">Facility Respect</h4>
                  <ul className="space-y-2 text-purple-800">
                    <li>• Keep facilities clean and dispose of trash properly</li>
                    <li>• Respect equipment and return items after use</li>
                    <li>• Be courteous to other participants and staff</li>
                    <li>• Follow capacity limits for activities</li>
                    <li>• Respect designated areas and boundaries</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h4 className="font-semibold text-orange-900 mb-3">Consequences</h4>
                  <p className="text-orange-800 mb-3">
                    Failure to follow park rules may result in:
                  </p>
                  <ul className="space-y-1 text-orange-800">
                    <li>• Warning from staff</li>
                    <li>• Temporary suspension from activities</li>
                    <li>• Removal from the facility without refund</li>
                    <li>• Ban from future visits</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default WaiverPage;