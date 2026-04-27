import Badge from '../models/Badge.js';

export const seedBadges = async () => {
  try {
    const badges = [
      { name: 'Neural Initiate', icon: 'Zap', minPoints: 100, description: 'Neural synchronization threshold reached.' },
      { name: 'Data Archivist', icon: 'Database', minPoints: 500, description: 'Significant vault contributions detected.' },
      { name: 'Focus Master', icon: 'Target', minPoints: 1000, description: 'Operational efficiency at peak performance.' },
      { name: 'Neural Architect', icon: 'Shield', minPoints: 2500, description: 'Mastery over the focus landscape.' },
      { name: 'Vault Legend', icon: 'Award', minPoints: 5000, description: 'Mythical status in the Focus Vault.' }
    ];

    for (const badge of badges) {
      await Badge.findOneAndUpdate(
        { name: badge.name },
        badge,
        { upsert: true, new: true }
      );
    }
    console.log('✅ Neural Badges synchronized with core.');
  } catch (error) {
    console.error('❌ Badge Seeding Error:', error);
  }
};
