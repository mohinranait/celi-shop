import { GlobalModal } from "@/components/shared/GlobalModal";
import { Button } from "@/components/ui/button";

import { IContact } from "@/redux/service/contacts/type";
import { Calendar, Mail, Phone, User, FileText, Bandage } from "lucide-react";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  previousData: IContact;
};

const ViewContactQuery = ({
  isOpen,
  setIsOpen,
  previousData,
}: Props) => {
  const fields = [
    {
      label: "Full Name",
      value: previousData.fullName,
      icon: <User size={16} />,
    },
    {
      label: "Email",
      value: previousData.email,
      icon: <Mail size={16} />,
    },
    {
      label: "Phone",
      value: previousData.phone || "N/A",
      icon: <Phone size={16} />,
    },
    {
      label: "Order Number",
      value: previousData.orderNumber || "N/A",
      icon: <FileText size={16} />,
    },
    {
      label: "Subject",
      value: previousData.subject,
      icon: <FileText size={16} />,
    },
    {
      label: "Created At",
      value: new Date(previousData.createdAt).toLocaleString(),
      icon: <Calendar size={16} />,
    },
  ];

  return (
    <>
      <GlobalModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title={"Detais for contact query"}
        description="Show all contact query information"
        icon={<Bandage />}
        maxHeight="max-w-5xl"
        className="min-w-2xl"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>

          </div>
        }
      >

        <div className="space-y-4">
          {fields.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border p-3 space-y-1"
            >
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                {item.icon}
                <span>{item.label}</span>
              </div>

              <p className="font-medium wrap-break-word">
                {item.value}
              </p>
            </div>
          ))}

          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <FileText size={16} />
              <span>Message</span>
            </div>

            <p className="whitespace-pre-wrap wrap-break-word">
              {previousData.message}
            </p>
          </div>
        </div>


      </GlobalModal>


    </>
  );
};

export default ViewContactQuery;