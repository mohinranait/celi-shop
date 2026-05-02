"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReusableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxHeight?: string;
  className?: string;
}

export function GlobalModal({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
  footer,
  maxHeight = "70vh",
  className,
}: ReusableModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("gap-0 p-0 overflow-hidden", className)}
      >
        {/* Header */}
        {(title || description || icon) && (
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-start gap-3">
              {icon && (
                <div className="text-primary text-xl">{icon}</div>
              )}
              <div>
                {title && <DialogTitle>{title}</DialogTitle>}
                {description && (
                  <DialogDescription>{description}</DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>
        )}

        {/* Body (Scrollable) */}
        <div
          className="p-4 max-h-[70vh] overflow-y-auto"
          style={{ maxHeight }}
        >
          {children}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t">
          {footer ? (
            footer
          ) : (
            <div className="flex justify-end gap-2  w-full">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={() => onOpenChange(false)}>Confirm</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
