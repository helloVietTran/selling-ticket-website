import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react'; // import icon

interface EventDescriptionProps {
  htmlContent: string;
  title?: string;
}

export default function EventDescription({
  htmlContent,
  title = 'Giới thiệu',
}: EventDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState('120px');

  useEffect(() => {
    if (expanded && contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight + 'px');
    } else {
      setMaxHeight('120px');
    }
  }, [expanded]);

  return (
    <Card className="bg-white rounded-xl shadow-md border border-gray-200 w-full max-w-3xl p-0">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
          {title}
        </h3>

        <div
          ref={contentRef}
          className={`relative overflow-hidden transition-all duration-500 ${
            !expanded ? 'fade-mask' : ''
          }`}
          style={{ maxHeight }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <div
          onClick={() => setExpanded(!expanded)}
          className="flex justify-center items-center cursor-pointer mt-3 text-gray-700 select-none">
          <ChevronDown
            className={`w-6 h-6 transition-transform ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
