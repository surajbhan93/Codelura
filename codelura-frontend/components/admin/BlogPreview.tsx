export default function BlogPreview({ html }: { html: string }) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <h2 className="font-semibold mb-2">Live Preview</h2>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
