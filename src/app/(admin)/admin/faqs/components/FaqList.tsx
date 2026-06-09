'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { FaqModal } from './FaqModel';
import { useDeleteFaqMutation, useGetFaqsQuery } from '@/redux/service/faqs';

interface FAQ {
  _id: string;
  title: string;
  contents: string[];
  priority: number;
  status: boolean;
  createdAt: string;
}

export function FaqList() {

  const [deleteFaq] = useDeleteFaqMutation()
   const {data, isLoading} = useGetFaqsQuery(`page=1&limit=100&status=all`)
   const faqs = data?.data;


  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<FAQ | null>(null);




  const handleEdit = (faq: FAQ) => {
    setSelectedFaq(faq);
    setModalOpen(true);
  };

  const handleDeleteClick = (faq: FAQ) => {
    setFaqToDelete(faq);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!faqToDelete) return;

    try {
      await deleteFaq(faqToDelete._id).unwrap()
      setDeleteDialogOpen(false);
      setFaqToDelete(null);
       toast.success( 'Delete FAQ');
    } catch (error) {
      console.log({error});
      
      toast.error('Failed to delete FAQ');
    }
  };

  const handleCreateNew = () => {
    setSelectedFaq(null);
    setModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setSelectedFaq(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">FAQs</h2>
          <Button onClick={handleCreateNew}>Create FAQ</Button>
        </div>

        {faqs?.length === 0 ? (
          <div className="rounded-lg border border-dashed py-12 text-center">
            <p className="text-muted-foreground">
              No FAQs yet. Create your first FAQ to get started.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>

                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs?.map((faq) => (
                  <TableRow key={faq._id}>
                    <TableCell className="font-medium">{faq.title}</TableCell>

                    <TableCell className="text-center">{faq.priority}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={faq.status ? 'default' : 'secondary'}
                      >
                        {faq.status ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(faq)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteClick(faq)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <FaqModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        faq={selectedFaq}
        // onSuccess={fetchFaqs}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
            <AlertDialogDescription>
              {` Are you sure you want to delete "${faqToDelete?.title}"? This
              action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive">
            Delete
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
