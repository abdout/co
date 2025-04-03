import { notFound } from 'next/navigation';
import { allDocs } from 'contentlayer/generated';
import type { Doc } from 'contentlayer/generated';
import { Mdx } from '@/components/ui/mdx-components';

interface DocPageProps {
  params: {
    slug?: string[];
  };
}

async function getDocFromParams(params: DocPageProps['params']) {
  try {
    const slug = params.slug?.join('/') || 'index';
    const doc = allDocs.find((doc) => doc._raw.flattenedPath === `docs/${slug}`);
    
    if (!doc) {
      return null;
    }

    return doc;
  } catch (error) {
    console.error('Error fetching doc:', error);
    return null;
  }
}

export default async function DocPage({ params }: DocPageProps) {
  try {
    const doc = await getDocFromParams(params);
    
    // If the doc doesn't exist, return a 404
    if (!doc) {
      // Fallback to a placeholder UI if we're still generating docs
      return (
        <div className="container max-w-4xl py-12 px-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
            <p className="text-lg text-muted-foreground">
              Path: {params.slug ? params.slug.join('/') : 'index'}
            </p>
          </div>
          <div className="mt-8">
            <p>The documentation system is almost ready!</p>
            <p className="mt-4">To see content here:</p>
            <ol className="list-decimal pl-6 mt-2">
              <li>Run <code>pnpm generate-docs</code> to create MDX files</li>
              <li>Configure ContentLayer in your project</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      );
    }

    // Return the actual document
    return (
      <div className="container max-w-4xl py-12 px-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">{doc.title}</h1>
          {doc.description && (
            <p className="text-lg text-muted-foreground">{doc.description}</p>
          )}
        </div>
        <div className="mt-8">
          <Mdx code={doc.body.code} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering doc:', error);
    return notFound();
  }
} 