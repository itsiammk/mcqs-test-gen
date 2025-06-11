
'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface LoadingModalProps {
  isOpen: boolean;
}

export function LoadingModal({ isOpen }: LoadingModalProps) {
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center text-center">
          <AlertDialogTitle className="flex flex-col items-center justify-center text-2xl font-headline gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            Generating Your Quiz
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-center text-lg py-4 text-muted-foreground">
          Please wait a moment while our AI crafts your questions. This might take a few seconds.
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
}
