import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { Projects } from '@/components/Projects';
import { Metrics } from '@/components/Metrics';
import { Pricing } from '@/components/Pricing';
import { Testimonials } from '@/components/Testimonials';
import { LogoCloud } from '@/components/LogoCloud';
import { Contact } from '@/components/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Projects />
      <Metrics />
      <Pricing />
      <Testimonials />
      <LogoCloud />
      <Contact />
    </main>
  );
}
