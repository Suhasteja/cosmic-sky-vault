// Record list component for displaying SkyCloud records with actions
import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Edit2, Trash2, Calendar, User, Folder } from 'lucide-react';
import { SkyCloudRecord } from '../../types';

interface RecordListProps {
  records: SkyCloudRecord[];
  onEdit: (record: SkyCloudRecord) => void;
  onDelete: (recordId: string) => Promise<void>;
  loading?: boolean;
}

// Helper function to get priority badge color
const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Helper function to get status badge color
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Active':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Pending':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Helper function to format date
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const RecordList: React.FC<RecordListProps> = ({
  records,
  onEdit,
  onDelete,
  loading = false
}) => {
  // Handle delete confirmation
  const handleDelete = async (recordId: string) => {
    try {
      await onDelete(recordId);
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <Folder className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">No records yet</h3>
              <p className="text-gray-500 mt-1">
                Get started by adding your first record to SkyCloud.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <Card key={record.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {record.title}
                </CardTitle>
                <CardDescription className="mt-1">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Folder className="h-4 w-4 mr-1" />
                      {record.category}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(record.updatedAt)}
                    </span>
                  </div>
                </CardDescription>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(record)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Record</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{record.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => record.id && handleDelete(record.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4 line-clamp-3">
              {record.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Badge className={getPriorityColor(record.priority)}>
                  {record.priority}
                </Badge>
                <Badge className={getStatusColor(record.status)}>
                  {record.status}
                </Badge>
              </div>
              
              <div className="text-xs text-gray-500">
                Created {formatDate(record.createdAt)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};