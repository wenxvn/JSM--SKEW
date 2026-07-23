import { auth } from "@clerk/nextjs/server";
import HomeNews from "@/components/home-news";
import { getAnalyzedArticles } from "@/lib/supabase/queries";

export default async function Home() {
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (!isAuthenticated) {
    return redirectToSignIn();
  }

  const articles = await getAnalyzedArticles();
  return <HomeNews articles={articles} />;
}
