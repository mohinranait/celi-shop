

import AdminMainLayout from "@/components/layouts/MainAdminLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BASE_URL } from "@/lib/envSecret";
import { getAppSetting } from "@/lib/get-app-setting";
import { Metadata } from "next";
import React, { Suspense } from "react";
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAppSetting();

  return {
    title: settings?.metaTitle || settings?.siteName || "My ecommerce Website",
    description: settings?.metaDescription || settings?.siteDescription || "description",
    keywords: settings?.metaKeyword || '',
    icons: {
      icon: settings?.favicon || "/favicon.ico",
      shortcut: settings?.favicon || "/favicon.ico",
      apple: settings?.favicon || "/favicon.ico",
    },
    openGraph: {
      url: `${BASE_URL}`,
      images: [
        { url: settings?.ogImage || settings?.logo || '' }
      ]
    },
  };
}

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
 
  return (
    <Suspense fallback={<div>Admin Layout suspent</div>}>
      <SidebarProvider>
        <AdminMainLayout>{children}</AdminMainLayout>
      </SidebarProvider>
    </Suspense>
  );
};

export default AdminLayout;