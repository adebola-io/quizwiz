/**
 * @protected
 * User homepage.
 */
export default function Home() {
  // Loading states and refetch not needed since page will only be accessed if getuser data is successful
  return (
    <main className="page_with_header pl-[--sidebar-width]">
      <div className="w-full flex-col gap-6 h-[calc(100vh-var(--header-height))] font-poppins opacity-70 flex items-center justify-center">
        <span>Stats</span>
      </div>
    </main>
  );
}
