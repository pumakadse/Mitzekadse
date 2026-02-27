import React, { useEffect } from 'react';

// Google AdSense Publisher ID (replace with your actual ID)
const ADSENSE_CLIENT = 'ca-pub-1234567890123456';

// Ad slot component for display ads
export const DisplayAd = ({ slot, format = 'auto', responsive = true, className = '' }) => {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`} data-testid="display-ad">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

// Banner ad for header/footer
export const BannerAd = ({ className = '' }) => {
  return (
    <div className={`banner-ad bg-background-paper border-b border-border py-2 ${className}`} data-testid="banner-ad">
      <div className="max-w-7xl mx-auto px-4">
        <DisplayAd 
          slot="1234567890" 
          format="horizontal" 
          className="min-h-[90px]"
        />
      </div>
    </div>
  );
};

// Sidebar ad for desktop
export const SidebarAd = ({ className = '' }) => {
  return (
    <div className={`sidebar-ad hidden lg:block ${className}`} data-testid="sidebar-ad">
      <div className="sticky top-20">
        <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-1 text-center">Werbung</p>
        <DisplayAd 
          slot="2345678901" 
          format="vertical"
          className="min-h-[250px] bg-background-subtle rounded"
        />
      </div>
    </div>
  );
};

// In-feed ad between content
export const InFeedAd = ({ className = '' }) => {
  return (
    <div className={`in-feed-ad my-4 ${className}`} data-testid="in-feed-ad">
      <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-1 text-center">Werbung</p>
      <DisplayAd 
        slot="3456789012" 
        format="fluid"
        className="min-h-[100px] bg-background-subtle rounded"
      />
    </div>
  );
};

// Match detail ad
export const MatchAd = ({ className = '' }) => {
  return (
    <div className={`match-ad my-6 ${className}`} data-testid="match-ad">
      <div className="card p-4">
        <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-2 text-center">Werbung</p>
        <DisplayAd 
          slot="4567890123" 
          format="rectangle"
          className="min-h-[250px]"
        />
      </div>
    </div>
  );
};

// Placeholder ad for development (shows when AdSense not loaded)
export const PlaceholderAd = ({ type = 'banner', className = '' }) => {
  const sizes = {
    banner: 'h-[90px]',
    rectangle: 'h-[250px]',
    sidebar: 'h-[600px]',
    infeed: 'h-[100px]',
  };

  return (
    <div 
      className={`placeholder-ad ${sizes[type]} bg-background-subtle border border-dashed border-border rounded flex items-center justify-center ${className}`}
      data-testid="placeholder-ad"
    >
      <div className="text-center text-text-tertiary">
        <p className="text-xs uppercase tracking-wide">Werbung</p>
        <p className="text-[10px] mt-1">Ad Space ({type})</p>
      </div>
    </div>
  );
};

export default DisplayAd;
