import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-1.5 text-xs text-[#716963] py-3 overflow-x-auto whitespace-nowrap">
      <Link to="/" className="hover:text-[#651D32] transition-colors">
        Home
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight size={12} className="text-[#A69A90] flex-shrink-0" />
            {isLast || !item.url ? (
              <span className="text-[#282323] font-medium truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            ) : (
              <Link to={item.url} className="hover:text-[#651D32] transition-colors truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
