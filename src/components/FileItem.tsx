
import { useState } from "react";
import { File, Folder, MoreHorizontal, Download, Trash, Edit } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export type FileItemType = {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: string;
  modifiedAt: Date;
  icon?: React.ReactNode;
};

type FileItemProps = {
  item: FileItemType;
  onOpen?: (item: FileItemType) => void;
  onDelete?: (item: FileItemType) => void;
  onRename?: (item: FileItemType) => void;
};

export function FileItem({ item, onOpen, onDelete, onRename }: FileItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    if (item.icon) return item.icon;
    
    if (item.type === "folder") {
      return <Folder className="h-10 w-10 text-sky-600" />;
    }

    // Determine icon based on file extension
    if (item.name.endsWith(".jpg") || item.name.endsWith(".png") || item.name.endsWith(".gif")) {
      return <File className="h-10 w-10 text-green-600" />;
    } else if (item.name.endsWith(".pdf")) {
      return <File className="h-10 w-10 text-red-600" />;
    } else if (item.name.endsWith(".doc") || item.name.endsWith(".docx")) {
      return <File className="h-10 w-10 text-blue-700" />;
    } else {
      return <File className="h-10 w-10 text-gray-600" />;
    }
  };

  const handleOpen = () => {
    if (onOpen) onOpen(item);
  };

  return (
    <div
      className="file-item border rounded-lg p-3 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleOpen}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 flex justify-center items-center p-4">
          {getIcon()}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            {item.type === "file" && (
              <DropdownMenuItem
                className="cursor-pointer flex gap-2 items-center"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Download className="h-4 w-4" /> Download
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="cursor-pointer flex gap-2 items-center"
              onClick={(e) => {
                e.stopPropagation();
                onRename && onRename(item);
              }}
            >
              <Edit className="h-4 w-4" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer flex gap-2 items-center text-red-600 focus:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete(item);
              }}
            >
              <Trash className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="text-center mt-1">
        <h3 className="font-medium truncate" title={item.name}>
          {item.name}
        </h3>
        <div className="text-xs text-muted-foreground mt-1">
          {item.size && <span className="mr-2">{item.size}</span>}
          <span>{formatDistanceToNow(item.modifiedAt, { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
}
