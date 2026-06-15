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

import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

import {
  Settings,
  Phone,
  CreditCard,
  Truck,
  ToggleLeft,
  Save,
  Globe,
  LayoutTemplate,
  Plus,
  X
} from 'lucide-react';
import LeftBar from './LeftBar';
import { IAppSettings } from '@/models/app-setting';
import ShippingTab from './ShippingTab';
import FeaturesTab from './FeaturesTab';
import LayoutTab from './LayoutTab';
import GeneralTab from './GeneralTab';
import MediaModal from '../../media/components/MediaModal';
import Image from 'next/image';

export const tabs = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'seo', label: 'SEO', icon: Globe },
  { id: 'features', label: 'Features', icon: ToggleLeft },
  { id: 'layouts', label: 'Layouts', icon: LayoutTemplate },
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




export default function SettingsComponent() {
  const [mediaOpen, setMediaOpen] = useState(false);
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
        if (obj[keys[i]] === undefined || obj[keys[i]] === null) {
          obj[keys[i]] = {};
        }
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

      await updateSettings({ ...settings }).unwrap();
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
    <div className="lg:flex lg:h-[calc(100vh-100px)] max-w-7xl mx-auto border bg-background">
      {/* Sidebar */}
      <div className="lg:w-72 border-r bg-card">
        <LeftBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b bg-card px-8 py-4 flex items-center flex-wrap justify-between">
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

        <div className="flex-1 overflow-auto p-1 lg:p-8 ">
          <div className="max-w-4xl mx-auto space-y-8">

            {/* ==================== GENERAL ==================== */}
            {activeTab === 'general' && (
              <GeneralTab settings={settings} callBack={(key: string, value: string | boolean) => setValue(key, value)} />
            )}

            {/* ==================== CONTACT ==================== */}
            {activeTab === 'contact' && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact & Social</CardTitle>
                  <CardDescription>Customer support and social media</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Contact Email</Label>
                      <Input type="email" value={settings.contactEmail || ''} onChange={e => setValue('contactEmail', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number (WhatsApp included)</Label>
                      <Input value={settings.contactPhone || ''} onChange={e => setValue('contactPhone', e.target.value)} />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="mb-3 block">Business Address</Label>
                    <Input placeholder="Street" value={settings.address?.street || ''} onChange={e => setValue('address.street', e.target.value)} />
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      <Input placeholder="City" value={settings.address?.city || ''} onChange={e => setValue('address.city', e.target.value)} />
                      <Input placeholder="State" value={settings.address?.state || ''} onChange={e => setValue('address.state', e.target.value)} />
                      <Input placeholder="ZIP Code" value={settings.address?.zipCode || ''} onChange={e => setValue('address.zipCode', e.target.value)} />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="mb-3 block">Social Links</Label>
                    <div className="grid lg:grid-cols-2 gap-6">
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
                    <Label>Meta Keywords (Separate by comma)</Label>
                    <Input
                      value={settings.metaKeyword || ''}
                      onChange={e => setValue('metaKeyword', e.target.value)}
                      placeholder="Keyword seperate with comma (,)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>OG Image (Social Share)</Label>
                    <div className="flex gap-3">

                      {
                        settings?.ogImage && <span
                          className="w-24 h-24 rounded-md border-2 border-dashed  
                                 flex flex-col items-center justify-center gap-1 
                                  transition-all relative"
                        >
                          <Image width={100} height={100} alt="Image" src={settings?.ogImage} />
                          <button className="text-[10px] w-5 h-5 rounded-full flex items-center justify-center border text-gray-500 absolute top-1 right-1"><X size={14} /></button>
                        </span>
                      }


                      <Button
                        type="button"
                        variant={'outline'}
                        onClick={() => {
                          setMediaOpen(true);
                        }}
                        className="w-24 h-24 rounded-md border-2 border-dashed  
                                 flex flex-col items-center justify-center gap-1 
                                  transition-all"
                      >
                        <Plus className="w-5 h-5 text-gray-500" />
                        <span className="text-[10px] text-gray-500">Upload</span>
                      </Button>

                    </div>

                  </div>
                </CardContent>
              </Card>
            )}

            {/* ==================== FEATURES ==================== */}
            {activeTab === 'features' && (
              <FeaturesTab settings={settings} callBack={(key: string, value: boolean) => setValue(key, value)} />
            )}

            {/* ==================== Layouts ==================== */}
            {activeTab === 'layouts' && (
              <LayoutTab settings={settings} callBack={(key: string, value: number) => setValue(key, value)} />
            )}

          </div>
        </div>
      </div>


      <MediaModal
        open={mediaOpen}
        setOpen={setMediaOpen}
        onSelect={(url) => {
          setValue('ogImage', url[0])
        }}
      />
    </div>
  );
}