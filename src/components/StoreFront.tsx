import Image from 'next/image';
import storefrontImg from '../assets/images/storefront.jpg';

export default function StoreFront({ className = '' }: { className?: string }) {
  return (
    <Image
      src={storefrontImg}
      alt="El Reno Nail Spa Storefront"
      className={`object-cover ${className}`}
      width={600}
      height={400}
    />
  );
}
