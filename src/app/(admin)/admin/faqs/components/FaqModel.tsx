'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import {
  useCreateFaqMutation,
  useUpdateFaqMutation,
} from '@/redux/service/faqs';
import handleErrors, { ErrorResponse } from '@/lib/handle-error';

interface FAQ {
  _id?: string;
  title: string;
  contents: string[];
  priority: number;
  status: boolean;
}

interface FaqModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq?: FAQ | null;
}

const DEFAULT_FORM_DATA: FAQ = {
  title: '',
  contents: [''],
  priority: 10,
  status: true,
};

export function FaqModal({
  open,
  onOpenChange,
  faq,
}: FaqModalProps) {
  const [createFaq, { isLoading: createLoading }] =
    useCreateFaqMutation();

  const [updateFaq, { isLoading: updateLoading }] =
    useUpdateFaqMutation();

  const [formData, setFormData] = useState<FAQ>(
    faq ?? DEFAULT_FORM_DATA
  );

  const handleContentChange = (
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      contents: prev.contents.map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const handleAddContent = () => {
    setFormData((prev) => ({
      ...prev,
      contents: [...prev.contents, ''],
    }));
  };

  const handleRemoveContent = (index: number) => {
    if (formData.contents.length === 1) {
      toast.error('At least one content item is required');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      contents: prev.contents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const validContents = formData.contents.filter(
      (content) => content.trim().length > 0
    );

    if (
      !formData.title.trim() ||
      validContents.length === 0
    ) {
      toast.error(
        'Title and at least one content item are required'
      );
      return;
    }

    try {
      if (faq?._id) {
        await updateFaq({
          id: faq._id,
          payload: {
            ...formData,
            contents: validContents,
          },
        }).unwrap();

        toast.success('FAQ updated successfully');
      } else {
        await createFaq({
          ...formData,
          contents: validContents,
        }).unwrap();

        toast.success('FAQ created successfully');
      }

      onOpenChange(false);
    } catch (error) {
      console.error(error);
      handleErrors( error as ErrorResponse)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        key={`${faq?._id ?? 'new'}-${open}`}
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>
            {faq?._id
              ? 'Edit FAQ'
              : 'Create New FAQ'}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter FAQ title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              disabled={
                createLoading || updateLoading
              }
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Contents</Label>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddContent}
                disabled={
                  createLoading || updateLoading
                }
              >
                Add Content
              </Button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {formData.contents.map(
                (content, index) => (
                  <div
                    key={index}
                    className="flex gap-2"
                  >
                    <Textarea
                      placeholder={`Enter content ${
                        index + 1
                      }`}
                      value={content}
                      onChange={(e) =>
                        handleContentChange(
                          index,
                          e.target.value
                        )
                      }
                      rows={3}
                      disabled={
                        createLoading ||
                        updateLoading
                      }
                      className="resize-none"
                    />

                    {formData.contents.length >
                      1 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          handleRemoveContent(
                            index
                          )
                        }
                        disabled={
                          createLoading ||
                          updateLoading
                        }
                        className="mt-1 shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">
                Priority
              </Label>

              <Input
                id="priority"
                type="number"
                value={formData.priority}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority:
                      Number(e.target.value) ||
                      10,
                  }))
                }
                disabled={
                  createLoading || updateLoading
                }
              />
            </div>

            <div className="flex items-end space-x-2 pb-2">
              <Label
                htmlFor="status"
                className="flex items-center space-x-2 cursor-pointer"
              >
                <span>Active</span>

                <Switch
                  id="status"
                  checked={formData.status}
                  onCheckedChange={(
                    checked
                  ) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: checked,
                    }))
                  }
                  disabled={
                    createLoading ||
                    updateLoading
                  }
                />
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
              disabled={
                createLoading || updateLoading
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                createLoading || updateLoading
              }
            >
              {createLoading ||
              updateLoading
                ? 'Saving...'
                : faq?._id
                ? 'Update'
                : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}