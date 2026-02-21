export default function SectionWrapper({
  children,
  bg = "bg-black"
}: {
  children: React.ReactNode;
  bg?: string;
}) {
  return (
    <section className={`${bg} py-24`}>
      <div className="mx-auto max-w-7xl px-6">
        {children}
      </div>
    </section>
  );
}
