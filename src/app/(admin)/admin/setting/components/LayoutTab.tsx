'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IAppSettings } from '@/models/app-setting';

type Props = {
  settings: IAppSettings;
  callBack: (key: string, value: number) => void
}

const LayoutTab = ({ callBack, settings }: Props) => {
  return (
    <Card className='py-5'>
      <CardHeader>
        <CardTitle>Manage Layout</CardTitle>
        <CardDescription>Enable or disable website layout</CardDescription>
      </CardHeader>
      <CardContent className=" space-y-3">


        <div className="flex items-center bg-muted justify-between py-3 rounded px-3  ">
          <p className="font-medium">Header</p>
          <div>
            <Select
              onValueChange={(value) => callBack("layouts.header", Number(value))}
              value={String(settings?.layouts?.header) || '1'}
              defaultValue='1'
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Header" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={`1`} className="cursor-pointer">
                  Header Small
                </SelectItem>
                <SelectItem value={`2`} className="cursor-pointer">
                  Header Large
                </SelectItem>

              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center bg-muted justify-between py-3 rounded px-3  ">
          <p className="font-medium">Category Section</p>
          <div>
            <Select
              onValueChange={(value) => callBack("layouts.categorySection", Number(value))}
              value={String(settings?.layouts?.categorySection) || '1'}
               defaultValue='1'
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={`1`} className="cursor-pointer">
                  Category section Small
                </SelectItem>
                <SelectItem value={`2`} className="cursor-pointer">
                  Category section Large
                </SelectItem>

              </SelectContent>
            </Select>
          </div>
        </div>


      </CardContent>
    </Card>
  )
}

export default LayoutTab