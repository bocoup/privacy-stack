import { Color } from "@tiptap/extension-color";
import { Link } from "@tiptap/extension-link";
import { ListItem } from "@tiptap/extension-list-item";
import { TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import {
  LinkIcon,
  List,
  ListOrdered,
  Pilcrow,
  RedoIcon,
  RemoveFormatting,
  TextQuote,
  Undo,
} from "lucide-react";
import { useState } from "react";

import { cn } from "~/utils";

import { Button } from "./ui/button";

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle,
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Link,
];
export function Editor({ content }: { content: string }) {
  const [html, setHtml] = useState(content);
  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[400px] prose",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setHtml(html);
    },
    enablePasteRules: [Link, "horizontalRule"],
  });

  if (!editor) {
    return;
  }

  return (
    <div className="flex flex-col-reverse">
      <input type="hidden" name="body" value={html} />
      <EditorContent editor={editor} />
      <div className="flex flex-wrap mb-6">
        <Button
          variant="secondary"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          B
        </Button>
        <Button
          variant="secondary"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn("italic", editor.isActive("italic") ? "is-active" : "")}
        >
          i
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const previousUrl = editor.getAttributes("link").href;
            const url = window.prompt("URL", previousUrl);
            if (url === null) {
              return;
            }

            if (url === "") {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }

            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }}
          className={cn("italic", editor.isActive("italic") ? "is-active" : "")}
        >
          <LinkIcon className="h-4" />
        </Button>
        <Button
          variant="secondary"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={cn(
            "line-through",
            editor.isActive("strike") ? "is-active" : "",
          )}
        >
          strike
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          <RemoveFormatting className="w-4" />
        </Button>
        <Button
          variant="secondary"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          <Pilcrow className="h-4" />
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          h1
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          h2
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
        >
          h3
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={
            editor.isActive("heading", { level: 4 }) ? "is-active" : ""
          }
        >
          h4
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={
            editor.isActive("heading", { level: 5 }) ? "is-active" : ""
          }
        >
          h5
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={
            editor.isActive("heading", { level: 6 }) ? "is-active" : ""
          }
        >
          h6
        </Button>
        <Button
          variant="secondary"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          <List />
        </Button>
        <Button
          variant="secondary"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          <ListOrdered className="w-4" />
        </Button>

        <Button
          variant="secondary"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          <TextQuote className="w-4" />
        </Button>

        <Button
          variant="secondary"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <Undo className="w-4" />
        </Button>
        <Button
          variant="secondary"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <RedoIcon className="w-4" />
        </Button>
      </div>
    </div>
  );
}
