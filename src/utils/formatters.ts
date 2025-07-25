import { formatDistanceToNow, format } from 'date-fns';

export const formatTimeAgo = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return 'Unknown time';
  }
};

export const formatPublishDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    return 'Unknown date';
  }
};

export const formatEngagement = (number: number): string => {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }
  return number.toString();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const getContentTypeColor = (type: string): string => {
  switch (type) {
    case 'news':
      return 'content-news';
    case 'entertainment':
      return 'content-entertainment';
    case 'social':
      return 'content-social';
    case 'sports':
        return 'content-sports';
    case 'education':
      return 'content-education';
    case 'finance':
      return 'content-finance';
    case 'travel':
      return 'content-travel';
    case 'technology':
    default:
      return 'primary';
  }
};

export const getContentTypeGradient = (type: string): string => {
  switch (type) {
    case 'news':
      return 'bg-gradient-news';
    case 'entertainment':
      return 'bg-gradient-entertainment';
    case 'social':
      return 'bg-gradient-social';
    case 'sports':
      return 'bg-gradient-sports';
    case 'education':
      return 'bg-gradient-education';
    case 'finance':
      return 'bg-gradient-finance';
    case 'travel':
      return 'bg-gradient-travel';
    default:
      return 'bg-gradient-primary';
  }
};