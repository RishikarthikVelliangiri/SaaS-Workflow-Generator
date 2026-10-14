import React from 'react';

// Model output is untrusted: this renders a small markdown subset as React nodes,
// never as HTML, so nothing the model returns can inject markup.

const inline = (text: string): React.ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`)/g).filter(Boolean).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={i} className="rounded-sm bg-foreground/[0.07] px-1 font-label text-[0.9em]">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });

interface RichTextProps {
  text: string;
  className?: string;
}

const RichText: React.FC<RichTextProps> = ({ text, className }) => {
  const blocks = text
    .replace(/\\n/g, '\n')
    .replace(/\r/g, '')
    .trim()
    .split(/\n{2,}/)
    .filter(Boolean);

  return (
    <div className={className}>
      {blocks.map((block, i) => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.every(l => /^[-•]\s+/.test(l))) {
          return (
            <ul key={i} className="my-2 space-y-1.5 pl-4">
              {lines.map((l, j) => (
                <li key={j} className="list-disc marker:text-muted-foreground">{inline(l.replace(/^[-•]\s+/, ''))}</li>
              ))}
            </ul>
          );
        }
        return <p key={i} className="my-2 first:mt-0 last:mb-0">{inline(lines.join(' '))}</p>;
      })}
    </div>
  );
};

export default RichText;
