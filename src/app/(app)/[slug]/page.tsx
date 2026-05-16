import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { RichText } from '@payloadcms/richtext-lexical/react';
import FadeIn from '@/components/ui/FadeIn';

export const dynamic = 'force-dynamic';

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });

  const result = await (payload as any).find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  });

  const page = result.docs[0];

  if (!page) {
    return notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-40 pb-24 px-8 relative overflow-hidden">
        {/* Subtle Brand Glow */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-pink-accent/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-pink-calm/20 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-3xl mx-auto relative z-10">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl font-light text-foreground mb-16 tracking-tight">
              {page.title}
            </h1>
            
            <div className="prose prose-pink max-w-none prose-p:font-light prose-p:leading-relaxed prose-p:text-foreground/80 prose-headings:font-light prose-headings:text-foreground">
              <RichText data={page.content} />
            </div>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </div>
  );
}
