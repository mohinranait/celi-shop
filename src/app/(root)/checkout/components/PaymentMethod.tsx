import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CreditCard } from 'lucide-react'
import Image from 'next/image'
import { TMethodList } from '../page'
import { TPaymentMethod } from '@/redux/service/orders/type'


type Props = {
  paymentMethod: TPaymentMethod;
  callBack: (val: TPaymentMethod) => void;
  paymentMethodss: TMethodList[]
}
const PaymentMethod = ({ paymentMethod, callBack,paymentMethodss }: Props) => {


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(v) => callBack(v as "COD" | "BKASH")

          }
          className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {paymentMethodss.map((method) => (
            <label
              key={method.value}
              className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === method.value ? "border-primary bg-muted" : ""
                }`}
            >
              <RadioGroupItem value={method.value} />
              <span className="text-2xl">
                <Image src={`/${method?.icon}`} width={60} height={50} alt="Image" />
              </span>
              <span className="font-medium">{method.label}</span>
            </label>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

export default PaymentMethod