import { useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $insertNodes } from "lexical";
import ToolbarPlugin from "./ToolbarPlugin";

// Plugin to handle onChange and generate HTML using the editor from context
function OnChangeHandler({ onChange }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(editor);
        onChange(htmlString);
      });
    });
  }, [editor, onChange]);

  return null;
}

// Component to load initial HTML content
function LoadInitialContentPlugin({ initialHtml }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (initialHtml) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialHtml, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();
        root.append(...nodes);
      });
    }
  }, [editor, initialHtml]);

  return null;
}

const LexicalEditor = ({ value, onChange, placeholder = "Enter text..." }) => {
  const initialConfig = {
    namespace: "LexicalEditor",
    theme: {
      paragraph: "mb-2",
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
      },
      link: "text-blue-600 underline",
      list: {
        ul: "list-disc list-inside ml-4",
        ol: "list-decimal list-inside ml-4",
        listitem: "mb-1",
      },
      heading: {
        h1: "text-3xl font-bold mb-4",
        h2: "text-2xl font-bold mb-3",
        h3: "text-xl font-bold mb-2",
      },
    },
    onError: (error) => {
      console.error(error);
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative border border-border rounded-md ">
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="min-h-[200px] p-4 outline-none  "
                aria-placeholder={placeholder}
                placeholder={
                  <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">
                    {placeholder}
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <OnChangeHandler onChange={onChange} />
          <LoadInitialContentPlugin initialHtml={value} />
        </div>
      </div>
    </LexicalComposer>
  );
};

export default LexicalEditor;
