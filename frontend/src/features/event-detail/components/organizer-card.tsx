import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface OrganizerCardProps {
  name: string;
  description: string;
  image?: string;
}

export default function OrganizerCard({
  name,
  description,
  image,
}: OrganizerCardProps) {
  return (
    <Card className="bg-white shadow-2xs rounded-2xl border border-gray-200 w-full max-w-3xl p-4">
      <CardContent className="flex gap-4 p-0 items-center">
        <Avatar className="w-20 h-20 rounded-xl">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="text-lg font-bold">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <h4 className="text-xl font-semibold text-gray-800 uppercase">
            {name}
          </h4>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
