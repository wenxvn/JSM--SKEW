import { auth } from "@clerk/nextjs/server";
import HomeNewsPreview from "@/components/home-news-preview";

export default async function Home() {
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (!isAuthenticated) {
    return redirectToSignIn();
  }

  return <HomeNewsPreview />;
}
