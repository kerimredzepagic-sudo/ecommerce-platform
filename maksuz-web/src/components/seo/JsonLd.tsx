/**
 * JsonLd Component
 *
 * A reusable component for injecting structured data (JSON-LD) into pages.
 * This helps search engines understand the content better and enables rich snippets.
 *
 * @example
 * ```tsx
 * import { JsonLd } from "@/components/seo/JsonLd";
 * import { generateProductSchema } from "@/lib/seo";
 *
 * export default function ProductPage({ product }) {
 *   return (
 *     <>
 *       <JsonLd data={generateProductSchema(product)} />
 *       <div>... product content ...</div>
 *     </>
 *   );
 * }
 * ```
 */

type JsonLdProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any> | Record<string, any>[];
};

export function JsonLd({ data }: JsonLdProps) {
  // Handle both single schema and array of schemas
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0),
          }}
        />
      ))}
    </>
  );
}

export default JsonLd;
