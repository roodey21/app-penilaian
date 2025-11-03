export const getLevelColor = (level) => {
  switch(level) {
    case 'GM': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Leader': return 'bg-amber-100 text-amber-700 border-amber-200';
    default: return 'bg-sky-100 text-sky-700 border-sky-200';
  }
};

export const getStatusBadge = (status) => {
  switch(status) {
    case 'active': return { bg: 'bg-emerald-100 text-emerald-700', label: 'Active' };
    case 'completed': return { bg: 'bg-gray-100 text-gray-700', label: 'Completed' };
    default: return { bg: 'bg-sky-100 text-sky-700', label: 'Upcoming' };
  }
};

export const getRankBadge = (rank) => {
  if (rank === 1) return { bg: 'bg-gradient-to-br from-yellow-400 to-yellow-500', icon: '🥇' };
  if (rank === 2) return { bg: 'bg-gradient-to-br from-gray-300 to-gray-400', icon: '🥈' };
  if (rank === 3) return { bg: 'bg-gradient-to-br from-amber-600 to-amber-700', icon: '🥉' };
  return { bg: 'bg-gray-100', icon: rank };
};

export const calculateNPS = (promoters, detractors, total) => {
  return Math.round(((promoters / total) * 100) - ((detractors / total) * 100));
};
