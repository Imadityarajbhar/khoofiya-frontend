import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-[140px] font-medium leading-none tracking-[-0.05em] uppercase">
        KHOOFIYA
      </h1>
      <p className="mt-8 text-sm uppercase tracking-[0.1em] font-semibold text-[#808080]">
        Not Everything Is Meant To Be Seen
      </p>
      <div className="mt-12 flex gap-4">
        <Button variant="default">The Archive</Button>
        <Button variant="outline">Manifesto</Button>
      </div>
    </main>
  );
}
