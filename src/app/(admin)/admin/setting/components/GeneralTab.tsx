'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { IAppSettings } from '@/models/app-setting';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import MediaModal from '../../media/components/MediaModal';
type Props = {
  settings: IAppSettings;
  callBack: (key: string, value: string | boolean) => void;
}
const GeneralTab = ({ callBack, settings }: Props) => {
  const [mediaOpen, setMediaOpen] = useState(false);
  const [activeField, setActiveField] = useState<"logo" | "footerLogo" | null>(null);
  return (
    <>
      <Card className='py-5'>
        <CardHeader>
          <CardTitle>Site Identity</CardTitle>
          <CardDescription>Basic information about your store</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input value={settings.siteName} onChange={e => callBack('siteName', e.target.value)} />
            </div>
          </div>

          <div>
            <div className="space-y-1">
              <Label>Header Logo</Label>
              <div className="flex gap-3">

                {
                  settings.logo && <span
                    className="w-24 h-24 rounded-md border-2 border-dashed  
                         flex flex-col items-center justify-center gap-1 
                          transition-all relative"
                  >
                    <Image width={100} height={100} alt="Image" src={settings.logo} />
                    <button className="text-[10px] w-5 h-5 rounded-full flex items-center justify-center border text-gray-500 absolute top-1 right-1"><X size={14} /></button>
                  </span>
                }


                <Button
                  type="button"
                  variant={'outline'}
                  onClick={() => {
                    setMediaOpen(true);
                    setActiveField('logo')
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
          </div>

          {/* Footer logo */}
          <div>
            <div className="space-y-1">
              <Label>Footer Logo</Label>
              <div className="flex gap-3">

                {
                  settings.footerLogo && <span
                    className="w-24 h-24 rounded-md border-2 border-dashed  
                         flex flex-col items-center justify-center gap-1 
                          transition-all relative"
                  >
                    <Image width={100} height={100} alt="Image" src={settings.footerLogo} />
                    <button className="text-[10px] w-5 h-5 rounded-full flex items-center justify-center border text-gray-500 absolute top-1 right-1"><X size={14} /></button>
                  </span>
                }


                <Button
                  type="button"
                  variant={'outline'}
                  onClick={() => {
                    setMediaOpen(true);
                    setActiveField('footerLogo')
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
          </div>

          <div className="space-y-2">
            <Label>Site Description</Label>
            <Textarea value={settings.siteDescription} onChange={e => callBack('siteDescription', e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Global Marque Info</Label>
            <Textarea value={settings.marque} onChange={e => callBack('marque', e.target.value)} />
          </div>

          {/* <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={settings.language} onValueChange={v => callBack('language', v)}>
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
                <Input className="w-20" value={settings.currency?.symbol} onChange={e => callBack('currency.symbol', e.target.value)} />
                <Input value={settings.currency?.code} onChange={e => callBack('currency.code', e.target.value)} />
              </div>
            </div>
          </div> */}
        </CardContent>
      </Card>

      {/* <Card className='py-5'>
        <CardHeader><CardTitle>Maintenance Mode</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Maintenance Mode</p>
              <p className="text-sm text-muted-foreground">Temporarily take site offline</p>
            </div>
            <Switch checked={settings.maintenanceMode} onCheckedChange={v => callBack('maintenanceMode', v)} />
          </div>
        </CardContent>
      </Card> */}


      <MediaModal
        open={mediaOpen}
        setOpen={setMediaOpen}
        onSelect={(url) => {
          if (activeField === "logo") {
            callBack('logo', url[0])
          };
          if (activeField === "footerLogo") {
            callBack('footerLogo', url[0])
          };

        }}
      />
    </>
  )
}

export default GeneralTab