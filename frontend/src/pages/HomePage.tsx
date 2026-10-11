import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { BoutiqueRunningRibbon } from '../components/home/BoutiqueRunningRibbon';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FeaturedCollections } from '../components/home/FeaturedCollections';
import { CraftsmanshipStory } from '../components/home/CraftsmanshipStory';
import { PromotionalBanner } from '../components/home/PromotionalBanner';
import { BrandStory } from '../components/home/BrandStory';
import { Newsletter } from '../components/home/Newsletter';

export const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <BoutiqueRunningRibbon />
      <CategoryGrid />
      <FeaturedCollections />
      <CraftsmanshipStory />
      <PromotionalBanner />
      <BrandStory />
      <Newsletter />
    </div>
  );
};
