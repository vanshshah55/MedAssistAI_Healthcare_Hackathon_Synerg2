import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, RefreshCw, FileType, AlertCircle, CheckCircle, Image as ImageIcon, Activity, User, Calendar, Clock, Heart } from 'lucide-react';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  condition: string;
  vitalSigns?: {
    heartRate: number;
    bloodPressure: number;
    oxygenSaturation: number;
    temperature: number;
  };
}

interface PredictionResult {
  class_name: string;
  confidence: number;
  class_desc: string;
  prediction: number;
  error?: string;
}

const PatientDetails: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [outputResult, setOutputResult] = useState<string>("No results to display yet");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [classifierType, setClassifierType] = useState<string>("blood");
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);

  useEffect(() => {
    // Hardcoded patient data
    const allPatients = [
      { 
        id: 1,
        name: 'John Doe', 
        age: 45, 
        gender: 'Male', 
        condition: 'Chest Pain',
        vitalSigns: {
          heartRate: 135,
          bloodPressure: 85,
          oxygenSaturation: 82,
          temperature: 36.8
        }
      },
      { 
        id: 2, 
        name: 'Jane Smith', 
        age: 32, 
        gender: 'Female', 
        condition: 'Broken Arm',
        vitalSigns: {
          heartRate: 72,
          bloodPressure: 120,
          oxygenSaturation: 98,
          temperature: 36.5
        }
      },
      { 
        id: 3, 
        name: 'Robert Johnson', 
        age: 68, 
        gender: 'Male', 
        condition: 'Stroke Symptoms',
        vitalSigns: {
          heartRate: 92,
          bloodPressure: 145,
          oxygenSaturation: 94,
          temperature: 37.1
        }
      },
      { 
        id: 4, 
        name: 'Emily Davis', 
        age: 28, 
        gender: 'Female', 
        condition: 'Fever',
        vitalSigns: {
          heartRate: 110,
          bloodPressure: 110,
          oxygenSaturation: 96,
          temperature: 38.5
        }
      },
      { 
        id: 5, 
        name: 'Michael Wilson', 
        age: 52, 
        gender: 'Male', 
        condition: 'Abdominal Pain',
        vitalSigns: {
          heartRate: 88,
          bloodPressure: 130,
          oxygenSaturation: 97,
          temperature: 37.0
        }
      },
      { 
        id: 6, 
        name: 'Sarah Brown', 
        age: 41, 
        gender: 'Female', 
        condition: 'Allergic Reaction',
        vitalSigns: {
          heartRate: 115,
          bloodPressure: 95,
          oxygenSaturation: 91,
          temperature: 37.2
        }
      },
      { 
        id: 7, 
        name: 'David Miller', 
        age: 75, 
        gender: 'Male', 
        condition: 'Fall Injury',
        vitalSigns: {
          heartRate: 78,
          bloodPressure: 155,
          oxygenSaturation: 93,
          temperature: 36.4
        }
      },
      { 
        id: 8, 
        name: 'Emma Wilson', 
        age: 35, 
        gender: 'Female', 
        condition: 'Migraine',
        vitalSigns: {
          heartRate: 82,
          bloodPressure: 118,
          oxygenSaturation: 99,
          temperature: 36.7
        }
      },
      { 
        id: 9, 
        name: 'James Anderson', 
        age: 62, 
        gender: 'Male', 
        condition: 'Hypertension',
        vitalSigns: {
          heartRate: 95,
          bloodPressure: 165,
          oxygenSaturation: 95,
          temperature: 36.9
        }
      },
      { 
        id: 10, 
        name: 'Sophia Lee', 
        age: 29, 
        gender: 'Female', 
        condition: 'Asthma Attack',
        vitalSigns: {
          heartRate: 125,
          bloodPressure: 105,
          oxygenSaturation: 88,
          temperature: 37.3
        }
      }
    ];
    
    const foundPatient = allPatients.find(p => p.id === Number(patientId));
    
    if (foundPatient) {
      setPatient(foundPatient);
    } else {
      // Generate random vital signs within normal ranges
      const randomVitalSigns = {
        heartRate: Math.floor(Math.random() * (100 - 60) + 60),
        bloodPressure: Math.floor(Math.random() * (120 - 90) + 90),
        oxygenSaturation: Math.floor(Math.random() * (100 - 95) + 95),
        temperature: Number((Math.random() * (37.5 - 36.5) + 36.5).toFixed(1))
      };

      // Random patient data when not found
      setPatient({ 
        id: Number(patientId) || 0,
        name: "Alex Thompson",  // Default name instead of "Patient Not Found"
        age: 34,
        gender: 'Male',
        condition: 'General Checkup',
        vitalSigns: randomVitalSigns
      });
    }
  }, [patientId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setAnalysisComplete(false);
      setPredictionResult(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runClassification = async () => {
    if (!selectedImage) {
      setOutputResult("Please select an image first");
      return;
    }

    setIsLoading(true);
    setAnalysisComplete(false);
    setOutputResult("Processing image...");

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('task', classifierType);

      const response = await fetch('http://localhost:8503/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result: PredictionResult = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      setPredictionResult(result);
      
      // Format the result for display
      setOutputResult(
        `Prediction: ${result.class_name}\nConfidence: ${result.confidence.toFixed(2)}%\nDescription: ${result.class_desc}`
      );
      
      setIsLoading(false);
      setAnalysisComplete(true);
    } catch (error: any) {
      console.error("Error processing image:", error);
      setOutputResult(`Error processing image: ${error.message}`);
      setIsLoading(false);
    }
  };

  const getClassifierIcon = (type: string) => {
    switch (type) {
      case 'blood': return <div className="w-6 h-6 rounded-full bg-red-500"></div>;
      case 'breast': return <div className="w-6 h-6 rounded-full bg-pink-400"></div>;
      case 'derma': return <div className="w-6 h-6 rounded-full bg-amber-500"></div>;
      case 'pneumonia': return <div className="w-6 h-6 rounded-full bg-blue-400"></div>;
      case 'retina': return <div className="w-6 h-6 rounded-full bg-purple-500"></div>;
      default: return <FileType size={24} />;
    }
  };

  const getClassifierColor = (type: string) => {
    switch (type) {
      case 'blood': return 'from-red-500 to-red-600';
      case 'breast': return 'from-pink-400 to-pink-500';
      case 'derma': return 'from-amber-500 to-amber-600';
      case 'pneumonia': return 'from-blue-400 to-blue-500';
      case 'retina': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getClassifierGradient = (type: string) => {
    switch (type) {
      case 'blood': return 'from-red-50 to-red-100';
      case 'breast': return 'from-pink-50 to-pink-100';
      case 'derma': return 'from-amber-50 to-amber-100';
      case 'pneumonia': return 'from-blue-50 to-blue-100';
      case 'retina': return 'from-purple-50 to-purple-100';
      default: return 'from-gray-50 to-gray-100';
    }
  };

  if (!patient) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/patients')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200"
      >
        <ArrowLeft size={20} className="mr-2" />
        <span className="font-medium">Back to Patients</span>
      </button>

      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
        {/* Main Content */}
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <Activity size={20} className="mr-2 text-blue-600" />
              Medical Image Analysis
            </h2>
            <p className="text-gray-600">
              Upload medical images for AI-powered analysis and diagnosis assistance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Upload Section */}
            <div className={`bg-gradient-to-br ${getClassifierGradient(classifierType)} rounded-xl p-6 shadow-sm border border-gray-200 transition-all duration-300`}>
              <div className="flex items-center mb-4">
                <ImageIcon size={20} className="text-gray-700 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Upload Medical Image</h3>
              </div>
              
              <div className="mb-5 bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <span>Classification Type</span>
                  <div className="ml-2 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">Medical Models</div>
                </label>
                <div className="relative">
                  <select 
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-all duration-200"
                    value={classifierType}
                    onChange={(e) => {
                      setClassifierType(e.target.value);
                      // Reset results when changing classifier type
                      if (analysisComplete) {
                        setAnalysisComplete(false);
                        setPredictionResult(null);
                        setOutputResult("No results to display yet");
                      }
                    }}
                  >
                    <option value="blood">Blood Cell Analysis</option>
                    <option value="breast">Breast Tissue Analysis</option>
                    <option value="derma">Dermatology Analysis</option>
                    <option value="pneumonia">Lung/Pneumonia Analysis</option>
                    <option value="retina">Retinal Analysis</option>
                  </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {getClassifierIcon(classifierType)}
                  </div>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center w-full mb-5">
                <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${imagePreview ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                  {imagePreview ? (
                    <div className="relative w-full h-full flex items-center justify-center p-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-60 max-w-full object-contain rounded-lg shadow-sm"
                      />
                      <div className="absolute bottom-2 right-2 bg-white bg-opacity-75 rounded-full p-1">
                        <CheckCircle size={20} className="text-green-500" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="mb-3 p-3 rounded-full bg-blue-50">
                        <Upload size={24} className="text-blue-500" />
                      </div>
                      <p className="mb-2 text-sm text-gray-700 font-medium">
                        <span className="text-blue-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG or DICOM (MAX. 10MB)
                      </p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              
              {selectedImage && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-3">
                    <FileType size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700 font-medium truncate max-w-[200px]">
                      {selectedImage.name}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {(selectedImage.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <button 
                    className={`w-full py-2.5 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isLoading 
                        ? 'bg-gray-200 text-gray-600 cursor-not-allowed' 
                        : `bg-gradient-to-r ${getClassifierColor(classifierType)} text-white hover:shadow-md`
                    }`}
                    onClick={runClassification}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={18} className="mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Activity size={18} className="mr-2" />
                        Analyze Image
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
            
            {/* Output Display Box */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Activity size={20} className="text-gray-700 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Classification Results</h3>
                </div>
                {analysisComplete && (
                  <div className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                    <CheckCircle size={14} className="mr-1" />
                    Analysis Complete
                  </div>
                )}
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center">
                    {getClassifierIcon(classifierType)}
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {classifierType.charAt(0).toUpperCase() + classifierType.slice(1)} Analysis Results
                    </span>
                  </div>
                  <button 
                    className="text-gray-500 hover:text-gray-700 text-xs font-medium bg-white px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => {
                      setOutputResult("No results to display yet");
                      setAnalysisComplete(false);
                      setPredictionResult(null);
                    }}
                  >
                    Clear
                  </button>
                </div>
                <div className={`p-4 font-mono text-sm whitespace-pre-wrap overflow-auto transition-all duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`} style={{ minHeight: '300px', maxHeight: '300px' }}>
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mb-4"></div>
                      <p>Processing image...</p>
                      <p className="text-xs mt-2">This may take a few moments</p>
                    </div>
                  ) : outputResult === "No results to display yet" ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <AlertCircle size={24} className="mb-2" />
                      <p>No results to display yet</p>
                      <p className="text-xs mt-2">Upload an image and run analysis</p>
                    </div>
                  ) : predictionResult ? (
                    <div className="text-gray-800">
                      <div className="mb-4">
                        <div className="font-semibold">Prediction:</div>
                        <div className="p-2 bg-blue-50 border border-blue-100 rounded text-blue-800 mt-1">
                          {predictionResult.class_name}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="font-semibold">Confidence:</div>
                        <div className="p-2 bg-green-50 border border-green-100 rounded text-green-800 mt-1">
                          {predictionResult.confidence.toFixed(2)}%
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="font-semibold">AI Analysis:</div>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded text-gray-800 mt-1 text-sm leading-relaxed">
                          {predictionResult.class_desc.split('\n\n').map((paragraph, idx) => (
                            <p key={idx} className={idx > 0 ? "mt-2" : ""}>
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-800">
                      {outputResult.split('\n').map((line, index) => {
                        if (line.includes('Prediction:')) {
                          return (
                            <div key={index} className="mt-4 p-2 bg-blue-50 border border-blue-100 rounded text-blue-800 font-medium">
                              {line}
                            </div>
                          );
                        }
                        return <div key={index}>{line}</div>;
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              {analysisComplete && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                    <AlertCircle size={16} className="text-blue-600" />
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Note:</p>
                    <p className="mt-1">This analysis is for demonstration purposes. In a clinical setting, all results should be verified by a healthcare professional.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;