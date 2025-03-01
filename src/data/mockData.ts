import { Patient, Resource, User, Notification, Department, Hospital } from '../pages/types';

// Generate a random date within the last 24 hours
const getRecentDate = () => {
  const now = new Date();
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  now.setHours(now.getHours() - hoursAgo);
  now.setMinutes(now.getMinutes() - minutesAgo);
  return now.toISOString();
};

// Mock Patients Data
export const mockPatients: Patient[] = [
  {
    id: 'P001',
    name: 'John Doe',
    age: 45,
    gender: 'male',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    chronicConditions: ['Hypertension', 'Diabetes Type 2'],
    vitalSigns: [
      {
        name: 'Heart Rate',
        value: 110,
        unit: 'bpm',
        normalRange: { min: 60, max: 100 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Blood Pressure',
        value: 160,
        unit: 'mmHg',
        normalRange: { min: 90, max: 120 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Oxygen Saturation',
        value: 92,
        unit: '%',
        normalRange: { min: 95, max: 100 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Temperature',
        value: 38.5,
        unit: '°C',
        normalRange: { min: 36.5, max: 37.5 },
        timestamp: getRecentDate(),
      },
    ],
    symptoms: [
      {
        id: 'S001',
        name: 'Chest Pain',
        severity: 'severe',
        duration: '2 hours',
      },
      {
        id: 'S002',
        name: 'Shortness of Breath',
        severity: 'moderate',
        duration: '1 hour',
      },
    ],
    triageLevel: 'immediate',
    triageScore: 92,
    arrivalTime: getRecentDate(),
    medicalImages: [
      {
        id: 'IMG001',
        type: 'x-ray',
        url: 'https://images.unsplash.com/photo-1516069677018-378971e2d13b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        bodyPart: 'chest',
        timestamp: getRecentDate(),
        aiAnalysis: {
          condition: 'Possible Pneumonia',
          confidence: 0.87,
          detectedAbnormalities: ['Lung Opacity', 'Pleural Effusion'],
        },
      },
    ],
    location: 'ER Bay 3',
    riskScore: 85,
    status: 'critical',
    treatmentPlan: {
      id: 'TP001',
      patientId: 'P001',
      diagnosis: ['Acute Myocardial Infarction', 'Pneumonia'],
      medications: [
        {
          name: 'Aspirin',
          dosage: '325mg',
          frequency: 'Once',
          duration: 'Immediate',
          route: 'Oral',
          purpose: 'Antiplatelet',
        },
        {
          name: 'Nitroglycerin',
          dosage: '0.4mg',
          frequency: 'Every 5 minutes as needed',
          duration: 'Up to 3 doses',
          route: 'Sublingual',
          purpose: 'Vasodilation',
        },
      ],
      procedures: ['ECG', 'Cardiac Enzyme Panel', 'Chest X-ray'],
      notes: 'Patient requires immediate cardiac evaluation. Consider cardiac catheterization if enzymes are elevated.',
      createdAt: getRecentDate(),
      updatedAt: getRecentDate(),
      recommendedBy: 'both',
      status: 'in-progress',
    },
  },
  {
    id: 'P002',
    name: 'Jane Smith',
    age: 32,
    gender: 'female',
    bloodType: 'A-',
    allergies: ['Sulfa Drugs'],
    chronicConditions: ['Asthma'],
    vitalSigns: [
      {
        name: 'Heart Rate',
        value: 125,
        unit: 'bpm',
        normalRange: { min: 60, max: 100 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Blood Pressure',
        value: 110,
        unit: 'mmHg',
        normalRange: { min: 90, max: 120 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Oxygen Saturation',
        value: 88,
        unit: '%',
        normalRange: { min: 95, max: 100 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Temperature',
        value: 39.2,
        unit: '°C',
        normalRange: { min: 36.5, max: 37.5 },
        timestamp: getRecentDate(),
      },
    ],
    symptoms: [
      {
        id: 'S003',
        name: 'Severe Wheezing',
        severity: 'severe',
        duration: '3 hours',
      },
      {
        id: 'S004',
        name: 'Cough',
        severity: 'moderate',
        duration: '2 days',
      },
    ],
    triageLevel: 'immediate',
    triageScore: 88,
    arrivalTime: getRecentDate(),
    location: 'ER Bay 1',
    riskScore: 78,
    status: 'in-treatment',
    treatmentPlan: {
      id: 'TP002',
      patientId: 'P002',
      diagnosis: ['Acute Asthma Exacerbation', 'Possible Pneumonia'],
      medications: [
        {
          name: 'Albuterol',
          dosage: '2.5mg',
          frequency: 'Every 20 minutes',
          duration: '1 hour',
          route: 'Nebulizer',
          purpose: 'Bronchodilation',
        },
        {
          name: 'Methylprednisolone',
          dosage: '125mg',
          frequency: 'Once',
          duration: 'Immediate',
          route: 'IV',
          purpose: 'Anti-inflammatory',
        },
      ],
      procedures: ['Chest X-ray', 'Arterial Blood Gas', 'Peak Flow Measurement'],
      notes: 'Patient has history of severe asthma. Monitor closely for respiratory failure.',
      createdAt: getRecentDate(),
      updatedAt: getRecentDate(),
      recommendedBy: 'ai',
      status: 'approved',
    },
  },
  {
    id: 'P003',
    name: 'Robert Johnson',
    age: 78,
    gender: 'male',
    bloodType: 'B+',
    allergies: [],
    chronicConditions: ['Atrial Fibrillation', 'Congestive Heart Failure', 'COPD'],
    vitalSigns: [
      {
        name: 'Heart Rate',
        value: 135,
        unit: 'bpm',
        normalRange: { min: 60, max: 100 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Blood Pressure',
        value: 85,
        unit: 'mmHg',
        normalRange: { min: 90, max: 120 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Oxygen Saturation',
        value: 82,
        unit: '%',
        normalRange: { min: 95, max: 100 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Temperature',
        value: 36.8,
        unit: '°C',
        normalRange: { min: 36.5, max: 37.5 },
        timestamp: getRecentDate(),
      },
    ],
    symptoms: [
      {
        id: 'S005',
        name: 'Severe Shortness of Breath',
        severity: 'severe',
        duration: '6 hours',
      },
      {
        id: 'S006',
        name: 'Leg Swelling',
        severity: 'moderate',
        duration: '3 days',
      },
    ],
    triageLevel: 'immediate',
    triageScore: 95,
    arrivalTime: getRecentDate(),
    medicalImages: [
      {
        id: 'IMG002',
        type: 'ct-scan',
        url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        bodyPart: 'chest',
        timestamp: getRecentDate(),
        aiAnalysis: {
          condition: 'Pulmonary Edema',
          confidence: 0.92,
          detectedAbnormalities: ['Bilateral Infiltrates', 'Cardiomegaly', 'Pleural Effusion'],
        },
      },
    ],
    location: 'ER Bay 2',
    riskScore: 92,
    status: 'critical',
    treatmentPlan: {
      id: 'TP003',
      patientId: 'P003',
      diagnosis: ['Acute Decompensated Heart Failure', 'Cardiogenic Shock'],
      medications: [
        {
          name: 'Furosemide',
          dosage: '80mg',
          frequency: 'Once',
          duration: 'Immediate',
          route: 'IV',
          purpose: 'Diuresis',
        },
        {
          name: 'Dobutamine',
          dosage: '5mcg/kg/min',
          frequency: 'Continuous',
          duration: 'Until stabilized',
          route: 'IV',
          purpose: 'Inotropic Support',
        },
      ],
      procedures: ['Echocardiogram', 'Central Line Placement', 'Arterial Line Placement'],
      notes: 'Patient in cardiogenic shock. Consider ICU admission and possible mechanical circulatory support.',
      createdAt: getRecentDate(),
      updatedAt: getRecentDate(),
      recommendedBy: 'both',
      status: 'in-progress',
    },
  },
  {
    id: 'P004',
    name: 'Maria Garcia',
    age: 25,
    gender: 'female',
    bloodType: 'O-',
    allergies: ['Latex'],
    chronicConditions: [],
    vitalSigns: [
      {
        name: 'Heart Rate',
        value: 115,
        unit: 'bpm',
        normalRange: { min: 60, max: 100 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Blood Pressure',
        value: 100,
        unit: 'mmHg',
        normalRange: { min: 90, max: 120 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Oxygen Saturation',
        value: 98,
        unit: '%',
        normalRange: { min: 95, max: 100 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Temperature',
        value: 37.2,
        unit: '°C',
        normalRange: { min: 36.5, max: 37.5 },
        timestamp: getRecentDate(),
      },
    ],
    symptoms: [
      {
        id: 'S007',
        name: 'Severe Abdominal Pain',
        severity: 'severe',
        duration: '8 hours',
      },
      {
        id: 'S008',
        name: 'Nausea',
        severity: 'moderate',
        duration: '6 hours',
      },
    ],
    triageLevel: 'urgent',
    triageScore: 75,
    arrivalTime: getRecentDate(),
    medicalImages: [
      {
        id: 'IMG003',
        type: 'ultrasound',
        url: 'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        bodyPart: 'abdomen',
        timestamp: getRecentDate(),
        aiAnalysis: {
          condition: 'Appendicitis',
          confidence: 0.89,
          detectedAbnormalities: ['Enlarged Appendix', 'Free Fluid'],
        },
      },
    ],
    location: 'ER Bay 5',
    riskScore: 65,
    status: 'critical',
    treatmentPlan: {
      id: 'TP004',
      patientId: 'P004',
      diagnosis: ['Acute Appendicitis'],
      medications: [
        {
          name: 'Cefazolin',
          dosage: '2g',
          frequency: 'Once',
          duration: 'Pre-operative',
          route: 'IV',
          purpose: 'Prophylactic Antibiotic',
        },
        {
          name: 'Morphine',
          dosage: '4mg',
          frequency: 'Every 4 hours as needed',
          duration: 'For pain',
          route: 'IV',
          purpose: 'Pain Management',
        },
      ],
      procedures: ['Appendectomy', 'Abdominal Ultrasound'],
      notes: 'Patient requires surgical consultation for likely appendectomy.',
      createdAt: getRecentDate(),
      updatedAt: getRecentDate(),
      recommendedBy: 'ai',
      status: 'approved',
    },
  },
  {
    id: 'P005',
    name: 'David Wilson',
    age: 52,
    gender: 'male',
    bloodType: 'AB+',
    allergies: [],
    chronicConditions: ['Hypertension'],
    vitalSigns: [
      {
        name: 'Heart Rate',
        value: 95,
        unit: 'bpm',
        normalRange: { min: 60, max: 100 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Blood Pressure',
        value: 170,
        unit: 'mmHg',
        normalRange: { min: 90, max: 120 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Oxygen Saturation',
        value: 96,
        unit: '%',
        normalRange: { min: 95, max: 100 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Temperature',
        value: 37.0,
        unit: '°C',
        normalRange: { min: 36.5, max: 37.5 },
        timestamp: getRecentDate(),
      },
    ],
    symptoms: [
      {
        id: 'S009',
        name: 'Severe Headache',
        severity: 'severe',
        duration: '2 hours',
      },
      {
        id: 'S010',
        name: 'Blurred Vision',
        severity: 'moderate',
        duration: '1 hour',
      },
    ],
    triageLevel: 'urgent',
    triageScore: 80,
    arrivalTime: getRecentDate(),
    medicalImages: [
      {
        id: 'IMG004',
        type: 'ct-scan',
        url: 'https://images.unsplash.com/photo-1559757175-7cb036e0159b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        bodyPart: 'head',
        timestamp: getRecentDate(),
        aiAnalysis: {
          condition: 'No Acute Intracranial Abnormality',
          confidence: 0.95,
          detectedAbnormalities: [],
        },
      },
    ],
    location: 'ER Bay 4',
    riskScore: 70,
    status: 'critical',
    treatmentPlan: {
      id: 'TP005',
      patientId: 'P005',
      diagnosis: ['Hypertensive Urgency', 'Migraine'],
      medications: [
        {
          name: 'Labetalol',
          dosage: '20mg',
          frequency: 'Once',
          duration: 'Immediate',
          route: 'IV',
          purpose: 'Blood Pressure Control',
        },
        {
          name: 'Sumatriptan',
          dosage: '6mg',
          frequency: 'Once',
          duration: 'For migraine',
          route: 'Subcutaneous',
          purpose: 'Migraine Relief',
        },
      ],
      procedures: ['Head CT', 'Neurological Examination'],
      notes: 'Monitor blood pressure closely. Repeat dose of labetalol if BP remains >160/100 after 20 minutes.',
      createdAt: getRecentDate(),
      updatedAt: getRecentDate(),
      recommendedBy: 'doctor',
      status: 'in-progress',
    },
  },
  {
    id: 'P006',
    name: 'Sarah Brown',
    age: 18,
    gender: 'female',
    bloodType: 'A+',
    allergies: ['Ibuprofen'],
    chronicConditions: ['Asthma'],
    vitalSigns: [
      {
        name: 'Heart Rate',
        value: 105,
        unit: 'bpm',
        normalRange: { min: 60, max: 100 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Blood Pressure',
        value: 110,
        unit: 'mmHg',
        normalRange: { min: 90, max: 120 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Oxygen Saturation',
        value: 97,
        unit: '%',
        normalRange: { min: 95, max: 100 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Temperature',
        value: 38.8,
        unit: '°C',
        normalRange: { min: 36.5, max: 37.5 },
        timestamp: getRecentDate(),
      },
    ],
    symptoms: [
      {
        id: 'S011',
        name: 'Sore Throat',
        severity: 'moderate',
        duration: '3 days',
      },
      {
        id: 'S012',
        name: 'Fever',
        severity: 'moderate',
        duration: '2 days',
      },
    ],
    triageLevel: 'delayed',
    triageScore: 45,
    arrivalTime: getRecentDate(),
    location: 'Waiting Room',
    riskScore: 30,
    status: 'in-treatment',
    treatmentPlan: {
      id: 'TP006',
      patientId: 'P006',
      diagnosis: ['Streptococcal Pharyngitis'],
      medications: [
        {
          name: 'Amoxicillin',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '10 days',
          route: 'Oral',
          purpose: 'Antibiotic',
        },
        {
          name: 'Acetaminophen',
          dosage: '650mg',
          frequency: 'Every 6 hours as needed',
          duration: 'For fever and pain',
          route: 'Oral',
          purpose: 'Antipyretic/Analgesic',
        },
      ],
      procedures: ['Rapid Strep Test', 'Throat Culture'],
      notes: 'Patient can be discharged home with antibiotics if rapid strep is positive.',
      createdAt: getRecentDate(),
      updatedAt: getRecentDate(),
      recommendedBy: 'ai',
      status: 'proposed',
    },
  },
  {
    id: 'P007',
    name: 'Michael Lee',
    age: 65,
    gender: 'male',
    bloodType: 'B-',
    allergies: ['Codeine'],
    chronicConditions: ['Type 2 Diabetes', 'Coronary Artery Disease'],
    vitalSigns: [
      {
        name: 'Heart Rate',
        value: 88,
        unit: 'bpm',
        normalRange: { min: 60, max: 100 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Blood Pressure',
        value: 145,
        unit: 'mmHg',
        normalRange: { min: 90, max: 120 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Oxygen Saturation',
        value: 94,
        unit: '%',
        normalRange: { min: 95, max: 100 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Temperature',
        value: 37.1,
        unit: '°C',
        normalRange: { min: 36.5, max: 37.5 },
        timestamp: getRecentDate(),
      },
    ],
    symptoms: [
      {
        id: 'S013',
        name: 'Dizziness',
        severity: 'moderate',
        duration: '1 day',
      },
      {
        id: 'S014',
        name: 'Fatigue',
        severity: 'moderate',
        duration: '3 days',
      },
    ],
    triageLevel: 'urgent',
    triageScore: 65,
    arrivalTime: getRecentDate(),
    location: 'ER Bay 6',
    riskScore: 55,
    status: 'critical',
    treatmentPlan: {
      id: 'TP007',
      patientId: 'P007',
      diagnosis: ['Hypoglycemia', 'Dehydration'],
      medications: [
        {
          name: 'D50W',
          dosage: '50ml',
          frequency: 'Once',
          duration: 'Immediate',
          route: 'IV',
          purpose: 'Glucose Supplementation',
        },
        {
          name: 'Normal Saline',
          dosage: '1L',
          frequency: 'Once',
          duration: 'Over 2 hours',
          route: 'IV',
          purpose: 'Fluid Resuscitation',
        },
      ],
      procedures: ['Blood Glucose Monitoring', 'Electrolyte Panel'],
      notes: 'Patient needs close monitoring of blood glucose. Consider adjusting home diabetes medications.',
      createdAt: getRecentDate(),
      updatedAt: getRecentDate(),
      recommendedBy: 'both',
      status: 'in-progress',
    },
  },
  {
    id: 'P008',
    name: 'Emily Chen',
    age: 29,
    gender: 'female',
    bloodType: 'A+',
    allergies: [],
    chronicConditions: ['Anxiety'],
    vitalSigns: [
      {
        name: 'Heart Rate',
        value: 75,
        unit: 'bpm',
        normalRange: { min: 60, max: 100 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Blood Pressure',
        value: 118,
        unit: 'mmHg',
        normalRange: { min: 90, max: 120 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Oxygen Saturation',
        value: 99,
        unit: '%',
        normalRange: { min: 95, max: 100 },
        timestamp: getRecentDate(),
      },
      {
        name: 'Temperature',
        value: 36.7,
        unit: '°C',
        normalRange: { min: 36.5, max: 37.5 },
        timestamp: getRecentDate(),
      },
    ],
    symptoms: [
      {
        id: 'S015',
        name: 'Wrist Pain',
        severity: 'moderate',
        duration: '6 hours',
      },
      {
        id: 'S016',
        name: 'Swelling',
        severity: 'mild',
        duration: '5 hours',
      },
    ],
    triageLevel: 'delayed',
    triageScore: 35,
    arrivalTime: getRecentDate(),
    medicalImages: [
      {
        id: 'IMG005',
        type: 'x-ray',
        url: 'https://images.unsplash.com/photo-1576671414121-aa2d60f1d5c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        bodyPart: 'wrist',
        timestamp: getRecentDate(),
        aiAnalysis: {
          condition: 'Distal Radius Fracture',
          confidence: 0.91,
          detectedAbnormalities: ['Colles Fracture'],
        },
      },
    ],
    location: 'Waiting Room',
    riskScore: 25,
    status: 'in-treatment',
    treatmentPlan: {
      id: 'TP008',
      patientId: 'P008',
      diagnosis: ['Distal Radius Fracture (Colles Fracture)'],
      medications: [
        {
          name: 'Acetaminophen',
          dosage: '1000mg',
          frequency: 'Every 6 hours as needed',
          duration: 'For pain',
          route: 'Oral',
          purpose: 'Pain Management',
        },
      ],
      procedures: ['Wrist X-ray', 'Closed Reduction', 'Cast Application'],
      notes: 'Patient requires orthopedic consultation for closed reduction and casting.',
      createdAt: getRecentDate(),
      updatedAt: getRecentDate(),
      recommendedBy: 'both',
      status: 'approved',
    },
  },
];

// Mock Resources Data
export const mockResources: Resource[] = [
  {
    id: 'R001',
    type: 'bed',
    name: 'ER Bed 1',
    status: 'in-use',
    location: 'Emergency Department',
    assignedTo: 'P002',
    estimatedReleaseTime: getRecentDate(),
  },
  {
    id: 'R002',
    type: 'bed',
    name: 'ER Bed 2',
    status: 'in-use',
    location: 'Emergency Department',
    assignedTo: 'P003',
    estimatedReleaseTime: getRecentDate(),
  },
  {
    id: 'R003',
    type: 'bed',
    name: 'ER Bed 3',
    status: 'in-use',
    location: 'Emergency Department',
    assignedTo: 'P001',
    estimatedReleaseTime: getRecentDate(),
  },
  {
    id: 'R004',
    type: 'bed',
    name: 'ER Bed 4',
    status: 'in-use',
    location: 'Emergency Department',
    assignedTo: 'P005',
    estimatedReleaseTime: getRecentDate(),
  },
  {
    id: 'R005',
    type: 'bed',
    name: 'ER Bed 5',
    status: 'in-use',
    location: 'Emergency Department',
    assignedTo: 'P004',
    estimatedReleaseTime: getRecentDate(),
  },
  {
    id: 'R006',
    type: 'bed',
    name: 'ER Bed 6',
    status: 'in-use',
    location: 'Emergency Department',
    assignedTo: 'P007',
    estimatedReleaseTime: getRecentDate(),
  },
  {
    id: 'R007',
    type: 'bed',
    name: 'ER Bed 7',
    status: 'available',
    location: 'Emergency Department',
  },
  {
    id: 'R008',
    type: 'bed',
    name: 'ER Bed 8',
    status: 'available',
    location: 'Emergency Department',
  },
  {
    id: 'R009',
    type: 'ventilator',
    name: 'Ventilator 1',
    status: 'in-use',
    location: 'Emergency Department',
    assignedTo: 'P003',
    estimatedReleaseTime: getRecentDate(),
  },
  {
    id: 'R010',
    type: 'ventilator',
    name: 'Ventilator 2',
    status: 'available',
    location: 'Emergency Department',
  },
  {
    id: 'R011',
    type: 'monitor',
    name: 'Cardiac Monitor 1',
    status: 'in-use',
    location: 'Emergency Department',
    assignedTo: 'P001',
    estimatedReleaseTime: getRecentDate(),
  },
  {
    id: 'R012',
    type: 'monitor',
    name: 'Cardiac Monitor 2',
    status: 'in-use',
    location: 'Emergency Department',
    assignedTo: 'P003',
    estimatedReleaseTime: getRecentDate(),
  },
  {
    id: 'R013',
    type: 'monitor',
    name: 'Cardiac Monitor 3',
    status: 'available',
    location: 'Emergency Department',
  },
  {
    id: 'R014',
    type: 'ambulance',
    name: 'Ambulance 1',
    status: 'available',
    location: 'Ambulance Bay',
  },
  {
    id: 'R015',
    type: 'ambulance',
    name: 'Ambulance 2',
    status: 'in-use',
    location: 'Field',
    estimatedReleaseTime: getRecentDate(),
  },
  {
    id: 'R016',
    type: 'staff',
    name: 'Dr. Johnson',
    status: 'in-use',
    location: 'Emergency Department',
    assignedTo: 'P001',
    estimatedReleaseTime: getRecentDate(),
  },
  {
    id: 'R017',
    type: 'staff',
    name: 'Dr. Williams',
    status: 'in-use',
    location: 'Emergency Department',
    assignedTo: 'P003',
    estimatedReleaseTime: getRecentDate(),
  },
  {
    id: 'R018',
    type: 'staff',
    name: 'Nurse Martinez',
    status: 'in-use',
    location: 'Emergency Department',
    assignedTo: 'P002',
    estimatedReleaseTime: getRecentDate(),
  },
  {
    id: 'R019',
    type: 'staff',
    name: 'Nurse Thompson',
    status: 'available',
    location: 'Emergency Department',
  },
  {
    id: 'R020',
    type: 'blood',
    name: 'O- Blood',
    status: 'available',
    location: 'Blood Bank',
  },
];

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: 'U001',
    name: 'Dr. James Johnson',
    role: 'doctor',
    department: 'Emergency Medicine',
    status: 'active',
  },
  {
    id: 'U002',
    name: 'Dr. Sarah Williams',
    role: 'doctor',
    department: 'Emergency Medicine',
    status: 'active',
  },
  {
    id: 'U003',
    name: 'Nurse Ana Martinez',
    role: 'nurse',
    department: 'Emergency Department',
    status: 'active',
  },
  {
    id: 'U004',
    name: 'Nurse John Thompson',
    role: 'nurse',
    department: 'Emergency Department',
    status: 'active',
  },
  {
    id: 'U005',
    name: 'Paramedic Mike Davis',
    role: 'paramedic',
    department: 'Emergency Services',
    status: 'active',
  },
  {
    id: 'U006',
    name: 'Dr. Lisa Chen',
    role: 'doctor',
    department: 'Radiology',
    status: 'off-duty',
  },
  {
    id: 'U007',
    name: 'Admin Susan Miller',
    role: 'admin',
    department: 'Hospital Administration',
    status: 'active',
  },
];

// Mock Notifications Data
export const mockNotifications: Notification[] = [
  {
    id: 'N001',
    type: 'alert',
    message: 'Patient John Doe (P001) has critical vital signs. Immediate attention required.',
    timestamp: getRecentDate(),
    read: false,
    relatedTo: {
      type: 'patient',
      id: 'P001',
    },
  },
  {
    id: 'N002',
    type: 'alert',
    message: 'Patient Robert Johnson (P003) oxygen levels critically low (82%). Respiratory support needed.',
    timestamp: getRecentDate(),
    read: false,
    relatedTo: {
      type: 'patient',
      id: 'P003',
    },
  },
  {
    id: 'N003',
    type: 'warning',
    message: 'Ventilator 1 (R009) battery at 20%. Please connect to power source.',
    timestamp: getRecentDate(),
    read: false,
    relatedTo: {
      type: 'resource',
      id: 'R009',
    },
  },
  {
    id: 'N004',
    type: 'info',
    message: 'New patient Maria Garcia (P004) assigned to ER Bay 5.',
    timestamp: getRecentDate(),
    read: true,
    relatedTo: {
      type: 'patient',
      id: 'P004',
    },
  },
  {
    id: 'N005',
    type: 'warning',
    message: 'Ambulance 2 (R015) ETA 5 minutes with trauma patient.',
    timestamp: getRecentDate(),
    read: false,
    relatedTo: {
      type: 'resource',
      id: 'R015',
    },
  },
];

// Mock Departments Data
export const mockDepartments: Department[] = [
  {
    id: 'D001',
    name: 'Emergency Department',
    capacity: 20,
    currentPatients: 8,
    resources: mockResources.filter(r => r.location === 'Emergency Department'),
  },
  {
    id: 'D002',
    name: 'Intensive Care Unit',
    capacity: 10,
    currentPatients: 7,
    resources: [],
  },
  {
    id: 'D003',
    name: 'Radiology',
    capacity: 15,
    currentPatients: 3,
    resources: [],
  },
  {
    id: 'D004',
    name: 'Surgery',
    capacity: 5,
    currentPatients: 2,
    resources: [],
  },
];

// Mock Hospital Data
export const mockHospital: Hospital = {
  id: 'H001',
  name: 'City General Hospital',
  departments: mockDepartments,
  totalBeds: 50,
  availableBeds: 15,
};

// Helper function to get patients by triage level
export const getPatientsByTriageLevel = (level: string) => {
  return mockPatients.filter(patient => patient.triageLevel === level);
};

// Helper function to get resources by type
export const getResourcesByType = (type: string) => {
  return mockResources.filter(resource => resource.type === type);
};

// Helper function to get resources by status
export const getResourcesByStatus = (status: string) => {
  return mockResources.filter(resource => resource.status === status);
};

// Helper function to get patient by id
export const getPatientById = (id: string) => {
  return mockPatients.find(patient => patient.id === id);
};

// Helper function to get resource by id
export const getResourceById = (id: string) => {
  return mockResources.find(resource => resource.id === id);
};

// Helper function to get user by id
export const getUserById = (id: string) => {
  return mockUsers.find(user => user.id === id);
};

// Helper function to get department by id
export const getDepartmentById = (id: string) => {
  return mockDepartments.find(department => department.id === id);
};