'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useGetAppSettingQuery, useUpdateAppSettingMutation } from '@/redux/service/setting';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

import {
  Settings,
  Phone,
  CreditCard,
  Truck,
  ToggleLeft,
  Save,
  Globe
} from 'lucide-react';
import LeftBar from './LeftBar';
import { IAppSettings } from '@/models/app-setting';
import ShippingTab from './ShippingTab';

export const tabs = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'seo', label: 'SEO', icon: Globe },
  { id: 'features', label: 'Features', icon: ToggleLeft },
];

export type TShippingZone = {
  areaName: string;
  fee: number;
}
type SocialPlatform = "facebook" | "instagram" | "youtube" | "tiktok";
const platforms: SocialPlatform[] = [
  "facebook",
  "instagram",
  "youtube",
  "tiktok",
];


type FeatureKey =
  | "wishlist"
  | "productReview"
  | "couponSystem"
  | "flashSale"
  | "multiVendor"
  | "blog";
const featureList: { key: FeatureKey; label: string }[] = [
  { key: "wishlist", label: "Wishlist System" },
  { key: "productReview", label: "Product Reviews" },
  { key: "couponSystem", label: "Coupon System" },
  { key: "flashSale", label: "Flash Sale" },
  { key: "multiVendor", label: "Multi-Vendor Support" },
  { key: "blog", label: "Blog System" },
];
export default function SettingsComponent() {
  const { data: serverData, isLoading } = useGetAppSettingQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateAppSettingMutation();

  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<IAppSettings | null>(null);
  const [isDirty, setIsDirty] = useState(false);


  const isInitialized = useRef(false);


  useEffect(() => {
    if (serverData && !isInitialized.current) {
      setSettings(structuredClone(serverData));
      isInitialized.current = true;
    }
  }, [serverData]);

  const setValue = (path: string, value: number | string | boolean | TShippingZone[]) => {
    setSettings((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');

      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }

      obj[keys[keys.length - 1]] = value;
      return next;
    });
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      console.log({ settings });

      await updateSettings({ ...settings, socialLinks: {} }).unwrap();
      toast.success('Settings saved successfully');
      setIsDirty(false);
    } catch (err) {
      console.log(err);

      toast.error('Failed to save settings');
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading settings...</div>;
  if (!settings) return null;

  return (
    <div className="flex h-[calc(100vh-100px)] px-10 border bg-background">
      {/* Sidebar */}
      <div className="w-72 border-r bg-card">


        <LeftBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b bg-card px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {tabs.find(t => t.id === activeTab)?.label} Settings
            </h2>
            <p className="text-sm text-muted-foreground">{settings.siteName}</p>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            size="lg"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
            {isDirty && <Badge variant="secondary" className="ml-2">Unsaved</Badge>}
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto space-y-8">

            {/* ==================== GENERAL ==================== */}
            {activeTab === 'general' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Site Identity</CardTitle>
                    <CardDescription>Basic information about your store</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Site Name</Label>
                        <Input value={settings.siteName} onChange={e => setValue('siteName', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Logo URL</Label>
                        <Input value={settings.logo} onChange={e => setValue('logo', e.target.value)} placeholder="https://" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Site Description</Label>
                      <Textarea value={settings.siteDescription} onChange={e => setValue('siteDescription', e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Language</Label>
                        <Select value={settings.language} onValueChange={v => setValue('language', v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bn">বাংলা</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <div className="flex gap-3">
                          <Input className="w-20" value={settings.currency?.symbol} onChange={e => setValue('currency.symbol', e.target.value)} />
                          <Input value={settings.currency?.code} onChange={e => setValue('currency.code', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Maintenance Mode</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable Maintenance Mode</p>
                        <p className="text-sm text-muted-foreground">Temporarily take site offline</p>
                      </div>
                      <Switch checked={settings.maintenanceMode} onCheckedChange={v => setValue('maintenanceMode', v)} />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* ==================== CONTACT ==================== */}
            {activeTab === 'contact' && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact & Social</CardTitle>
                  <CardDescription>Customer support and social media</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Contact Email</Label>
                      <Input type="email" value={settings.contactEmail || ''} onChange={e => setValue('contactEmail', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input value={settings.contactPhone || ''} onChange={e => setValue('contactPhone', e.target.value)} />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="mb-3 block">Business Address</Label>
                    <Input placeholder="Street" value={settings.address?.street || ''} onChange={e => setValue('address.street', e.target.value)} />
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <Input placeholder="City" value={settings.address?.city || ''} onChange={e => setValue('address.city', e.target.value)} />
                      <Input placeholder="State" value={settings.address?.state || ''} onChange={e => setValue('address.state', e.target.value)} />
                      <Input placeholder="ZIP Code" value={settings.address?.zipCode || ''} onChange={e => setValue('address.zipCode', e.target.value)} />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="mb-3 block">Social Links</Label>
                    <div className="grid grid-cols-2 gap-6">
                      {platforms.map(platform => (
                        <div key={platform} className="space-y-2">
                          <Label className="capitalize">{platform}</Label>
                          <Input
                            value={settings?.socialLinks?.[platform] || ''}
                            onChange={e => setValue(`socialLinks.${platform}`, e.target.value)}
                            placeholder={`https://${platform}.com/...`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ==================== PAYMENT ==================== */}
            {activeTab === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Enable and configure payment gateways</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* COD */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Cash on Delivery (COD)</p>
                      <p className="text-sm text-muted-foreground">Cash payment on delivery</p>
                    </div>
                    <Switch checked={settings.paymentMethods?.cod} onCheckedChange={v => setValue('paymentMethods.cod', v)} />
                  </div>

                  <Separator />

                  {/* bKash */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">bKash</p>
                      </div>
                      <Switch checked={settings.paymentMethods?.bKash?.enabled} onCheckedChange={v => setValue('paymentMethods.bKash.enabled', v)} />
                    </div>
                    {settings.paymentMethods?.bKash?.enabled && (
                      <Input
                        value={settings.paymentMethods.bKash.merchantNumber || ''}
                        onChange={e => setValue('paymentMethods.bKash.merchantNumber', e.target.value)}
                        placeholder="bKash Merchant Number"
                      />
                    )}
                  </div>
                  <Separator />
                  {/* Nagad */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Nagad</p>
                      </div>
                      <Switch checked={settings.paymentMethods?.nagad?.enabled} onCheckedChange={v => setValue('paymentMethods.nagad.enabled', v)} />
                    </div>
                    {settings.paymentMethods?.nagad?.enabled && (
                      <Input
                        value={settings.paymentMethods.nagad.merchantNumber || ''}
                        onChange={e => setValue('paymentMethods.nagad.merchantNumber', e.target.value)}
                        placeholder="Nagad Merchant Number"
                      />
                    )}
                  </div>
                  

                  <Separator />

                  {/* SSLCommerz */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div><p className="font-medium">SSLCommerz</p></div>
                      <Switch checked={settings.paymentMethods?.sslcommerz?.enabled} onCheckedChange={v => setValue('paymentMethods.sslcommerz.enabled', v)} />
                    </div>
                    {settings.paymentMethods?.sslcommerz?.enabled && (
                      <Input
                        value={settings.paymentMethods.sslcommerz.storeId || ''}
                        onChange={e => setValue('paymentMethods.sslcommerz.storeId', e.target.value)}
                        placeholder="Store ID"
                      />
                    )}
                  </div>

                  <Separator />

                  {/* Stripe */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div><p className="font-medium">Stripe</p></div>
                      <Switch checked={settings.paymentMethods?.stripe?.enabled} onCheckedChange={v => setValue('paymentMethods.stripe.enabled', v)} />
                    </div>
                    {settings.paymentMethods?.stripe?.enabled && (
                      <Input
                        value={settings.paymentMethods.stripe.publishableKey || ''}
                        onChange={e => setValue('paymentMethods.stripe.publishableKey', e.target.value)}
                        placeholder="pk_live_..."
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ==================== SHIPPING ==================== */}
            {activeTab === 'shipping' && <ShippingTab shipping={settings?.shipping} onChange={setValue} />}

            {/* ==================== SEO ==================== */}
            {activeTab === 'seo' && (
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>Search Engine Optimization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Meta Title</Label>
                    <Input
                      value={settings.metaTitle || ''}
                      onChange={e => setValue('metaTitle', e.target.value)}
                      placeholder="Best Ecommerce Store in Bangladesh"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <Textarea
                      value={settings.metaDescription || ''}
                      onChange={e => setValue('metaDescription', e.target.value)}
                      rows={4}
                      placeholder="Shop the best products at affordable prices..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>OG Image (Social Share)</Label>
                    <Input
                      value={settings.ogImage || ''}
                      onChange={e => setValue('ogImage', e.target.value)}
                      placeholder="https://yourdomain.com/og-image.jpg"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ==================== FEATURES ==================== */}
            {activeTab === 'features' && (
              <Card>
                <CardHeader>
                  <CardTitle>Feature Management</CardTitle>
                  <CardDescription>Enable or disable website features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {featureList.map((f) => (
                    <div key={f.key} className="flex items-center justify-between py-3 border-b last:border-0">
                      <p className="font-medium">{f.label}</p>
                      <Switch
                        checked={settings.features?.[f.key]}
                        onCheckedChange={(v) => setValue(`features.${f.key}`, v)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}