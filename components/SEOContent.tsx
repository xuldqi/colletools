interface SEOContentProps {
  children?: React.ReactNode
}

export default function SEOContent({ children }: SEOContentProps) {
  return (
    <article className="mt-16 prose prose-slate prose-lg mx-auto text-gray-600 max-w-3xl border-t pt-10">
      {children}
    </article>
  )
}

