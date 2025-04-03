import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface SuccessDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  onClose: () => void;
}

export function SuccessDialog({ showDialog, setShowDialog, onClose }: SuccessDialogProps) {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registration Completed Successfully</DialogTitle>
          <DialogDescription>
            Thank you! Your application has been received. We will contact you soon.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
} 