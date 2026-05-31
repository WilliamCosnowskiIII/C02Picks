import { LeagueDashboard } from "@/components/LeagueDashboard";
import { fetchAllLeagues } from "@/lib/leagues";

export default async function HomePage() {
  const initialData = await fetchAllLeagues();

  return <LeagueDashboard initialData={initialData} />;
}
