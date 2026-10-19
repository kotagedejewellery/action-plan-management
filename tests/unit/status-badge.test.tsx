import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "@/presentation/components/workspace-ui";

describe("configured status badge", () => {
  it("marks custom completed labels as complete", () => {
    const html = renderToStaticMarkup(createElement(StatusBadge, { status: "Final", completedStatusLabels: ["Final"] }));
    expect(html).toContain("bg-[#dff3e6]");
  });

  it("does not assume the label Selesai is final when configuration says otherwise", () => {
    const html = renderToStaticMarkup(createElement(StatusBadge, { status: "Selesai", completedStatusLabels: [] }));
    expect(html).not.toContain("bg-[#dff3e6]");
  });
});
