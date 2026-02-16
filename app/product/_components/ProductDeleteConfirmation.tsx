
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";

interface ProductDeleteConfirmationProps {
    confirmDelete: () => void;
    deleteId: string | null;
    isPending: boolean;
    setDeleteId: Dispatch<SetStateAction<string | null>>;
}


export function ProductDeleteConfirmation({ confirmDelete,
    deleteId,
    isPending,
    setDeleteId }: ProductDeleteConfirmationProps) {
    return (
        <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this product? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" disabled={isPending} onClick={() => setDeleteId(null)}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        disabled={isPending}
                        onClick={confirmDelete}
                    >
                        {isPending ? "Deleting..." : "Delete Product"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
