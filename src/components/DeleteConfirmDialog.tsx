
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileItemType } from "./FileItem";

type DeleteConfirmDialogProps = {
  open: boolean;
  item: FileItemType | null;
  onClose: () => void;
  onConfirm: (item: FileItemType) => void;
};

export function DeleteConfirmDialog({
  open,
  item,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const handleDelete = () => {
    if (item) {
      onConfirm(item);
      onClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this {item?.type}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {item?.type === "folder"
              ? "This folder and all its contents will be deleted. This action cannot be undone."
              : "This file will be deleted. This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
