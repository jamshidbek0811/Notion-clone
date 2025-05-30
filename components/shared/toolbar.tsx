import { Doc } from "@/convex/_generated/dataModel"
import { Button } from "../ui/button"
import { X } from "lucide-react"
import IconPicker from "./icon-picker"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

interface ToolbarProps {
    document: Doc<"documents">
    preview?: boolean
}

const Toolbar = ({ document, preview }: ToolbarProps) => {
    const updateFileds = useMutation(api.document.UpdateField)

    const onIconChange = (icon: string) => {
        updateFileds({ id: document._id, icon })
    }

    const onRemoveIcon = () => {
        updateFileds({
            id: document._id,
            icon: ""
        })
    }
    return (
      <>
          {!!document.icon && !preview && (
              <div className="flex items-center gap-x-2 group/icon pt-6">
                  <IconPicker onChange={onIconChange}>
                      <p className="text-6xl hover:opacity-75 transition">
                          {document.icon}
                      </p>
                  </IconPicker>
                  <Button
                      className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
                      variant={"outline"}
                      size={"icon"}
                      onClick={onRemoveIcon}
                  >
                      <X className="h-4 w-4" />
                  </Button>
              </div>
          )}    
          {!!document.icon && preview && (
          <p className="text-6xl pt-6">{document.icon}</p>
        )}
      </>
    )
}

export default Toolbar