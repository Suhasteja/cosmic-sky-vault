// Record form component for adding and editing SkyCloud records
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2 } from 'lucide-react';
import { SkyCloudRecord, SkyCloudFormData } from '../../types';

interface RecordFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SkyCloudFormData) => Promise<void>;
  record?: SkyCloudRecord;
  isEditing?: boolean;
}

export const RecordForm: React.FC<RecordFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  record,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<SkyCloudFormData>({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    status: 'Active'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset form when dialog opens/closes or when record changes
  useEffect(() => {
    if (isOpen) {
      if (isEditing && record) {
        setFormData({
          title: record.title,
          description: record.description,
          category: record.category,
          priority: record.priority,
          status: record.status
        });
      } else {
        setFormData({
          title: '',
          description: '',
          category: '',
          priority: 'Medium',
          status: 'Active'
        });
      }
      setError('');
    }
  }, [isOpen, isEditing, record]);

  // Form validation function
  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (formData.title.trim().length < 3) {
      setError('Title must be at least 3 characters long');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (formData.description.trim().length < 10) {
      setError('Description must be at least 10 characters long');
      return false;
    }
    if (!formData.category.trim()) {
      setError('Category is required');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setLoading(true);
      await onSubmit({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim()
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the record');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof SkyCloudFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Record' : 'Add New Record'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Make changes to your record here. Click save when you\'re done.'
              : 'Add a new record to your SkyCloud data. Fill in all the required fields.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter record title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Enter detailed description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={loading}
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              type="text"
              placeholder="Enter category (e.g., Work, Personal, Project)"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: 'Low' | 'Medium' | 'High') => handleInputChange('priority', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'Active' | 'Completed' | 'Pending') => handleInputChange('status', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEditing ? 'Update Record' : 'Add Record'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};