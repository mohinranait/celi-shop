import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "lucide-react";

import LoginForm from "../../app/(root)/components/login-form";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setLoginModalOpen, setLoginModalTab } from "@/redux/features/uiSlice";
import RegisterForm from "@/app/(root)/components/register-form";

const LoginModal = () => {
  const { tabValue } = useAppSelector((state) => state.ui.loginModal);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return (
    <Dialog open={useAppSelector((state) => state.ui.loginModal.isOpen)} onOpenChange={(open) => dispatch(setLoginModalOpen({ isOpen: open }))}>
     
      <DialogContent>
        <DialogDescription>
          <Tabs
            onValueChange={(e) => {
              dispatch(
                setLoginModalTab({ tabValue: e as "login" | "register" }),
              );
            }}
            defaultValue={tabValue}
            value={tabValue}
            className="w-full"
          >
            <TabsList className={"w-full"}>
              <TabsTrigger value="login">Sing In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <div className="w-full max-w-md p-8">
                <LoginForm />

                <p className="mt-6 text-center text-sm text-foreground">
                  Don&apos;t have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 "
                    onClick={() => {
                      dispatch(setLoginModalTab({ tabValue: "register" }));
                    }}
                  >
                    Sign Up
                  </Button>
                </p>
              </div>
            </TabsContent>
            <TabsContent value="register">
              <div className="w-full max-w-md p-8">
                <RegisterForm />
                <p className="mt-6 text-center text-sm text-foreground">
                  Don&apos;t have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 "
                    onClick={() => {
                      dispatch(setLoginModalTab({ tabValue: "login" }));
                    }}
                  >
                    Sign In
                  </Button>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
