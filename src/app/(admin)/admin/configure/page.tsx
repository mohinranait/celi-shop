"use client";

import { Mail, Cloud } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Main } from "@/components/ui/main";
import { Navbar } from "@/components/shared/NavBar";
import { ConfigCard } from "./components/ConfigCard";
import { useCreateConfigMutation, useGetConfigsQuery } from "@/redux/service/config";

interface AppConfig {
  email: {
    user: string;
    password: string;
    status: boolean;
  };
  cloudinary: {
    name: string;
    key: string;
    secret: string;
    status: boolean;
  };
}

function AdminPanel() {
  // const [config, setConfig] = useState<AppConfig | null>(null);

  const {data,isLoading:dataLoading} = useGetConfigsQuery();
  const [createConfig, {isLoading} ] = useCreateConfigMutation()
  const config = data?.data;
  

  // Fetch config on mount
  // useEffect(() => {
  //   const fetchConfig = async () => {
  //     try {
  //       const response = await fetch("/api/admin/config");
  //       const result = await response.json();
  //       console.log(result);
        
        
  //       if (result.success) {
  //         setConfig(result.data);
        
  //       }
  //     } catch (error) {
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchConfig();
  // }, []);

  const updateConfigAPI = async (
    section: string,
    data?: Record<string, string>,
    status?: boolean,
  ) => {
    try {
      // setIsSaving(true);
      await createConfig({ section, data, status }).unwrap()
      // const response = await fetch("/api/admin/config", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ section, data, status }),
      // });

      // const result = await response.json();
      // if (result.success) {
      //   setConfig(result.data);
      // }
    } catch (error) {
      console.error("Failed to update config:", error);
    } finally {
      // setIsSaving(false);
    }
  };

  const handleEmailStatusChange = (newStatus: boolean) => {
    updateConfigAPI("email", undefined, newStatus);
  };

  const handleCloudinaryStatusChange = (newStatus: boolean) => {
    updateConfigAPI("cloudinary", undefined, newStatus);
  };

  const handleEmailSave = (data: Record<string, string>) => {
    updateConfigAPI("email", data);
  };

  const handleCloudinarySave = (data: Record<string, string>) => {
    updateConfigAPI("cloudinary", data);
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
          <p className="text-muted-foreground">Loading configuration...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">Failed to load configuration</p>
      </div>
    );
  }

  return (
    <>
      <Navbar fixed />
      <Main>
        <div className="space-y-8 max-w-7xl mx-auto">
         
          {/* HEADER */}
               <div className="flex justify-between items-center">
                 <div>
                   <h1 className="text-3xl font-bold">All Apps</h1>
                   <p className="text-muted-foreground text-sm">
                     Manage your apps easily
                   </p>
                 </div>
         
                
               </div>

          {/* Configuration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email Configuration */}
            <ConfigCard
              title="Email Configuration"
              icon={<Mail className="w-8 h-8" />}
              fields={[
                {
                  name: "user",
                  label: "Email Address",
                  type: "text",
                  value: config.email.user,
                },
                {
                  name: "password",
                  label: "Password",
                  type: "password",
                  value: config.email.password,
                },
              ]}
              status={config.email.status}
              onStatusChange={handleEmailStatusChange}
              onSave={handleEmailSave}
              isSaving={isLoading}
            />

            {/* Cloudinary Configuration */}
            <ConfigCard
              title="Cloudinary Configuration"
              icon={<Cloud className="w-8 h-8" />}
              fields={[
                {
                  name: "name",
                  label: "Cloud Name",
                  type: "text",
                  value: config.cloudinary.name,
                },
                {
                  name: "key",
                  label: "API Key",
                  type: "password",
                  value: config.cloudinary.key,

                },
                {
                  name: "secret",
                  label: "API Secret",
                  type: "password",
                  value: config.cloudinary.secret,
                },
              ]}
              status={config.cloudinary.status}
              onStatusChange={handleCloudinaryStatusChange}
              onSave={handleCloudinarySave}
              isSaving={isLoading}
            />
          </div>
        </div>
      </Main>
    </>
  );
}

export default AdminPanel;