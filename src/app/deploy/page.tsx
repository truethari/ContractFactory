import Deploy from "@/components/deploy";

export default function Page() {
  return (
    <>
      <div className="min-h-screen">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl"></div>
        </div>

        <Deploy />
      </div>
    </>
  );
}
