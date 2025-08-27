import { Hero } from '@/components/landing/Hero';
import { Services } from '@/components/landing/Services';
import { Projects } from '@/components/landing/Projects';
import { Stats } from '@/components/landing/Stats';
import { Pricing } from '@/components/landing/Pricing';
import { Testimonials } from '@/components/landing/Testimonials';
import { Logos } from '@/components/landing/Logos';
import { Contact } from '@/components/landing/Contact';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Projects />
      <Stats />
      <Pricing />
      <Testimonials />
      <Logos />
      <Contact />
      <Footer />
    </main>
  );
}
