import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

interface RoomParams {
  params: Promise<{ roomId: string }>;
}

export const generateMetadata = async ({
  params,
}: RoomParams): Promise<Metadata> => {
  const { roomId } = await params;
  return {
    title: `Room ${roomId}`,
    description: `Room ${roomId}`,
  };
};

export default function RoomLayout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
