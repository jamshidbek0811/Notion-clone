import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import { useParams } from "next/navigation"
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image"
import { useEdgeStore } from "@/lib/edgestore"
import { useState } from "react"
import { SingleImageDropzone } from "../shared/single-image-dropzone";
import { Id } from "@/convex/_generated/dataModel";

const CoverImageModal = () => {
    const params = useParams()
    const updateFileds = useMutation(api.document.UpdateField)
    const coverImage = useCoverImage()
    const { edgestore } = useEdgeStore()

    
    const [file, setFile] = useState<File>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onClose = () => {
        setFile(undefined)
        setIsSubmitting(false)
        coverImage.onClose()
    }

    const onChange = async(file?: File) => {
        if(file){
            setIsSubmitting(true)
            setFile(file)

            const res = await edgestore.publicFiles.upload({ file, options: { replaceTargetUrl: coverImage.url }},)
            await updateFileds({ id: params.documentId as Id<"documents">, coverImage: res.url })
            onClose()
        }
    } 
    
    return (
       <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
        <DialogContent>
            <DialogHeader>
            <h2 className="text-center text-lg font-semibold">Cover Image</h2>
            </DialogHeader>
            <SingleImageDropzone
                className="w-full outline-none"
                disabled={isSubmitting}
                value={file}
                onChange={onChange}
            />
        </DialogContent>
        </Dialog>
    )
}

export default CoverImageModal