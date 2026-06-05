"use client";

import {  useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarCheck,
  Camera,
  LoaderCircle,
  Pen,
  Save,
  Shield,
  X,
} from "lucide-react";

import { format } from "date-fns";
import {  useAppSelector } from "@/hooks/hooks";

export default function UpdateProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: new Date(),
    gender: "Male",
  });

  // useEffect(() => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     name: {
  //       firstName: user?.name?.firstName || "",
  //       lastName: user?.name?.lastName || "",
  //     },
  //     email: user?.email || "",
  //     phone: user?.phone || "",
  //     gender: user?.gender || "",
  //     dateOfBirth: user?.dateOfBirth || new Date(Date.now()),
  //   }));
  // }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    // try {
    //   const res = await userUpdate(formData, user?._id as string);
    //   if (res?.success) {
    //     toast.success("Profile updated successfully");
    //     dispatch(setUser(res?.payload));
    //     setIsEditing(false);
    //   }
    // } catch (error) {
    //   console.log({ error });
    // }
    setIsLoading(false);
  };

  return (
    <div className="flex-1 space-y-4 px-4 md:px-8 ">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">
            Manage your personal information and settings
          </p>
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Profile Picture & Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Profile picture</CardTitle>
                <CardDescription>Update your profile picture.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      {/* <AvatarImage src={user?.profile} alt="Profile" /> */}
                      <AvatarFallback className="text-lg">
                        {user?.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium">
                      {user?.name} 
                    </h3>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <Badge variant="outline" className="mt-1">
                      Verifyed
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information Form */}
            <Card className="md:col-span-2">
              <CardHeader className="flex items-center justify-between flex-row">
                <div>
                  <CardTitle>Personal information</CardTitle>
                  <CardDescription>
                    Update your personal information.
                  </CardDescription>
                </div>
                <div className="flex gap-3 items-center">
                  {!isEditing && (
                    <Button
                      onClick={() =>
                        isEditing ? handleSave() : setIsEditing(true)
                      }
                      className="flex items-center gap-2"
                    >
                      <Pen className="h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">First Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name:e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      readOnly={true}
                      value={formData.email}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          disabled={!isEditing}
                          className="w-full justify-between font-normal"
                        >
                          {formData?.dateOfBirth
                            ? format(formData?.dateOfBirth, "MMM dd, yyyy")
                            : "Select date"}
                          <CalendarCheck />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={formData?.dateOfBirth}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            setFormData({
                              ...formData,
                              dateOfBirth: date as unknown as Date,
                            });
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        setFormData({ ...formData, gender: value })
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {isEditing && (
                  <div className="flex items-center gap-3">
                    <Button
                      disabled={isLoading}
                      onClick={() =>
                        isEditing ? handleSave() : setIsEditing(true)
                      }
                      className="flex items-center gap-2"
                    >
                      {isLoading ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save
                    </Button>
                    <Button
                      disabled={isLoading}
                      variant={"destructive"}
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Change your password regularly to ensure the security of your
                  account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <ChangePassword /> */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-factor authentication</CardTitle>
                <CardDescription>
                  Enable 2FA for extra security.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">SMS Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      Send code to phone number
                    </p>
                  </div>
                  <Badge variant="outline">Inactive</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      Send code to email
                    </p>
                  </div>
                  <Badge>Active</Badge>
                </div>

                <Button variant="outline" className="w-full">
                  Set up 2FA
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification settings</CardTitle>
              <CardDescription>
                Select what type of notifications you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Order update</h4>
                    <p className="text-sm text-muted-foreground">
                      Notification of order status changes
                    </p>
                  </div>
                  <Badge>Active</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Promotional offer</h4>
                    <p className="text-sm text-muted-foreground">
                      Notifications of special discounts and offers
                    </p>
                  </div>
                  <Badge variant="outline">Inactive</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Newsletter</h4>
                    <p className="text-sm text-muted-foreground">
                      Weekly newsletters and updates
                    </p>
                  </div>
                  <Badge>Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
