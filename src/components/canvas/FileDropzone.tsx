import { useRef, useState, type DragEvent } from "react";
import { motion } from "motion/react";
import { UploadCloud, FileText, X, RefreshCw, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  ACCEPTED_BLUEPRINT_TYPES,
  formatBytes,
  readFileAsBlueprint,
  validateFile,
} from "@/lib/project-service";
import type { BlueprintFile } from "@/lib/project-store";

interface FileDropzoneProps {
  file: BlueprintFile | null | undefined;
  onFile: (file: BlueprintFile) => void;
  onRemove: () => void;
  title?: string;
  hint?: string;
  accept?: string[];
  compact?: boolean;
}

/** Premium drag & drop upload area with preview, replace and remove. */
export function FileDropzone({
  file,
  onFile,
  onRemove,
  title = "Upload Blueprint",
  hint = "PDF, PNG, JPG or JPEG · up to 25MB",
  accept = ACCEPTED_BLUEPRINT_TYPES,
  compact = false,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    const picked = files?.[0];
    if (!picked) return;
    const error = validateFile(picked, accept);
    if (error) {
      toast.error(error);
      return;
    }
    try {
      onFile(await readFileAsBlueprint(picked));
      toast.success(`${picked.name} uploaded`);
    } catch {
      toast.error("Could not read that file. Please try again.");
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    void handleFiles(e.dataTransfer.files);
  };

  const isImage = file?.type.startsWith("image/");

  if (file) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[18px] border border-border bg-foreground/[0.03] p-4"
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-background/40">
          {isImage ? (
            <img
              src={file.dataUrl}
              alt={`Preview of ${file.name}`}
              loading="lazy"
              className={compact ? "h-36 w-full object-cover" : "max-h-72 w-full object-contain"}
            />
          ) : (
            <div className={`grid place-items-center gap-2 ${compact ? "h-36" : "h-56"}`}>
              <FileText size={28} className="text-accent" aria-hidden />
              <p className="text-xs text-muted-foreground">PDF preview placeholder</p>
            </div>
          )}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {file.type || "unknown"} · {formatBytes(file.size)}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-border px-3 py-2 text-xs text-secondary-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RefreshCw size={13} aria-hidden /> Replace
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-destructive/40 px-3 py-2 text-xs text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X size={13} aria-hidden /> Remove
            </button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept.join(",")}
          className="sr-only"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </motion.div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`grid place-items-center rounded-[18px] border-2 border-dashed text-center transition-colors ${
        compact ? "p-6" : "p-10 sm:p-14"
      } ${dragging ? "border-accent bg-accent/10" : "border-border bg-foreground/[0.02]"}`}
    >
      <motion.span
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="ember-gradient grid size-12 place-items-center rounded-2xl text-primary-foreground"
      >
        {compact ? <ImageIcon size={20} aria-hidden /> : <UploadCloud size={22} aria-hidden />}
      </motion.span>
      <p className="mt-4 text-sm font-semibold sm:text-base">{title}</p>
      <p className="mt-1 text-xs text-secondary-foreground sm:text-sm">
        Drag &amp; drop your {compact ? "room photo" : "furniture blueprint"} here
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-3 rounded-2xl border border-accent/40 px-4 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        or browse files
      </button>
      <p className="mt-3 text-[11px] text-muted-foreground">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept.join(",")}
        className="sr-only"
        onChange={(e) => void handleFiles(e.target.files)}
      />
    </div>
  );
}
