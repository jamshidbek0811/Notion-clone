"use client"

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSetting } from "@/hooks/use-setting";
import { ModeToggle } from "../shared/mode-toggle";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";
import { Loader } from "../ui/loader";

const SettingsModal = () => {
    const settings = useSetting()
    const { isOpen, onClose, onOpen, onToggle } = settings

     useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          onToggle()
        }
      }    
      document.addEventListener("keydown", down);
      return () => document.removeEventListener("keydown", down);
    }, [onToggle])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader className="border-b pb-3">
                    <h2 className="text-lg font-medium">My settings</h2>
                </DialogHeader>

                 <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <Label>Appearance</Label>
                        <span className="text-[0.8rem] text-muted-foreground">
                            Customize how Notion looks on your device
                        </span>
                    </div>
                    <ModeToggle />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <Label>Payments</Label>
                        <span className="text-[0.8rem] text-muted-foreground">
                            Manage your subscription and billing information
                        </span>
                    </div>
                    <Button size={"sm"}>
                        <Settings size={16} />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SettingsModal