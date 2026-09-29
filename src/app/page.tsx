import { HomeView } from "@/components/home-view";
import { getCatalog } from "@/lib/catalog";

export const revalidate = 300;

export default async function HomePage() {
  const catalog = await getCatalog();
  return <HomeView catalog={catalog} />;
}
