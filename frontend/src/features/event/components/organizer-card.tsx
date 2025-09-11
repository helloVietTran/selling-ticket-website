import { Card, CardContent } from "@/components/ui/card";

interface OrganizerCardProps {
  image: string;
  name: string;
  description: string;
}

export default function OrganizerCard({ image, name, description }: OrganizerCardProps) {
  return (
    <Card className="bg-white shadow-2xs rounded-2xl border border-gray-200 w-full max-w-3xl p-4">
      <CardContent className="flex  gap-4 p-0">
        <img
          src={image}
          alt={name}
          className="size-50 object-cover rounded-xl"
        />
        <div className="flex flex-col">
          <h4 className="text-xl font-semibold text-gray-800 uppercase">{name}</h4>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </CardContent>

      
    </Card>
  );
}
