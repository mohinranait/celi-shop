'use client';

import { useEffect } from 'react';
import {  Phone, Calendar, Save } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';


import { useGetUserByIdQuery, useUpdateUserMutation } from '@/redux/service/users';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TUserInput, userSchema } from '@/components/validations/user.schema';
import { toast } from 'sonner';

type Props = {
  userId: string;
};

function UpdateComponent({ userId }: Props) {
  const { data, isLoading } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });

  const user = data?.data;

  const [updateUser, {isLoading:updateLoading}] = useUpdateUserMutation()

  /* -------------------------------------------------------------------------- */
  /*                                    FORM                                    */
  /* -------------------------------------------------------------------------- */

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TUserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      phone: '',
      role: 'User',
      status: 'Active',
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                               SET DEFAULT DATA                             */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!user) return;

    reset({
      name: user?.name || '',
      phone: user?.phone || '',
      role: user?.role || 'User',
      status: user?.status || 'Active',
    });
  }, [user, reset]);

  /* -------------------------------------------------------------------------- */
  /*                                  SUBMIT                                    */
  /* -------------------------------------------------------------------------- */

  const onSubmit = async (values: TUserInput) => {
    // console.log(values);

    try {
      await updateUser({payload: values, id: userId}).unwrap();
      toast.success("Successfully updated")
    } catch (error) {
      console.log({error});
      toast.error("Faild update")
      
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6">

      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Profile Settings
        </h1>

        <p className="mt-1 text-muted-foreground">
          Manage your account information
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

        {/* ------------------------------------------------------------------ */}
        {/*                              LEFT SIDE                             */}
        {/* ------------------------------------------------------------------ */}

        <div className="lg:col-span-4">
          <Card className="sticky top-6 p-6">

            <div className="flex flex-col items-center text-center">

              {/* AVATAR */}

              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                  {/* <AvatarImage src={user?.image} /> */}

                  <AvatarFallback className="text-4xl font-bold">
                    {user?.name?.slice(0, 2)?.toUpperCase() || 'ME'}
                  </AvatarFallback>
                </Avatar>
{/* 
                <button
                  type="button"
                  className="absolute bottom-2 right-2 rounded-full bg-primary p-2 text-white shadow-lg transition hover:bg-primary/90"
                >
                  <Camera size={18} />
                </button> */}
              </div>

              {/* USER INFO */}

              <h2 className="mt-5 text-2xl font-semibold">
                {user?.name}
              </h2>

              <p className="text-muted-foreground">
                {user?.role}
              </p>

              {/* INFO */}

              <div className="mt-8 w-full space-y-4">

                <div className="flex items-center gap-3 text-sm">
                  <Phone
                    className="text-muted-foreground"
                    size={18}
                  />

                  <span>{user?.phone}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Calendar
                    className="text-muted-foreground"
                    size={18}
                  />

                  <span>Joined: 12 May 2025</span>
                </div>
              </div>

              <Separator className="my-6" />

              {/* STATUS */}

              <div className="w-full text-left">
                <h4 className="mb-2 font-medium">
                  Account Status
                </h4>

                <div className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  {user?.status}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/*                             RIGHT SIDE                             */}
        {/* ------------------------------------------------------------------ */}

        <div className="lg:col-span-8">

          <Card className="p-8">

            <div className="mb-6">
              <h3 className="text-xl font-semibold">
                Update Profile Information
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Update your profile details and role information
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >

              {/* NAME */}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                <div>
                  <Label>
                    Full Name
                  </Label>

                  <Input
                    placeholder="Enter full name"
                    className="mt-1.5"
                    {...register('name')}
                  />

                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* ROLE + STATUS */}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* ROLE */}

                <div>
                  <Label>
                    User Role
                  </Label>

                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="mt-1.5 w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Admin">
                              Admin
                            </SelectItem>

                            <SelectItem value="User">
                              User
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.role && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                {/* STATUS */}

                <div>
                  <Label>
                    User Status
                  </Label>

                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="mt-1.5 w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Active">
                              Active
                            </SelectItem>

                            <SelectItem value="Pending">
                              Pending
                            </SelectItem>

                            <SelectItem value="Banned">
                              Banned
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.status && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>

              {/* PHONE */}

              <div>
                <Label>
                  Phone Number
                </Label>

                <Input
                  readOnly
                  disabled
                  className="mt-1.5"
                  {...register('phone')}
                />

                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* BUTTON */}

              <div className="flex justify-end pt-6">

                <Button
                  type="submit"
                  size="lg"
                  disabled={updateLoading || isLoading}
                  className="min-w-45"
                >
                  {updateLoading ? (
                    'Saving Changes...'
                  ) : (
                    <>
                      <Save
                        className="mr-2"
                        size={18}
                      />

                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default UpdateComponent;