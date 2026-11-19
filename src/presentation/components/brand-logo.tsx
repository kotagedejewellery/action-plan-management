import Image from "next/image";

export function BrandLogo({ className }: { className?: string }) {
  return <Image src="/kotagede-jewellery-logo-dashboard.png" alt="Kotagede Jewellery" width={480} height={397} sizes="(min-width: 1536px) 224px, 208px" unoptimized className={`${className ?? ""} object-contain`} />;
}
