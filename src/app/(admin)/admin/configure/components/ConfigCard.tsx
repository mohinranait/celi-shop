"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, X, Edit2,  EyeOff, Eye, } from "lucide-react";

interface ConfigField {
  name: string;
  label: string;
  type?: "text" | "password";
  value: string;
}

interface ConfigCardProps {
  title: string;
  icon: React.ReactNode;
  fields: ConfigField[];
  status: boolean;
  onStatusChange: (newStatus: boolean) => void;
  onSave: (data: Record<string, string>) => void;
  isSaving?: boolean;
}

export function ConfigCard({
  title,
  icon,
  fields,
  status,
  onStatusChange,
  onSave,
  isSaving = false,
}: ConfigCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {}),
  );

  const [visibleFields, setVisibleFields] = useState<
    Record<string, "text" | "password">
  >(
    fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: field.type ,
      }),
      {},
    ),
  );

 

  const handleFieldChange = (fieldName: string, value: string) => {
    setEditedFields((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const toggleVisibility = (fieldName: string) => {
    setVisibleFields((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName] === "password" ? "text" : "password",
    }));
  };

  const handleSave = () => {
    onSave(editedFields);
    setIsEditing(false);
  };

  return (
    <Card className="bg-card flex-col flex border border-border/50 hover:border-border transition-colors">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-yellow-400 text-2xl">{icon}</div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {status ? <span className="inline-flex h-3 w-3 rounded-full bg-green-600" /> : <span className="inline-flex h-3 w-3 rounded-full bg-red-600"></span> }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label
                htmlFor={`${title}-switch`}
                className="text-sm font-medium text-foreground"
              >
                {status ? "On" : "Off"}
              </Label>
              <Switch
                id={`${title}-switch`}
                checked={status}
                onCheckedChange={onStatusChange}
                disabled={isEditing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4 flex-1">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label className="text-sm font-medium text-foreground/80">
              {field.label}
            </Label>
            <div className="relative">
              {isEditing ? (
                <Input
                  type={
                    visibleFields[field.name] === "password" ? "password" : "text"  
                  }
                  value={editedFields[field.name]}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.target.value)
                  }
                  // className="border-gray-300 focus:border-indigo-500"
                  className="  border-border/50   focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              ) : (
                <div className="bg-secondary/10 rounded-md p-3 border border-border/30">
                  <p className="text-sm text-foreground/70 break-all">
                    {field.value ? (
                      visibleFields[field.name] === "password"? (
                        "••••••••••••••"
                      ) : (
                        field.value
                      )
                    ) : (
                      <span className="text-muted-foreground italic">
                        Not set
                      </span>
                    )}
                  </p>
                </div>
              )}

              {field.type == "password" && (
                <button
                  type="button"
                  onClick={() => toggleVisibility(field.name)}
                  className=" absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  
                  {visibleFields[field.name] !== 'password' ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-white border-t border-border/50 rounded-b-lg flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setEditedFields(
                  fields.reduce(
                    (acc, field) => ({ ...acc, [field.name]: field.value }),
                    {},
                  ),
                );
              }}
              className="gap-2 border-border/50 hover:bg-secondary/50"
              disabled={isSaving}
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save
                </>
              )}
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            disabled={isSaving}
            className="gap-2 border-border/50 hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        )}
      </div>
    </Card>
  );
}