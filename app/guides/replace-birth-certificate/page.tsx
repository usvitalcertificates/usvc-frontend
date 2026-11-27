import type { Metadata } from "next";
import { TopicPage, topicMetadata } from "../topic-page";
import { TOPIC_GUIDES } from "../topic-guides";

const topic = TOPIC_GUIDES["replace-birth-certificate"]!;

export const metadata: Metadata = topicMetadata(topic);

export default function Page() {
  return <TopicPage topic={topic} />;
}
