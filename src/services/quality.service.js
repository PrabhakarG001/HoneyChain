/**
 * Honey Purity Index & Quality Score Calculator Service
 */
export const qualityService = {
  calculatePurityScore(labData = {}) {
    const {
      pollenCount = 12500,  // grains per gram
      c4Sugar = 0,           // percentage (0-100%)
      hmfLevel = 15,          // mg/kg
      moisture = 17.5,        // percentage (10-30%)
    } = labData;

    let pollenScore = 100;
    if (pollenCount < 5000) pollenScore = 50;
    else if (pollenCount < 10000) pollenScore = 75;
    else if (pollenCount < 15000) pollenScore = 90;

    let c4Score = 100;
    if (c4Sugar > 7) c4Score = 0; // Failed adulteration threshold
    else if (c4Sugar > 3) c4Score = 50;
    else if (c4Sugar > 1) c4Score = 85;

    let hmfScore = 100;
    if (hmfLevel > 80) hmfScore = 0;
    else if (hmfLevel > 40) hmfScore = 50;
    else if (hmfLevel > 20) hmfScore = 85;

    let moistureScore = 100;
    if (moisture > 21 || moisture < 14) moistureScore = 40;
    else if (moisture > 19) moistureScore = 75;
    else if (moisture >= 15 && moisture <= 18.5) moistureScore = 100;

    // Weighted Overall Index Calculation
    const overallScore = Math.round(
      pollenScore * 0.25 +
      c4Score * 0.35 +
      hmfScore * 0.20 +
      moistureScore * 0.20
    );

    const isPassed = c4Sugar <= 7 && hmfLevel <= 40 && moisture <= 20;

    let grade = 'Grade A Pure';
    if (!isPassed || overallScore < 60) grade = 'Non-Compliant';
    else if (overallScore < 85) grade = 'Grade B Standard';

    return {
      overallScore,
      isPassed,
      grade,
      breakdown: {
        pollenScore,
        c4Score,
        hmfScore,
        moistureScore
      },
      labData: {
        pollenCount,
        c4Sugar,
        hmfLevel,
        moisture
      },
      calculatedAt: new Date().toISOString()
    };
  }
};
