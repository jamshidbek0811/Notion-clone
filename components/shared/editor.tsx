import { useTheme } from "next-themes";
import React from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import "@blocknote/mantine/style.css";

interface EditorProps {
  onChange: (value: any) => void;
  initialContent?: string;
  editable: boolean;
}

const Editor = ({ onChange, editable, initialContent }: EditorProps) => {
    const { resolvedTheme } = useTheme();  

    const editor: BlockNoteEditor  = useCreateBlockNote({ 
      initialContent: initialContent
       ? (JSON.parse(initialContent) as PartialBlock[])
       : undefined,
    })

    editor.isEditable = editable
    editor.onEditorContentChange(() => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    });


    return (
      <BlockNoteView editor={editor} theme={resolvedTheme === "dark" ? "dark" : "light"} />
    );
};

export default Editor;