import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { DeleteDestinationDialog } from "./delete-destination-dialog";

interface DestinationCardProps {
  destination: {
    _id: string;
    slug: string;
    name: string;
    region: string;
    image: string;
  };
  showActionsOnClick?: boolean;
}

export function DestinationCard({ destination, showActionsOnClick }: DestinationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  return (
    <>
      <DeleteDestinationDialog
        destination={destination as any}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
      <motion.div
        className="relative overflow-hidden bg-gray-900 group cursor-pointer rounded-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => router.push(`/admin/destinations/${destination._id}`)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image Section */}
        <div className="aspect-4/3 overflow-hidden relative">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Content Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
            <div className="space-y-4">
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold text-white truncate">
                  {destination.name}
                </h3>
              </div>

              <div className="flex flex-col border-t border-white/10 pt-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-zinc-300" />
                  <span className="text-xs font-bold text-white uppercase tracking-tight">
                    {destination.region}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mt-0.5 ml-4.5">Regional Area</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Actions Overlay */}
        <motion.div
          className="absolute top-4 right-4 flex gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: isHovered || showActionsOnClick ? 1 : 0, y: isHovered || showActionsOnClick ? 0 : -10 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            href={`/admin/destinations/${destination._id}/edit`}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="icon"
              className="bg-amber-600 text-white hover:bg-amber-700 w-9 h-9 rounded-none backdrop-blur-sm"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            size="icon"
            className="bg-red-500 text-white hover:bg-red-600 w-9 h-9 rounded-none backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </motion.div>
      </motion.div>
    </>
  );
}
