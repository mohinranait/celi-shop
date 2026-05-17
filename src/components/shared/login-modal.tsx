import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import LoginForm from "../../app/(root)/components/login-form";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setLoginModalOpen, setLoginModalTab } from "@/redux/features/uiSlice";
import RegisterForm from "@/app/(root)/components/register-form";

const LoginModal = () => {
  const { tabValue } = useAppSelector((state) => state.ui.loginModal);

  const dispatch = useAppDispatch();

  return (
    <Dialog open={useAppSelector((state) => state.ui.loginModal.isOpen)} onOpenChange={(open) => dispatch(setLoginModalOpen({ isOpen: open }))}>

      <DialogContent className="p-10">
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


          <TabsList className="grid w-full grid-cols-2 mb-8 h-auto! bg-muted/50">
            <TabsTrigger
              value="login"
              className="text-base font-semibold data-[state=active]:shadow data-[state=active]:bg-primary data-[state=active]:text-white  bg-muted h-10 "
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="text-base font-semibold data-[state=active]:shadow data-[state=active]:bg-primary data-[state=active]:text-white  bg-muted h-10 "
            >
              Sign Up
            </TabsTrigger>
          </TabsList>


          <TabsContent value="login">
            <div className="w-full max-w-md ">
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
            <div className="w-full max-w-md ">
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
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
