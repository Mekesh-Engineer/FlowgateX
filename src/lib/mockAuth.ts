// Mock authentication service types are defined inline

// ============================================================================
// MOCK AUTHENTICATION SERVICE
// ============================================================================
// This service provides mock authentication for frontend-only development
// Replace with real Firebase auth when backend is ready

// Mock user data with hardcoded credentials for testing
interface MockUserData {
  uid: string;
  email: string;
  password: string;
  displayName: string;
  photoURL: string;
  phoneNumber: string;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MOCK_USERS: Record<string, MockUserData> = {
  // Attendee (User role)
  'mekesh.officials@gmail.com': {
    uid: 'mock-attendee-001',
    email: 'mekesh.officials@gmail.com',
    password: 'Mekesh@attendee1236',
    displayName: 'Mekesh - Attendee',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=attendee',
    phoneNumber: '+1234567890',
    role: 'user',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  // Organizer
  'mekeshkumarm.23eee@kongu.edu': {
    uid: 'mock-organizer-001',
    email: 'mekeshkumarm.23eee@kongu.edu',
    password: 'Mekesh@organizer1236',
    displayName: 'Mekesh Kumar - Organizer',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=organizer',
    phoneNumber: '+1234567891',
    role: 'organizer',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  // Admin
  'mekeshkumar1236@gmail.com': {
    uid: 'mock-admin-001',
    email: 'mekeshkumar1236@gmail.com',
    password: 'Mekesh@admin1236',
    displayName: 'Mekesh Kumar - Admin',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    phoneNumber: '+1234567892',
    role: 'admin',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  // Super Admin
  'mekesh.engineer@gmail.com': {
    uid: 'mock-superadmin-001',
    email: 'mekesh.engineer@gmail.com',
    password: 'Mekesh@superadmin1236',
    displayName: 'Mekesh - Super Admin',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin',
    phoneNumber: '+1234567893',
    role: 'superadmin',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  // Legacy demo users (for backward compatibility)
  'demo@flowgatex.com': {
    uid: 'mock-demo-001',
    email: 'demo@flowgatex.com',
    password: 'demo123',
    displayName: 'Demo User',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    phoneNumber: '+1234567894',
    role: 'user',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  'organizer@flowgatex.com': {
    uid: 'mock-demo-organizer-001',
    email: 'organizer@flowgatex.com',
    password: 'demo123',
    displayName: 'Demo Organizer',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demoorganizer',
    phoneNumber: '+1234567895',
    role: 'organizer',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  'admin@flowgatex.com': {
    uid: 'mock-demo-admin-001',
    email: 'admin@flowgatex.com',
    password: 'demo123',
    displayName: 'Demo Admin',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demoadmin',
    phoneNumber: '+1234567896',
    role: 'admin',
    emailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
};

// Current mock user (stored in localStorage)
const STORAGE_KEY = 'flowgatex_mock_user';

class MockAuthService {
  private currentUser: any | null = null;
  private listeners: ((user: any | null) => void)[] = [];

  constructor() {
    // Load user from localStorage on init
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
  }

  // Sign in with email/password (mock)
  async signIn(email: string, password: string): Promise<any> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = MOCK_USERS[email as keyof typeof MOCK_USERS];
    if (!user) {
      throw new Error('Invalid email or password. Please check your credentials and try again.');
    }

    // Validate password
    if (user.password !== password) {
      throw new Error('Invalid email or password. Please check your credentials and try again.');
    }

    // Don't include password in the stored user object
    const { password: _, ...userWithoutPassword } = user;
    this.currentUser = userWithoutPassword;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
    this.notifyListeners();
    return userWithoutPassword;
  }

  // Sign up (mock)
  async signUp(email: string, _password: string, displayName: string): Promise<any> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newUser: any = {
      uid: `mock-user-${Date.now()}`,
      email,
      displayName,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      phoneNumber: null,
      role: 'user',
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.currentUser = newUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    this.notifyListeners();
    return newUser;
  }

  // Sign in with Google (mock)
  async signInWithGoogle(): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return this.signIn('demo@flowgatex.com', 'password');
  }

  // Sign in with Facebook (mock)
  async signInWithFacebook(): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return this.signIn('demo@flowgatex.com', 'password');
  }

  // Sign out
  async signOut(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEY);
    this.notifyListeners();
  }

  // Get current user
  getCurrentUser(): any | null {
    return this.currentUser;
  }

  // Password reset (mock)
  async resetPassword(email: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`📧 Mock password reset email sent to: ${email}`);
  }

  // Update profile (mock)
  async updateProfile(updates: Partial<any>): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    if (!this.currentUser) {
      throw new Error('No user signed in');
    }

    this.currentUser = {
      ...this.currentUser,
      ...updates,
      updatedAt: new Date(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser));
    this.notifyListeners();
    return this.currentUser;
  }

  // Auth state listener
  onAuthStateChanged(callback: (user: any | null) => void): () => void {
    this.listeners.push(callback);
    // Immediately call with current user
    callback(this.currentUser);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.currentUser));
  }
}

// Export singleton instance
export const mockAuthService = new MockAuthService();

// Helper to check if we're in mock mode
export const isMockMode = () => import.meta.env.VITE_MOCK_MODE === 'true';
