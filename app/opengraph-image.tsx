import { ImageResponse } from "next/og";

export const alt = "USVC — Trusted Help for US Vital Certificates";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
