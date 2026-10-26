import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuidePage } from "../../guide-page";
import { guideMetadata } from "../../guide-metadata";
import {
  RECORD_GUIDE_STATES,
  RECORD_GUIDE_TYPES,
  getRecordGuideContent,
} from "../../record-guide-content";

export function generateStaticParams() {
  return RECORD_GUIDE_STATES.flatMap((state) =>
    RECORD_GUIDE_TYPES.map((certificate) => ({ state, certificate })),
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; certificate: string }>;
}): Promise<Metadata> {
  const { state, certificate } = await params;
  const content = getRecordGuideContent(state, certificate);
  return content ? guideMetadata(state, certificate, content) : {};
}
export default async function RecordGuide({
  params,
}: {
  params: Promise<{ state: string; certificate: string }>;
}) {
  const { state, certificate } = await params;
  const content = getRecordGuideContent(state, certificate);
  if (!content) notFound();
  return <GuidePage state={state} certificate={certificate} content={content} />;
}
