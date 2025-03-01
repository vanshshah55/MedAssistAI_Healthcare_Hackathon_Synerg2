import { create } from 'zustand';
import { 
  mockPatients, 
  mockResources, 
  mockUsers, 
  mockNotifications, 
  mockDepartments, 
  mockHospital 
} from '../data/mockData';
import { 
  Patient, 
  Resource, 
  User, 
  Notification, 
  Department, 
  Hospital, 
  TreatmentPlan,
  TriageLevel,
  ResourceStatus
} from '../pages/types';

interface AppState {
  // Data
  patients: Patient[];
  resources: Resource[];
  users: User[];
  notifications: Notification[];
  departments: Department[];
  hospital: Hospital;
  
  // UI State
  selectedPatientId: string | null;
  selectedResourceId: string | null;
  selectedDepartmentId: string | null;
  activeView: 'dashboard' | 'patients' | 'resources' | 'analytics' | 'settings';
  sidebarOpen: boolean;
  notificationsOpen: boolean;
  
  // Actions
  setPatients: (patients: Patient[]) => void;
  setResources: (resources: Resource[]) => void;
  setUsers: (users: User[]) => void;
  setNotifications: (notifications: Notification[]) => void;
  setDepartments: (departments: Department[]) => void;
  setHospital: (hospital: Hospital) => void;
  
  setSelectedPatientId: (id: string | null) => void;
  setSelectedResourceId: (id: string | null) => void;
  setSelectedDepartmentId: (id: string | null) => void;
  setActiveView: (view: 'dashboard' | 'patients' | 'resources' | 'analytics' | 'settings') => void;
  setSidebarOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  
  // Patient Actions
  updatePatient: (patientId: string, updates: Partial<Patient>) => void;
  updatePatientTriageLevel: (patientId: string, triageLevel: string) => void;
  updatePatientTreatmentPlan: (patientId: string, treatmentPlan: TreatmentPlan) => void;
  
  // Resource Actions
  updateResourceStatus: (resourceId: string, status: string, assignedTo?: string) => void;
  
  // Notification Actions
  markNotificationAsRead: (notificationId: string) => void;
  addNotification: (notification: Notification) => void;
  
  // Utility Functions
  getPatientById: (id: string) => Patient | undefined;
  getResourceById: (id: string) => Resource | undefined;
  getUserById: (id: string) => User | undefined;
  getDepartmentById: (id: string) => Department | undefined;
  getPatientsByTriageLevel: (level: string) => Patient[];
  getResourcesByType: (type: string) => Resource[];
  getResourcesByStatus: (status: string) => Resource[];
  getUnreadNotificationsCount: () => number;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial Data
  patients: mockPatients,
  resources: mockResources,
  users: mockUsers,
  notifications: mockNotifications,
  departments: mockDepartments,
  hospital: mockHospital,
  
  // Initial UI State
  selectedPatientId: null,
  selectedResourceId: null,
  selectedDepartmentId: null,
  activeView: 'dashboard',
  sidebarOpen: true,
  notificationsOpen: false,
  
  // Actions
  setPatients: (patients) => set({ patients }),
  setResources: (resources) => set({ resources }),
  setUsers: (users) => set({ users }),
  setNotifications: (notifications) => set({ notifications }),
  setDepartments: (departments) => set({ departments }),
  setHospital: (hospital) => set({ hospital }),
  
  setSelectedPatientId: (id) => set({ selectedPatientId: id }),
  setSelectedResourceId: (id) => set({ selectedResourceId: id }),
  setSelectedDepartmentId: (id) => set({ selectedDepartmentId: id }),
  setActiveView: (view) => set({ activeView: view }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),
  
  // Patient Actions
  updatePatient: (patientId, updates) => {
    set((state) => ({
      patients: state.patients.map((patient) => 
        patient.id === patientId ? { ...patient, ...updates } : patient
      ),
    }));
  },
  
  updatePatientTriageLevel: (patientId, triageLevel) => {
    set((state) => ({
      patients: state.patients.map((patient) => 
        patient.id === patientId ? { ...patient, triageLevel: triageLevel as TriageLevel } : patient
      ),
    }));
  },
  
  updatePatientTreatmentPlan: (patientId, treatmentPlan) => {
    set((state) => ({
      patients: state.patients.map((patient) => 
        patient.id === patientId ? { ...patient, treatmentPlan } : patient
      ),
    }));
  },
  
  // Resource Actions
  updateResourceStatus: (resourceId, status, assignedTo) => {
    set((state) => ({
      resources: state.resources.map((resource) => 
        resource.id === resourceId 
          ? { 
              ...resource, 
              status: status as ResourceStatus, 
              ...(assignedTo !== undefined ? { assignedTo } : {}),
              ...(status === 'available' ? { assignedTo: undefined, estimatedReleaseTime: undefined } : {})
            } 
          : resource
      ),
    }));
  },
  
  // Notification Actions
  markNotificationAsRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map((notification) => 
        notification.id === notificationId ? { ...notification, read: true } : notification
      ),
    }));
  },
  
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }));
  },
  
  // Utility Functions
  getPatientById: (id) => {
    return get().patients.find((patient) => patient.id === id);
  },
  
  getResourceById: (id) => {
    return get().resources.find((resource) => resource.id === id);
  },
  
  getUserById: (id) => {
    return get().users.find((user) => user.id === id);
  },
  
  getDepartmentById: (id) => {
    return get().departments.find((department) => department.id === id);
  },
  
  getPatientsByTriageLevel: (level) => {
    return get().patients.filter((patient) => patient.triageLevel === level);
  },
  
  getResourcesByType: (type) => {
    return get().resources.filter((resource) => resource.type === type);
  },
  
  getResourcesByStatus: (status) => {
    return get().resources.filter((resource) => resource.status === status);
  },
  
  getUnreadNotificationsCount: () => {
    return get().notifications.filter((notification) => !notification.read).length;
  },
}));