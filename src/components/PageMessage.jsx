import { LoaderCircle, SearchX } from "lucide-react";
import Page from "./Page";

export default function PageMessage({ loading = false, children }) {
  return (
    <Page tint="from-[#2a2a2a]">
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-sp-sub">
        {loading ? (
          <LoaderCircle size={32} className="animate-spin text-sp-green" />
        ) : (
          <SearchX size={32} />
        )}
        <p className="text-base font-medium">{children}</p>
      </div>
    </Page>
  );
}
