// Main dashboard page for managing SkyCloud records
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { RecordForm } from '../components/dashboard/RecordForm';
import { RecordList } from '../components/dashboard/RecordList';
import { 
  Cloud, 
  Plus, 
  Search, 
  Filter, 
  LogOut, 
  User,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { SkyCloudRecord, SkyCloudFormData } from '../types';
import { 
  addRecord, 
  getUserRecords, 
  updateRecord, 
  deleteRecord 
} from '../services/firestore';

export const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [records, setRecords] = useState<SkyCloudRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<SkyCloudRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SkyCloudRecord | undefined>();
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Load records on component mount
  useEffect(() => {
    if (currentUser) {
      loadRecords();
    }
  }, [currentUser]);

  // Apply filters when records or filter criteria change
  useEffect(() => {
    applyFilters();
  }, [records, searchTerm, statusFilter, priorityFilter]);

  // Function to load all user records
  const loadRecords = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const userRecords = await getUserRecords(currentUser.uid);
      setRecords(userRecords);
    } catch (error) {
      console.error('Error loading records:', error);
      toast.error('Failed to load records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh records
  const refreshRecords = async () => {
    if (!currentUser) return;

    try {
      setRefreshing(true);
      const userRecords = await getUserRecords(currentUser.uid);
      setRecords(userRecords);
      toast.success('Records refreshed successfully');
    } catch (error) {
      console.error('Error refreshing records:', error);
      toast.error('Failed to refresh records');
    } finally {
      setRefreshing(false);
    }
  };

  // Function to apply search and status filters
  const applyFilters = () => {
    let filtered = records;

    // Apply search filter
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        record.title.toLowerCase().includes(lowercaseSearch) ||
        record.description.toLowerCase().includes(lowercaseSearch) ||
        record.category.toLowerCase().includes(lowercaseSearch)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(record => record.priority === priorityFilter);
    }

    setFilteredRecords(filtered);
  };

  // Function to handle adding new record
  const handleAddRecord = async (data: SkyCloudFormData) => {
    if (!currentUser) return;

    try {
      await addRecord(data, currentUser.uid);
      await loadRecords();
      toast.success('Record added successfully!');
    } catch (error) {
      console.error('Error adding record:', error);
      throw new Error('Failed to add record');
    }
  };

  // Function to handle updating existing record
  const handleUpdateRecord = async (data: SkyCloudFormData) => {
    if (!editingRecord?.id) return;

    try {
      await updateRecord(editingRecord.id, data);
      await loadRecords();
      setEditingRecord(undefined);
      toast.success('Record updated successfully!');
    } catch (error) {
      console.error('Error updating record:', error);
      throw new Error('Failed to update record');
    }
  };

  // Function to handle deleting record
  const handleDeleteRecord = async (recordId: string) => {
    try {
      await deleteRecord(recordId);
      await loadRecords();
      toast.success('Record deleted successfully!');
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete record');
    }
  };

  // Function to open edit form
  const handleEditRecord = (record: SkyCloudRecord) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  // Function to open add form
  const handleAddClick = () => {
    setEditingRecord(undefined);
    setIsFormOpen(true);
  };

  // Function to close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRecord(undefined);
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                SkyCloud Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-1" />
                {currentUser?.displayName || currentUser?.email}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshRecords}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Records</h2>
              <p className="text-gray-600">
                Manage your SkyCloud data records
              </p>
            </div>
            <Button onClick={handleAddClick}>
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Records List */}
        <RecordList
          records={filteredRecords}
          onEdit={handleEditRecord}
          onDelete={handleDeleteRecord}
          loading={loading}
        />

        {/* Record Form Modal */}
        <RecordForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={editingRecord ? handleUpdateRecord : handleAddRecord}
          record={editingRecord}
          isEditing={!!editingRecord}
        />
      </main>
    </div>
  );
};
