import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BIRTH_GUIDE_SOURCES } from "@/lib/seo";
import { GuidePage } from "../../guide-page";
import { guideMetadata } from "../../guide-metadata";
import { getBirthGuideContent } from "./guide-content";

export function generateStaticParams() {
  return Object.keys(BIRTH_GUIDE_SOURCES).map((state) => ({ state }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const source = Object.hasOwn(BIRTH_GUIDE_SOURCES, state) ? BIRTH_GUIDE_SOURCES[state] : undefined;
  return source
    ? guideMetadata(
        state,
        "birth-certificate",
        getBirthGuideContent(state, source.state, source.url),
      )
    : {};
}
export default async function BirthCertificateGuide({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const source = Object.hasOwn(BIRTH_GUIDE_SOURCES, state) ? BIRTH_GUIDE_SOURCES[state] : undefined;
  if (!source) notFound();
  return (
    <GuidePage state={state} content={getBirthGuideContent(state, source.state, source.url)} />
  );
}
