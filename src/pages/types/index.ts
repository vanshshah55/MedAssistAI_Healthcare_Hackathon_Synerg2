// Patient Types
export type TriageLevel = 'critical' | 'urgent' | 'non-urgent';
export type PatientStatus = 'waiting' | 'in-treatment' | 'discharged' | 'transferred';

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  triageLevel: TriageLevel;
  status: PatientStatus;
  chiefComplaint: string;
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    respiratoryRate: number;
    temperature: number;
    oxygenSaturation: number;
    painLevel: number;
  };
  medicalHistory: string[];
  allergies: string[];
  assignedTo?: string; // Staff ID
  location: string;
  arrivalTime: string;
  lastUpdated: string;
  estimatedWaitTime?: number; // in minutes
  notes?: string[];
};

// Resource Types
export type ResourceStatus = 'available' | 'in-use' | 'maintenance' | 'reserved';
export type ResourceType = 'bed' | 'ventilator' | 'monitor' | 'ambulance' | 'staff' | 'blood' | 'medication';

export type Resource = {
  id: string;
  name: string;
  type: ResourceType;
  status: ResourceStatus;
  location: string;
  assignedTo?: string; // Patient ID
  estimatedReleaseTime?: string;
  lastMaintenance?: string;
  notes?: string[];
};

// Staff Types
export type StaffRole = 'doctor' | 'nurse' | 'technician' | 'admin';
export type StaffStatus = 'on-duty' | 'off-duty' | 'on-break';

export type Staff = {
  id: string;
  name: string;
  role: StaffRole;
  status: StaffStatus;
  department: string;
  specialization?: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  schedule: {
    start: string;
    end: string;
  };
  assignedPatients: string[]; // Patient IDs
};

// Department Types
export type Department = {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  resources: string[]; // Resource IDs
  staff: string[]; // Staff IDs
};

// Notification Types
export type Notification = {
  id: string;
  type: 'alert' | 'warning' | 'info';
  message: string;
  timestamp: string;
  read: boolean;
  relatedTo?: {
    type: 'patient' | 'resource' | 'staff';
    id: string;
  };
};

// User Types
export type User = {
  id: string;
  name: string;
  role: StaffRole;
  department: string;
  avatar?: string;
};

// Add these missing type definitions
export interface Hospital {
  id: string;
  name: string;
  address: string;
  capacity: number;
  departments: string[];
}

export interface TreatmentPlan {
  id: string;
  name: string;
  description: string;
  medications: string[];
  procedures: string[];
  followUp: string;
}