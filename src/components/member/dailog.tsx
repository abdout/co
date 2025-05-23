'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import MemberChart from "./chart";
import { Icon } from "@iconify/react";



export function DialogDemo() {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 font-medium text-lg"
                >
                    <Icon icon="ic:sharp-plus" width={20} />
                    اضافة مقال
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>اضافة مقال</DialogTitle>
                <MemberChart onClose={handleClose} />
            </DialogContent>
        </Dialog>
    );
}
