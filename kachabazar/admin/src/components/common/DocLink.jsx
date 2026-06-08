import { ExternalLink } from "lucide-react";

const DOC_BASE_URL = "https://hautecouturejewellery-documentation.netlify.app";

/**
 * A small link icon that opens the relevant documentation section.
 * @param {string} section - The documentation page path (e.g., "/backend-configuration")
 * @param {string} anchor - Optional anchor hash (e.g., "#email-configuration-smtp")
 * @param {string} label - Optional tooltip text
 */
const DocLink = ({
  section = "/backend-configuration",
  anchor = "",
  label = "View setup guide",
}) => {
  const href = `${DOC_BASE_URL}${section}${anchor}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 ml-1"
    >
      <ExternalLink className="h-3 w-3" />
      <span className="hidden sm:inline">Docs</span>
    </a>
  );
};

export default DocLink;
