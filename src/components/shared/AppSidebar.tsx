import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {

  ChevronsUpDown,

  Settings,
  User,
} from "lucide-react";
import { NavGroup } from "./NavGroup";
import { sidebarData } from "../constants/nav-bar";
import { useAppSelector } from "@/hooks/hooks";
type PropTypes = {
  setOpen: (open: boolean) => void;
  state: "expanded" | "collapsed";
};

const AppSidebar = ({  state }: PropTypes) => {
  const { isMobile } = useSidebar();
  const {user} = useAppSelector(state => state.auth)

  return (
    <Sidebar
      collapsible="icon"
      className="h-screen  p-0 border-r border-border shadow-transparent shadow-sm"
    >
      <SidebarHeader className=" ">
        <SidebarMenu>
          <SidebarMenuItem className="flex">
            {state === "collapsed" ? (
              <Link href={"/"} className="font-bold text-xl">
                {"</>"}
              </Link>
            ) : (
              <Link
                href={"/"}
                className="text-2xl flex  items-center font-bold"
              >
               
                Dashboard <span className="text-primary"></span>
              </Link>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="border-none  py-0">
        {sidebarData?.navGroups?.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    {/* <AvatarImage src={"/seller-logo.jpg"} alt={"user name"} /> */}
                    <AvatarFallback className="rounded-lg uppercase">{user?.name[0] || 'N'}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs">{user?.phone}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      {/* <AvatarImage src={"/seller-logo.jpg"} alt={"Name"} /> */}
                      <AvatarFallback className="rounded-lg">{user?.name[0] || 'N'}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name}</span>
                      <span className="truncate text-xs">
                        {user?.phone}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/users/${user?._id}`}>
                      <User />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/setting">
                    <Settings />
                      Setting
                    </Link>
                  </DropdownMenuItem>
                  
                </DropdownMenuGroup>
             
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;