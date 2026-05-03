import { Hero, Features, About, CallToAction, } from './';
import Reviews from './Reviews';

export default function Landing() {
  return (
    <>
      <Hero />
      <About />
      <Features />
      {/* <Display /> */}
      <Reviews />
      <CallToAction />
    </>
  );
}
