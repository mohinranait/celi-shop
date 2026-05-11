'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IAppSettings } from '@/models/app-setting';

type TShippingZone = {
  areaName: string;
  fee: number;
};

type Props = {
  shipping: IAppSettings['shipping'] | undefined;
 onChange: (path: string, value: string | number | boolean | TShippingZone[]) => void
};

const ShippingTab = ({ shipping, onChange }: Props) => {

  console.log({shipping});
  
  if (!shipping) return <p>Loading...</p>;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Default Shipping Rates</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Default Shipping Fee (৳)</Label>
            <Input
              type="number"
              value={shipping.defaultShippingFee}
              onChange={(e) => onChange('shipping.defaultShippingFee', Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Free Shipping Threshold (৳)</Label>
            <Input
              type="number"
              value={shipping.freeShippingThreshold}
              onChange={(e) => onChange('shipping.freeShippingThreshold', Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shipping Zones</CardTitle>
          <CardDescription>Define different areas with custom shipping fees</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {shipping.shippingZones.map((zone, index) => (
            <Card key={index} className="border-dashed">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Zone {index + 1}</CardTitle>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const newZones = shipping.shippingZones.filter((_, i) => i !== index);
                    onChange('shipping.shippingZones', newZones);
                  }}
                >
                  Remove
                </Button>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Zone Name</Label>
                    <Input
                      value={zone.areaName}
                      onChange={(e) => {
                        const newZones = [...shipping.shippingZones];
                        newZones[index] = { ...newZones[index], areaName: e.target.value };
                        onChange('shipping.shippingZones', newZones);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fee (৳)</Label>
                    <Input
                      type="number"
                      value={zone.fee}
                      onChange={(e) => {
                        const newZones = [...shipping.shippingZones];
                        newZones[index] = { ...newZones[index], fee: Number(e.target.value) };
                        onChange('shipping.shippingZones', newZones);
                      }}
                    />
                  </div>
                </div>

              
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            type='button'
            onClick={() => {
              const newZones = [...shipping.shippingZones, { areaName: '', fee: 60 }];
              onChange('shipping.shippingZones', newZones);
            }}
          >
            + Add New Zone
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default ShippingTab;