interface SearchAliasNoticeProps {
  normalizedQuery: string;
}

export function SearchAliasNotice({ normalizedQuery }: SearchAliasNoticeProps) {
  return (
    <p className="mt-2 text-sm text-gray-600" aria-live="polite">
      Showing results for:{" "}
      <span className="font-medium text-gray-900">{normalizedQuery}</span>
    </p>
  );
}
