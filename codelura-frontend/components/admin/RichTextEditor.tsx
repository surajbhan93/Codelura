"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { lowlight } from "lowlight";
import { Button } from "flowbite-react";
import { useState } from "react";
// import TurndownService from "turndown";
const TurndownService = require("turndown");

export default function RichTextEditor({
  value,
  onChange
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const [darkMode, setDarkMode] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3, 4] }
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Image.configure({ inline: false }),
      Link.configure({
        autolink: true,
        openOnClick: false
      })
    ],
    content: value,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    }
  });

  if (!editor) return null;

  const btn = (active: boolean) =>
    active
      ? "bg-indigo-600 text-white"
      : darkMode
      ? "bg-slate-700 text-white"
      : "bg-white";

  const addImage = () => {
    const url = window.prompt("Enter Image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  const exportMarkdown = () => {
    const turndown = new TurndownService();
    const markdown = turndown.turndown(editor.getHTML());
    navigator.clipboard.writeText(markdown);
    alert("Markdown copied to clipboard ✅");
  };

  return (
    <div
      className={`rounded-xl overflow-hidden border shadow-lg ${
        darkMode
          ? "bg-slate-900 border-slate-700"
          : "bg-white border-slate-200"
      }`}
    >
      {/* TOOLBAR */}
      <div
        className={`sticky top-0 z-20 flex flex-wrap gap-1 px-3 py-2 border-b ${
          darkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-slate-100 border-slate-200"
        }`}
      >
        <Button size="xs" className={btn(editor.isActive("paragraph"))}
          onClick={() => editor.chain().focus().setParagraph().run()}>
          P
        </Button>

        {[1, 2, 3, 4].map((l) => (
          <Button
            key={l}
            size="xs"
            className={btn(editor.isActive("heading", { level: l }))}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: l }).run()
            }
          >
            H{l}
          </Button>
        ))}

        <span className="mx-1 w-px bg-slate-400" />

        <Button size="xs" className={btn(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </Button>

        <Button size="xs" className={btn(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </Button>

        <Button size="xs" className={btn(editor.isActive("strike"))}
          onClick={() => editor.chain().focus().toggleStrike().run()}>
          Strike
        </Button>

        <span className="mx-1 w-px bg-slate-400" />

        <Button size="xs"
          onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </Button>

        <Button size="xs"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. List
        </Button>

        <Button size="xs"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          {"</>"}
        </Button>

        <span className="mx-1 w-px bg-slate-400" />

        <Button size="xs" onClick={addImage}>
          🖼 Image
        </Button>

        <Button size="xs" onClick={() => {
          const url = prompt("Enter URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}>
          🔗 Link
        </Button>

        <span className="mx-1 w-px bg-slate-400" />

        <Button size="xs" color="gray" onClick={exportMarkdown}>
          ⬇ Markdown
        </Button>

        <Button
          size="xs"
          color="gray"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </Button>
      </div>

      {/* EDITOR */}
      <EditorContent
        editor={editor}
        className={`
          min-h-[420px]
          px-4 py-4
          prose max-w-none
          focus:outline-none
          ${
            darkMode
              ? "prose-invert bg-slate-900 text-white"
              : "bg-white prose-indigo"
          }
        `}
      />
    </div>
  );
}
