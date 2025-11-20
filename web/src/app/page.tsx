"use client";
import { Container } from "@/components/layout/container";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { PromoStripes } from "@/components/home/promo-stripes";
import { SectionProducts } from "@/components/home/section-products";
import { SectionCategories } from "@/components/home/section-categories";
import { TrustBlock } from "@/components/home/trust-block";
import { Newsletter } from "@/components/home/newsletter";

export default function Home() {
  return (
    <main className="py-8">
      <Container>
        <HeroCarousel />
        <PromoStripes />
      </Container>

      <SectionProducts title="Novidades" collectionSlug="novidades" />
      <SectionProducts title="Mais vendidos" collectionSlug="mais-vendidos" />
      <SectionCategories />

      <Container>
        <TrustBlock />
        <Newsletter />
      </Container>
    </main>
  );
}
