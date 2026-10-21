import { ImageResponse } from "next/og";
import { SOCIAL_IMAGE } from "@/lib/seo";

export const alt = SOCIAL_IMAGE.alt;
export const size = { width: SOCIAL_IMAGE.width, height: SOCIAL_IMAGE.height };
export const contentType = SOCIAL_IMAGE.type;

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#3C3B6E",
        color: "white",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        padding: "72px",
      }}
    >
      <div style={{ color: "#B22234", fontSize: 28, fontWeight: 700 }}>US VITAL CERTIFICATES</div>
      <div style={{ fontFamily: "serif", fontSize: 74, lineHeight: 1.05, marginTop: 28 }}>
        Trusted help for vital certificate requests.
      </div>
      <div style={{ fontSize: 30, marginTop: 34 }}>
        Independent service. Not a government agency.
      </div>
    </div>,
    size,
  );
}
