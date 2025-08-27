import Image from 'next/image';

const logos = Array.from({ length: 5 }, (_, i) => `https://placehold.co/100x40?text=Logo+${i+1}&grayscale`);

export function Logos() {
  return (
    <section className="container py-16">
      <div className="flex flex-wrap items-center justify-center gap-6 opacity-70">
        {logos.map((logo, i) => (
          <Image key={i} src={logo} alt={`Logo ${i + 1}`} width={100} height={40} />
        ))}
      </div>
    </section>
  );
}
