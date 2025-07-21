// TypeScript interfaces for SkyCloud application

// Interface for SkyCloud data records
export interface SkyCloudRecord {
  id?: string;
  title: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Completed' | 'Pending';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// Interface for form data (without auto-generated fields)
export interface SkyCloudFormData {
  title: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Completed' | 'Pending';
}