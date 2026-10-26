import React from 'react';

export type TitleItemKey =
  | 'pioneer_certificate'
  | 'adventure_journal'
  | 'adventure_scrap'
  | 'travelers_note';

interface TitleItemSvgProps {
  itemKey: TitleItemKey | string;
  className?: string;
  size?: number;
}

export default function TitleItemSvg({ itemKey, className = 'w-10 h-10', size }: TitleItemSvgProps) {
  const normalizedKey = itemKey.toLowerCase().replace(/[\s-]/g, '_');

  const widthAttr = size ? { width: size, height: size } : {};

  switch (normalizedKey) {
    /* ========================================================
     * 1. Pioneer Certificate (ระดับส้มทอง / Gold Tier)
     * Certificate diploma card + Golden medal with star & red ribbon
     * ======================================================== */
    case 'pioneer_certificate':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...widthAttr}
        >
          <defs>
            <linearGradient id="pioneerGoldFrame" x1="6" y1="12" x2="58" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE047" />
              <stop offset="0.3" stopColor="#F59E0B" />
              <stop offset="0.7" stopColor="#D97706" />
              <stop offset="1" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="pioneerCardBg" x1="10" y1="16" x2="54" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#FEF3C7" />
            </linearGradient>
            <linearGradient id="pioneerMedalGrad" x1="38" y1="6" x2="58" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEF08A" />
              <stop offset="0.5" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="pioneerRibbonGrad" x1="36" y1="14" x2="60" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EF4444" />
              <stop offset="1" stopColor="#991B1B" />
            </linearGradient>
            <filter id="pioneerShadow" x="4" y="10" width="56" height="52" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#78350F" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Ribbon Tails behind medal & card */}
          <g filter="url(#pioneerShadow)">
            <path d="M42 22 L36 38 L43 35 L47 38 L48 24 Z" fill="url(#pioneerRibbonGrad)" />
            <path d="M52 20 L58 36 L52 33 L48 36 L49 22 Z" fill="#B91C1C" />

            {/* Certificate Outer Golden Frame */}
            <rect x="8" y="14" width="46" height="42" rx="4" fill="url(#pioneerGoldFrame)" stroke="#78350F" strokeWidth="1" />
            {/* Inner Blue Border */}
            <rect x="11" y="17" width="40" height="36" rx="2.5" fill="#2563EB" stroke="#1D4ED8" strokeWidth="0.75" />
            {/* Inner Parchment Card */}
            <rect x="13" y="19" width="36" height="32" rx="1.5" fill="url(#pioneerCardBg)" />
          </g>

          {/* Certificate Content: Photo Frame on Left */}
          <rect x="16" y="23" width="14" height="17" rx="1" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.75" />
          <path d="M17 38 L22 30 L26 35 L28 32 L30 38 Z" fill="#94A3B8" fillOpacity="0.7" />

          {/* Certificate Content: Text Lines on Right */}
          <line x1="33" y1="24" x2="45" y2="24" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="33" y1="28" x2="44" y2="28" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="33" y1="32" x2="42" y2="32" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />

          {/* Red Verification Stamp Box at Bottom Right */}
          <rect x="33" y="37" width="12" height="9" rx="1" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1" strokeDasharray="1.5 1" />
          <path d="M35 41.5 H43 M37 39 V44 M41 39 V44" stroke="#DC2626" strokeWidth="0.9" strokeLinecap="round" />

          {/* Golden Corner Studs */}
          <circle cx="10.5" cy="16.5" r="1.5" fill="#FEF08A" stroke="#B45309" strokeWidth="0.5" />
          <circle cx="51.5" cy="16.5" r="1.5" fill="#FEF08A" stroke="#B45309" strokeWidth="0.5" />
          <circle cx="10.5" cy="53.5" r="1.5" fill="#FEF08A" stroke="#B45309" strokeWidth="0.5" />
          <circle cx="51.5" cy="53.5" r="1.5" fill="#FEF08A" stroke="#B45309" strokeWidth="0.5" />

          {/* Ribbon Neck Hanger (Top) */}
          <path d="M44 8 L40 18 L54 18 L50 8 Z" fill="#B45309" stroke="#78350F" strokeWidth="0.8" />
          <path d="M45 8 L43 18 L51 18 L49 8 Z" fill="#F59E0B" />

          {/* Star Medal Base (Outer Gold Ring) */}
          <circle cx="47" cy="18" r="9.5" fill="url(#pioneerMedalGrad)" stroke="#78350F" strokeWidth="1.2" />
          {/* Medal Red Center */}
          <circle cx="47" cy="18" r="7" fill="#DC2626" stroke="#FEF08A" strokeWidth="0.8" />
          {/* Golden Star in Center */}
          <polygon
            points="47,12.5 49,16.5 53.5,16.8 50,19.8 51.2,24 47,21.5 42.8,24 44,19.8 40.5,16.8 45,16.5"
            fill="#FEF08A"
            stroke="#CA8A04"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />

          {/* Glint & Sparkles */}
          <path d="M12 12 L13.5 15 L15 12 L13.5 9 Z" fill="#FFFFFF" />
          <circle cx="13.5" cy="12" r="1.5" fill="#FEF08A" />
          <path d="M57 26 L58.5 29 L60 26 L58.5 23 Z" fill="#FFFFFF" />
          <circle cx="58.5" cy="26" r="1.2" fill="#FEF08A" />
        </svg>
      );

    /* ========================================================
     * 2. Adventure Journal (ระดับม่วง / Purple Tier)
     * Open magical journal book + Golden corners + Fresh green leaf
     * ======================================================== */
    case 'adventure_journal':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...widthAttr}
        >
          <defs>
            <linearGradient id="journalCoverGrad" x1="8" y1="22" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B45309" />
              <stop offset="0.5" stopColor="#78350F" />
              <stop offset="1" stopColor="#451A03" />
            </linearGradient>
            <linearGradient id="journalPageGrad" x1="12" y1="20" x2="52" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.6" stopColor="#FEF9C3" />
              <stop offset="1" stopColor="#FDE68A" />
            </linearGradient>
            <linearGradient id="journalLeafGrad" x1="28" y1="14" x2="36" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#86EFAC" />
              <stop offset="0.4" stopColor="#22C55E" />
              <stop offset="1" stopColor="#15803D" />
            </linearGradient>
            <linearGradient id="journalGoldCorner" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#FDE047" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>
            <filter id="journalShadow" x="4" y="16" width="56" height="44" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="3.5" stdDeviation="2.5" floodColor="#3B0764" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Orange Bookmark Ribbon at Bottom */}
          <path d="M30 46 L32 57 L35 53 L38 57 L38 46 Z" fill="#EA580C" stroke="#9A3412" strokeWidth="0.8" />

          {/* Book Leather Cover (Backing) */}
          <g filter="url(#journalShadow)">
            <path
              d="M7 26 C7 24 10 22 20 22 C28 22 31 24 32 26 C33 24 36 22 44 22 C54 22 57 24 57 26 L56 50 C56 52 52 54 44 54 C36 54 33 51 32 51 C31 51 28 54 20 54 C12 54 8 52 8 50 Z"
              fill="url(#journalCoverGrad)"
              stroke="#291003"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Page Block Thickness (Edges) */}
            <path
              d="M9 48 C15 51 25 51 31 49 L31 47 C25 49 15 49 9 46 Z"
              fill="#D97706"
              stroke="#78350F"
              strokeWidth="0.5"
            />
            <path
              d="M55 48 C49 51 39 51 33 49 L33 47 C39 49 49 49 55 46 Z"
              fill="#D97706"
              stroke="#78350F"
              strokeWidth="0.5"
            />

            {/* Left Page (Curved Open Sheet) */}
            <path
              d="M10 24 C18 22 27 22 31.5 25 L31.5 48 C27 46 18 46 10 48 Z"
              fill="url(#journalPageGrad)"
              stroke="#B45309"
              strokeWidth="0.8"
            />
            {/* Right Page (Curved Open Sheet) */}
            <path
              d="M54 24 C46 22 37 22 32.5 25 L32.5 48 C37 46 46 46 54 48 Z"
              fill="url(#journalPageGrad)"
              stroke="#B45309"
              strokeWidth="0.8"
            />
          </g>

          {/* Left Page Content: Sketch / Illustration Frame */}
          <rect x="13" y="27" width="14" height="10" rx="1" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.6" strokeDasharray="1.5 1" />
          <path d="M14 35 L18 29 L21 33 L23 31 L26 35 Z" fill="#D97706" fillOpacity="0.6" />
          {/* Left Page Content: Text Lines */}
          <line x1="13" y1="40" x2="27" y2="40" stroke="#B45309" strokeWidth="1" strokeLinecap="round" />
          <line x1="13" y1="43" x2="25" y2="43" stroke="#B45309" strokeWidth="1" strokeLinecap="round" />

          {/* Right Page Content: Text Paragraph Lines */}
          <line x1="37" y1="28" x2="51" y2="28" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="37" y1="32" x2="50" y2="32" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
          <line x1="37" y1="36" x2="48" y2="36" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
          <line x1="37" y1="40" x2="49" y2="40" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
          <line x1="37" y1="44" x2="45" y2="44" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />

          {/* Golden Corner Guards */}
          <path d="M7 26 L12 24 L10 29 Z" fill="url(#journalGoldCorner)" stroke="#78350F" strokeWidth="0.5" />
          <path d="M57 26 L52 24 L54 29 Z" fill="url(#journalGoldCorner)" stroke="#78350F" strokeWidth="0.5" />
          <path d="M8 50 L13 52 L9 47 Z" fill="url(#journalGoldCorner)" stroke="#78350F" strokeWidth="0.5" />
          <path d="M56 50 L51 52 L55 47 Z" fill="url(#journalGoldCorner)" stroke="#78350F" strokeWidth="0.5" />

          {/* Center Book Spine Line */}
          <line x1="32" y1="24.5" x2="32" y2="49" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />

          {/* Fresh Green Leaf in the center fold */}
          <g filter="drop-shadow(0 2px 3px rgba(21, 128, 61, 0.45))">
            {/* Leaf Body */}
            <path
              d="M32 38 C32 38 27 30 28 22 C29 16 32 14 32 14 C32 14 35 16 36 22 C37 30 32 38 32 38 Z"
              fill="url(#journalLeafGrad)"
              stroke="#15803D"
              strokeWidth="1"
            />
            {/* Center Leaf Vein */}
            <path d="M32 15 L32 36" stroke="#86EFAC" strokeWidth="1" strokeLinecap="round" />
            <path d="M32 22 L34.5 20 M32 26 L35 24 M32 30 L34 29" stroke="#86EFAC" strokeWidth="0.8" strokeLinecap="round" />
          </g>

          {/* Sparkles */}
          <path d="M21 16 L22 18 L23 16 L22 14 Z" fill="#FDE047" />
          <path d="M48 18 L49.5 20.5 L51 18 L49.5 15.5 Z" fill="#FDE047" />
        </svg>
      );

    /* ========================================================
     * 3. Adventure Scrap (ระดับฟ้า / Blue Tier)
     * Weathered torn scrap sheet + Photo attachment + Star paperclip
     * ======================================================== */
    case 'adventure_scrap':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...widthAttr}
        >
          <defs>
            <linearGradient id="scrapPaperGrad" x1="14" y1="10" x2="52" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.4" stopColor="#FEFCE8" />
              <stop offset="0.8" stopColor="#FEF3C7" />
              <stop offset="1" stopColor="#FDE68A" />
            </linearGradient>
            <linearGradient id="scrapPhotoGrad" x1="18" y1="16" x2="42" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F8FAFC" />
              <stop offset="1" stopColor="#E2E8F0" />
            </linearGradient>
            <filter id="scrapShadow" x="8" y="8" width="48" height="52" filterUnits="userSpaceOnUse">
              <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodColor="#0369A1" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Main Paper Scrap with Torn Jagged Bottom */}
          <g filter="url(#scrapShadow)">
            <path
              d="M16 10 C15 10 14 11 14 12 L14 50 L17 48 L20 51 L23 48 L27 52 L31 47 L35 51 L39 48 L43 52 L47 47 L50 51 L50 12 C50 11 49 10 48 10 Z"
              fill="url(#scrapPaperGrad)"
              stroke="#D97706"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </g>

          {/* Polarized Photo Attached on the Paper */}
          <g transform="rotate(-3 29 27)">
            <rect x="18" y="15" width="22" height="19" rx="1.5" fill="url(#scrapPhotoGrad)" stroke="#CBD5E1" strokeWidth="0.8" />
            {/* Photo Inner Image */}
            <rect x="19.5" y="16.5" width="19" height="13" fill="#94A3B8" />
            <path d="M20 28 L25 21 L29 25 L32 22 L38 28 Z" fill="#64748B" />
            <circle cx="35" cy="19.5" r="1.5" fill="#FEF08A" />
          </g>

          {/* Cursive Note Text Lines (Hand-drawn curves) */}
          <path
            d="M18 39 Q21 37.5 25 39 T32 38 T39 39 T44 38"
            stroke="#92400E"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M18 43 Q22 42 27 43.5 T35 42.5 T42 43"
            stroke="#B45309"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M19 47 Q24 45.8 28 47 T36 46"
            stroke="#D97706"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />

          {/* Golden Wire Paperclip at Top-Right */}
          <path
            d="M44 22 L44 11 C44 9 47 9 47 11 L47 23 C47 25 42 25 42 23 L42 13"
            stroke="#D97706"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Round Golden Button with 5-pointed Star on Paperclip */}
          <g filter="drop-shadow(0 1.5px 2px rgba(180, 83, 9, 0.5))">
            <circle cx="45" cy="11" r="5.5" fill="#F59E0B" stroke="#78350F" strokeWidth="0.9" />
            <circle cx="45" cy="11" r="4.2" fill="#FDE047" />
            <polygon
              points="45,8 46.2,10.2 48.5,10.4 46.8,12 47.3,14.2 45,13 42.7,14.2 43.2,12 41.5,10.4 43.8,10.2"
              fill="#D97706"
            />
          </g>

          {/* Paper Fold Creases */}
          <path d="M14 26 L17 28 M47 34 L50 36" stroke="#FDE68A" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );

    /* ========================================================
     * 4. Traveler's Note (ระดับเขียว / Green Tier)
     * Hanging luggage tag / parchment scroll with red string loop
     * ======================================================== */
    case 'travelers_note':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...widthAttr}
        >
          <defs>
            <linearGradient id="noteTagGrad" x1="20" y1="16" x2="48" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.3" stopColor="#FEFCE8" />
              <stop offset="0.7" stopColor="#FEF3C7" />
              <stop offset="1" stopColor="#FDE68A" />
            </linearGradient>
            <linearGradient id="noteStringGrad" x1="28" y1="4" x2="36" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EF4444" />
              <stop offset="0.5" stopColor="#DC2626" />
              <stop offset="1" stopColor="#991B1B" />
            </linearGradient>
            <filter id="noteShadow" x="12" y="6" width="40" height="54" filterUnits="userSpaceOnUse">
              <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodColor="#14532D" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Crimson Red String Loop / Ring at Top */}
          <g filter="drop-shadow(0 1.5px 2px rgba(153, 27, 27, 0.4))">
            {/* String Loop through tag hole */}
            <path
              d="M32 5 C27 5 26 12 28 17 C29 19 32 20 32 20 C32 20 35 19 36 17 C38 12 37 5 32 5 Z"
              stroke="url(#noteStringGrad)"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
            {/* String Knot Detail */}
            <circle cx="32" cy="7" r="1.8" fill="#B91C1C" />
          </g>

          {/* Tag Body with Chamfered / Angled Top Corners */}
          <g filter="url(#noteShadow)">
            <path
              d="M26 16 L38 16 L44 22 L44 54 C44 56 42 57 40 57 L24 57 C22 57 20 56 20 54 L20 22 Z"
              fill="url(#noteTagGrad)"
              stroke="#D97706"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Tag Bottom Curved Edge / Scroll Roll effect */}
            <path
              d="M20 52 C26 55 38 55 44 52 L44 54 C38 57 26 57 20 54 Z"
              fill="#D97706"
              fillOpacity="0.4"
            />
          </g>

          {/* Punch Hole with Reinforcement Ring */}
          <circle cx="32" cy="22" r="3.2" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
          <circle cx="32" cy="22" r="1.8" fill="#0F172A" />

          {/* Front Red String coming through hole */}
          <path d="M31 18 C31 20 32 22 32 23" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />

          {/* Hand-Written Traveler Notes / Wavy Cursive Lines */}
          <path
            d="M25 30 Q28 28.5 32 30 T39 29.5"
            stroke="#92400E"
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M25 36 Q29 34.5 34 36.5 T39 35"
            stroke="#B45309"
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M25 42 Q28 40.5 32 42 T37 41"
            stroke="#D97706"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M26 48 Q29 47 33 48"
            stroke="#D97706"
            strokeWidth="1.1"
            strokeLinecap="round"
            fill="none"
          />

          {/* Subtle Paper Fold Line across tag */}
          <line x1="20" y1="46" x2="44" y2="44" stroke="#FDE68A" strokeWidth="0.8" strokeLinecap="round" />
        </svg>
      );

    default:
      return null;
  }
}
