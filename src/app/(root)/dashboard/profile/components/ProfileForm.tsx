

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Pen, Save, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useUpdateUserMutation } from "@/redux/service/users";

import { IUser } from "@/redux/service/users/type";
import { TUserInput } from "@/components/validations/user.schema";
import { toast } from "sonner";
import handleErrors, { ErrorResponse } from "@/lib/handle-error";

type Props = {
  findUser: IUser
}
const ProfileForm = ({ findUser }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const initilizeRef = useRef(false)

  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation()

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (findUser && !initilizeRef.current) {

      setFormData((prev) => ({
        ...prev,
        name: findUser?.name,
        phone: findUser?.phone || "",
      }));

      initilizeRef.current = false
    }
  }, [findUser]);


  const handleSave = async () => {

    const payload: TUserInput = {
      name: formData.name,
      phone: findUser.phone,
      role: findUser.role,
      status: findUser.status,
    }

    try {
      await updateUser({ payload, id: findUser._id }).unwrap();
      toast.success("Successfully updated")
      setIsEditing(false)
    } catch (error) {
      console.log({ error });
      handleErrors( error as ErrorResponse)

    }



  };




  return (
    <Card className="md:col-span-2 py-5">
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
                  name: e.target.value,
                })
              }
              disabled={!isEditing}
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}

              readOnly
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              disabled
            />
            <span className="text-xs">{`Can't change this phone`}</span>
          </div>

        </div>
        {isEditing && (
          <div className="flex items-center gap-3">
            <Button
              disabled={updateLoading}
              onClick={() =>
                isEditing ? handleSave() : setIsEditing(true)
              }
              className="flex items-center gap-2"
            >
              {updateLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </Button>
            <Button
              disabled={updateLoading}
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
  )
}

export default ProfileForm