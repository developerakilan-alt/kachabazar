import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useState } from "react";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode } from "@lexical/rich-text";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiAlignJustify,
  FiList,
} from "react-icons/fi";
import { MdFormatListNumbered } from "react-icons/md";

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatHeading = (headingSize) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  return (
    <div className="flex items-center gap-1 p-2 border-b border-border flex-wrap bg-muted">
      {/* Heading Dropdown */}
      <select
        className="px-2 py-1 border border-border rounded    text-sm"
        value={blockType}
        onChange={(e) => {
          const value = e.target.value;
          setBlockType(value);
          if (value === "paragraph") {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () =>
                  $createHeadingNode("paragraph"),
                );
              }
            });
          } else {
            formatHeading(value);
          }
        }}
      >
        <option value="paragraph">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>

      {/* Bold */}
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={`p-2 rounded hover:bg-muted ${
          isBold ? "bg-muted" : ""
        }`}
        aria-label="Format Bold"
      >
        <FiBold />
      </button>

      {/* Italic */}
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={`p-2 rounded hover:bg-muted ${
          isItalic ? "bg-muted" : ""
        }`}
        aria-label="Format Italic"
      >
        <FiItalic />
      </button>

      {/* Underline */}
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={`p-2 rounded hover:bg-muted ${
          isUnderline ? "bg-muted" : ""
        }`}
        aria-label="Format Underline"
      >
        <FiUnderline />
      </button>

      <div className="w-px h-6 bg-muted mx-1"></div>

      {/* Align Left */}
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className="p-2 rounded hover:bg-muted"
        aria-label="Left Align"
      >
        <FiAlignLeft />
      </button>

      {/* Align Center */}
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className="p-2 rounded hover:bg-muted"
        aria-label="Center Align"
      >
        <FiAlignCenter />
      </button>

      {/* Align Right */}
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className="p-2 rounded hover:bg-muted"
        aria-label="Right Align"
      >
        <FiAlignRight />
      </button>

      {/* Align Justify */}
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className="p-2 rounded hover:bg-muted"
        aria-label="Justify Align"
      >
        <FiAlignJustify />
      </button>

      <div className="w-px h-6 bg-muted mx-1"></div>

      {/* Bullet List */}
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }}
        className="p-2 rounded hover:bg-muted"
        aria-label="Bullet List"
      >
        <FiList />
      </button>

      {/* Numbered List */}
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }}
        className="p-2 rounded hover:bg-muted"
        aria-label="Numbered List"
      >
        <MdFormatListNumbered />
      </button>
    </div>
  );
};

export default ToolbarPlugin;
