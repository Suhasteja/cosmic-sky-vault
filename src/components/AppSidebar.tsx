
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Cloud, 
  Upload, 
  Folder, 
  Star, 
  Clock, 
  Trash, 
  HardDrive,
  Share
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type SidebarProps = {
  onUploadClick: () => void;
};

export function AppSidebar({ onUploadClick }: SidebarProps) {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="flex items-center px-4 py-4 h-16">
        <div className="flex items-center space-x-2">
          <Cloud className="h-6 w-6 text-sky-600" />
          <span className="text-xl font-bold text-sky-600">Sky Cloud</span>
        </div>
        <SidebarTrigger className="ml-auto h-6 w-6" />
      </SidebarHeader>
      <SidebarContent>
        <div className="px-4 py-2">
          <Button 
            className="w-full bg-sky-600 hover:bg-sky-700 flex items-center justify-center gap-2"
            onClick={onUploadClick}
          >
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard" className="flex items-center">
                    <HardDrive className="h-5 w-5 mr-3" />
                    <span>My Drive</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center text-muted-foreground">
                  <Share className="h-5 w-5 mr-3" />
                  <span>Shared with me</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center text-muted-foreground">
                  <Star className="h-5 w-5 mr-3" />
                  <span>Starred</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center text-muted-foreground">
                  <Clock className="h-5 w-5 mr-3" />
                  <span>Recent</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center text-muted-foreground">
                  <Trash className="h-5 w-5 mr-3" />
                  <span>Trash</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Storage</SidebarGroupLabel>
          <SidebarGroupContent className="px-4">
            <Progress value={30} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              3GB of 10GB used
            </p>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-semibold">
            U
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium">User</p>
            <p className="text-xs text-muted-foreground">user@example.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
