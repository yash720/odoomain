const pointsConfig = require('../config/pointsConfig');

function calculatePointsForItem({ item, user, isFirstUpload = false, campaignBonus = null, demandStats = {} }) {
  // 1. Base Category Value
  const baseCategoryValue = pointsConfig.baseCategoryValues[item.category] || 5;

  // 2. Item Quality Score
  let itemQualityScore = 1.0;
  // Image clarity: Assume clear if 1+ image (AI check can be added later)
  if (item.images && item.images.length > 0) itemQualityScore += 0.1;
  // Branded keyword in title/description/brand
  const branded = pointsConfig.brandedKeywords.some(kw =>
    (item.brand && item.brand.toLowerCase().includes(kw.toLowerCase())) ||
    (item.title && item.title.toLowerCase().includes(kw.toLowerCase())) ||
    (item.description && item.description.toLowerCase().includes(kw.toLowerCase()))
  );
  if (branded) itemQualityScore += 0.1;
  // 3+ images
  if (item.images && item.images.length >= 3) itemQualityScore += 0.1;

  // 3. Demand Weight
  let demandWeight = 1.0;
  // Trending category (from config or demandStats)
  if (pointsConfig.trendingCategories[item.category]) {
    demandWeight = pointsConfig.trendingCategories[item.category];
  } else if (demandStats[item.category]) {
    demandWeight = demandStats[item.category];
  }

  // 4. Condition Bonus
  let conditionBonus = 0;
  if (item.condition === 'new' || item.condition === 'like-new' || item.condition === 'excellent') conditionBonus = 3;
  else if (item.condition === 'good') conditionBonus = 2;
  else if (item.condition === 'fair') conditionBonus = 1;

  // 5. Trust Boost
  let trustBoost = 1.0;
  if (user.totalUploads >= 5) trustBoost += 0.2;
  if ((user.spamReports || 0) === 0) trustBoost += 0.3;
  if ((user.rating || 0) >= 4.5) trustBoost += 0.2;

  // 6. First Upload Bonus
  const firstUploadBonus = isFirstUpload ? 5 : 0;

  // 7. Campaign Bonus
  const campaignBonusValue = campaignBonus !== null ? campaignBonus : pointsConfig.defaultCampaignBonus;

  // 8. Penalties
  let penalties = 0;
  if ((user.spamReports || 0) >= 2) penalties += 5;
  if (item.flagged) itemQualityScore *= 0.7;

  // Final Calculation
  let points = (baseCategoryValue * itemQualityScore * demandWeight) + conditionBonus + trustBoost + firstUploadBonus + campaignBonusValue - penalties;
  points = Math.max(1, Math.round(points));

  // Breakdown for transparency
  const breakdown = {
    baseCategoryValue,
    itemQualityScore: Number(itemQualityScore.toFixed(2)),
    demandWeight,
    conditionBonus,
    trustBoost: Number(trustBoost.toFixed(2)),
    firstUploadBonus,
    campaignBonus: campaignBonusValue,
    penalties,
    flagged: !!item.flagged,
    branded,
    imagesCount: item.images ? item.images.length : 0
  };

  return { totalPoints: points, breakdown };
}

module.exports = calculatePointsForItem; 