"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { userLogout } from "@/redux/features/authSlice";
import { useLogoutMutation } from "@/redux/service/auth";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ProfileDropdown() {
  const router = useRouter()
  const [logoutUser] = useLogoutMutation()
    const {user} = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()
  const handleLogout = () => {
    logoutUser()
    dispatch(userLogout())
    router.push('/user-auth')
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <div className="relative flex items-center cursor-pointer gap-2 h-auto   bg-transparent hover:bg-transparent rounded-full">
          <Avatar className="h-9 w-9">
            {/* <AvatarImage src="/avatar.jpg" alt="@shadcn" /> */}
            <AvatarFallback>
              {user?.name?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="font-semibold text-base">
              {user?.name} 
            </p>
            <p className="text-gray text-sm leading-3 ">{user?.role}</p>
          </div>
          <ChevronDown className="size-5 hidden md:block" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">
              {" "}
              {user?.name} 
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {user?.phone}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/admin/users/${user?._id}`}>
              <User />
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
         
          <DropdownMenuItem asChild>
            <Link href="/admin/setting">
              <Settings />
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
         
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleLogout()}
          className="bg-red-100 text-red-500"
        >
          <LogOut />
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}