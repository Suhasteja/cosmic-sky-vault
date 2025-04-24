
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { FileItem, FileItemType } from "@/components/FileItem";
import { FileBreadcrumb, BreadcrumbItem } from "@/components/FileBreadcrumb";
import { CreateFolderDialog } from "@/components/CreateFolderDialog";
import { RenameDialog } from "@/components/RenameDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { FileUploadDialog } from "@/components/FileUploadDialog";
import { Folder, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

// Sample data to simulate a file system
const generateId = () => Math.random().toString(36).substring(2, 9);

const initialFiles: Record<string, FileItemType[]> = {
  root: [
    {
      id: "folder1",
      name: "Documents",
      type: "folder",
      modifiedAt: new Date(2023, 5, 15),
    },
    {
      id: "folder2",
      name: "Images",
      type: "folder",
      modifiedAt: new Date(2023, 6, 2),
    },
    {
      id: "file1",
      name: "Project Report.pdf",
      type: "file",
      size: "2.4 MB",
      modifiedAt: new Date(2023, 7, 10),
    },
    {
      id: "file2",
      name: "Presentation.pptx",
      type: "file",
      size: "4.2 MB",
      modifiedAt: new Date(2023, 7, 12),
    },
  ],
  folder1: [
    {
      id: "folder3",
      name: "Work",
      type: "folder",
      modifiedAt: new Date(2023, 6, 12),
    },
    {
      id: "file3",
      name: "Resume.doc",
      type: "file",
      size: "1.2 MB",
      modifiedAt: new Date(2023, 7, 5),
    },
  ],
  folder2: [
    {
      id: "file4",
      name: "Vacation.jpg",
      type: "file",
      size: "3.1 MB",
      modifiedAt: new Date(2023, 6, 20),
    },
    {
      id: "file5",
      name: "Profile.png",
      type: "file",
      size: "2.8 MB",
      modifiedAt: new Date(2023, 7, 8),
    },
  ],
  folder3: [],
};

const folderPaths: Record<string, { name: string; parentId: string }> = {
  folder1: { name: "Documents", parentId: "root" },
  folder2: { name: "Images", parentId: "root" },
  folder3: { name: "Work", parentId: "folder1" },
};

const Dashboard = () => {
  const { folderId } = useParams();
  const { toast } = useToast();
  const currentFolder = folderId || "root";
  
  const [files, setFiles] = useState<Record<string, FileItemType[]>>(initialFiles);
  const [currentItems, setCurrentItems] = useState<FileItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isUploadFileOpen, setIsUploadFileOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FileItemType | null>(null);

  // Update current items when folder changes or search query changes
  useEffect(() => {
    const items = files[currentFolder] || [];
    if (searchQuery) {
      const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setCurrentItems(filteredItems);
    } else {
      setCurrentItems(items);
    }
  }, [currentFolder, files, searchQuery]);

  // Update breadcrumbs when folder changes
  useEffect(() => {
    if (currentFolder === "root") {
      setBreadcrumbs([]);
      return;
    }

    const getBreadcrumbs = (folderId: string): BreadcrumbItem[] => {
      const folder = folderPaths[folderId];
      if (!folder) return [];

      const result: BreadcrumbItem[] = [{
        id: folderId,
        name: folder.name,
        path: folderId
      }];

      if (folder.parentId !== "root") {
        return [...getBreadcrumbs(folder.parentId), ...result];
      }

      return result;
    };

    const newBreadcrumbs = getBreadcrumbs(currentFolder);
    setBreadcrumbs(newBreadcrumbs);
  }, [currentFolder]);

  // Handler for opening files and folders
  const handleOpen = (item: FileItemType) => {
    if (item.type === "folder") {
      // Navigate to folder - handled by React Router
      window.location.href = `/dashboard/${item.id}`;
    } else {
      // For files, we'd show a preview or download in a real app
      toast({
        title: "File Preview",
        description: `Opening ${item.name}`,
      });
    }
  };

  // Handler for creating new folders
  const handleCreateFolder = (name: string) => {
    const newFolder: FileItemType = {
      id: generateId(),
      name,
      type: "folder",
      modifiedAt: new Date(),
    };
    
    // Update files state
    setFiles(prev => ({
      ...prev,
      [currentFolder]: [...(prev[currentFolder] || []), newFolder],
      [newFolder.id]: [], // Create empty array for the new folder's contents
    }));
    
    // Update folder paths
    folderPaths[newFolder.id] = { name, parentId: currentFolder };
    
    toast({
      title: "Folder Created",
      description: `Folder "${name}" has been created.`,
    });
  };

  // Handler for file uploads
  const handleFileUpload = (file: File) => {
    const newFile: FileItemType = {
      id: generateId(),
      name: file.name,
      type: "file",
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      modifiedAt: new Date(),
    };
    
    setFiles(prev => ({
      ...prev,
      [currentFolder]: [...(prev[currentFolder] || []), newFile],
    }));
  };

  // Handler for deleting items
  const handleDelete = (item: FileItemType) => {
    if (item.type === "folder") {
      // Remove folder from files state
      const newFiles = { ...files };
      delete newFiles[item.id];
      
      // Remove folder from parent folder
      newFiles[currentFolder] = newFiles[currentFolder].filter(f => f.id !== item.id);
      
      // Remove folder from folderPaths
      delete folderPaths[item.id];
      
      setFiles(newFiles);
    } else {
      // Remove file from current folder
      setFiles(prev => ({
        ...prev,
        [currentFolder]: prev[currentFolder].filter(f => f.id !== item.id),
      }));
    }
    
    toast({
      title: "Item Deleted",
      description: `"${item.name}" has been deleted.`,
    });
  };

  // Handler for renaming items
  const handleRename = (item: FileItemType, newName: string) => {
    const updatedItem = { ...item, name: newName };
    
    // Update item in files
    setFiles(prev => ({
      ...prev,
      [currentFolder]: prev[currentFolder].map(f => 
        f.id === item.id ? updatedItem : f
      ),
    }));
    
    // If it's a folder, update folderPaths
    if (item.type === "folder") {
      folderPaths[item.id] = { 
        ...folderPaths[item.id],
        name: newName
      };
    }
    
    toast({
      title: "Item Renamed",
      description: `Item has been renamed to "${newName}".`,
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar onUploadClick={() => setIsUploadFileOpen(true)} />
        
        <div className="flex-1 flex flex-col">
          <div className="border-b">
            <div className="px-4 py-2 flex items-center justify-between">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search files and folders..."
                  className="w-full pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center ml-4 space-x-2">
                <Button 
                  variant="outline" 
                  className="flex items-center"
                  onClick={() => setIsCreateFolderOpen(true)}
                >
                  <Folder className="h-4 w-4 mr-2" />
                  New Folder
                </Button>
                <Button 
                  className="bg-sky-600 hover:bg-sky-700"
                  onClick={() => setIsUploadFileOpen(true)}
                >
                  Upload
                </Button>
              </div>
            </div>
            <FileBreadcrumb items={breadcrumbs} />
          </div>

          <main className="flex-1 p-6">
            {currentItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {currentItems.map((item) => (
                  <FileItem
                    key={item.id}
                    item={item}
                    onOpen={handleOpen}
                    onDelete={(item) => {
                      setSelectedItem(item);
                      setIsDeleteDialogOpen(true);
                    }}
                    onRename={(item) => {
                      setSelectedItem(item);
                      setIsRenameDialogOpen(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="bg-sky-50 p-6 rounded-full">
                  <Folder className="h-12 w-12 text-sky-600" />
                </div>
                <h3 className="text-xl font-semibold mt-4">This folder is empty</h3>
                <p className="text-gray-500 mt-2 max-w-md">
                  {searchQuery ? "No items match your search" : "Upload files or create folders to get started"}
                </p>
                <div className="flex mt-6">
                  <Button 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => setIsCreateFolderOpen(true)}
                  >
                    <Folder className="h-4 w-4 mr-2" />
                    New Folder
                  </Button>
                  <Button 
                    className="bg-sky-600 hover:bg-sky-700"
                    onClick={() => setIsUploadFileOpen(true)}
                  >
                    Upload File
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <CreateFolderDialog
        open={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        onCreateFolder={handleCreateFolder}
      />
      
      <FileUploadDialog
        open={isUploadFileOpen}
        onClose={() => setIsUploadFileOpen(false)}
        onFileUpload={handleFileUpload}
      />
      
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        item={selectedItem}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={handleDelete}
      />
      
      <RenameDialog
        open={isRenameDialogOpen}
        item={selectedItem}
        onClose={() => {
          setIsRenameDialogOpen(false);
          setSelectedItem(null);
        }}
        onRename={handleRename}
      />
    </SidebarProvider>
  );
};

export default Dashboard;
