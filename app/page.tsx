import { getContent } from "@/lib/content";
import HomeClient from "./HomeClient";
import ThemeInjector from "@/components/ThemeInjector";

// Always read fresh content from disk on each request
export const dynamic = "force-dynamic";

export default function Home() {
  const content = getContent();
  return (
    <>
      <ThemeInjector theme={content.theme} />
      <HomeClient content={content} />
    </>
  );
}
