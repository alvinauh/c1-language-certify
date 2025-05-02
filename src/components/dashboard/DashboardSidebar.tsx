
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarInput,
} from '@/components/ui/sidebar';
import { Book, Calculator, AtomIcon, Landmark, LayoutDashboard } from 'lucide-react';

const DashboardSidebar = () => {
  const location = useLocation();

  // Check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const subjects = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'English', path: '/dashboard/english', icon: Book },
    { name: 'Mathematics', path: '/dashboard/math', icon: Calculator },
    { name: 'Science', path: '/dashboard/science', icon: AtomIcon },
    { name: 'History', path: '/dashboard/history', icon: Landmark },
    { name: 'Bahasa Malaysia', path: '/dashboard/bahasa', icon: Book },
    { name: 'Study Notes', path: '/dashboard/notes', icon: Book },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Book className="h-4 w-4" />
          </div>
          <div className="font-semibold">CEFR LMS</div>
        </div>
        <div className="px-2">
          <SidebarInput placeholder="Search..." />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Subjects</SidebarGroupLabel>
          <SidebarMenu>
            {subjects.map((subject) => (
              <SidebarMenuItem key={subject.path}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(subject.path)}
                  tooltip={subject.name}
                >
                  <Link to={subject.path}>
                    <subject.icon className="h-4 w-4" />
                    <span>{subject.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2 text-xs text-muted-foreground">
          © 2025 CEFR Learning Management System
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
