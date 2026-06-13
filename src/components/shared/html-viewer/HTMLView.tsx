

import { cn } from "@/lib/utils";
import "./html-view.css";
type Props = {
  htmlText: string ;
  className?:string;
}
const ViewHTML = ({ htmlText, className, ...props }:Props) => {
  const cleanHtml = htmlText.replace(/style="[^"]*"/g, "") as
    | string
    | TrustedHTML;

	return cleanHtml ? (
		<div
			className={cn("view-html prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-800 prose-ul:list-disc prose-ul:pl-4", className)}
			dangerouslySetInnerHTML={{ __html: cleanHtml }}
			{...props}
		/>
	) : null;
};


export default ViewHTML