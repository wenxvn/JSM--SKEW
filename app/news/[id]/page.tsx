import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import NewsDetail from "@/components/news-detail";
import NewsDetailPreview from "@/components/news-detail-preview";
import { findPreviewArticle, previewArticles } from "@/lib/preview-articles";
import { getAnalyzedArticleById } from "@/lib/supabase/queries";

type NewsPageProps = {
  params: Promise<{ id: string }>;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function NewsPage({ params }: NewsPageProps) {
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (!isAuthenticated) {
    return redirectToSignIn();
  }

  const { id } = await params;
  const previewArticle = findPreviewArticle(id);
  if (previewArticle) {
    const relatedArticles = previewArticles
      .filter((candidate) => candidate.id !== previewArticle.id)
      .slice(0, 4);

    return (
      <NewsDetailPreview
        article={previewArticle}
        relatedArticles={relatedArticles}
      />
    );
  }

  if (!uuidPattern.test(id)) {
    notFound();
  }

  const article = await getAnalyzedArticleById(id);
  if (!article) {
    notFound();
  }

  return <NewsDetail article={article} />;
}
