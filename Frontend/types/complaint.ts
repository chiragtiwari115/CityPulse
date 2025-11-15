export type ComplaintStatus = 'SUBMITTED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export type ComplaintSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ComplaintCategory =
  | 'POTHOLE'
  | 'WATER'
  | 'GARBAGE'
  | 'STREETLIGHT'
  | 'DRAINAGE'
  | 'PARK'
  | 'NOISE'
  | 'OTHER';

export interface ComplaintReporter {
  id: number;
  username: string;
  email: string;
  role: string;
  admin: boolean;
  authProvider: 'local' | 'auth0';
}

export interface ComplaintResponse {
  id: number;
  category: ComplaintCategory;
  severity: ComplaintSeverity;
  status: ComplaintStatus;
  title: string;
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  statusNotes: string | null;
  createdAt: string;
  updatedAt: string;
  reporter: ComplaintReporter | null;
}

