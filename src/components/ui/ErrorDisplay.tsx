import { motion } from 'framer-motion';
import { AlertCircle, WifiOff, MapPin, Search, Clock } from 'lucide-react';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  type?: 'network' | 'api' | 'location' | 'search' | 'timeout' | 'general';
}

const errorConfig = {
  network: {
    icon: WifiOff,
    defaultTitle: 'Network Error',
  },
  api: {
    icon: AlertCircle,
    defaultTitle: 'Service Unavailable',
  },
  location: {
    icon: MapPin,
    defaultTitle: 'Location Error',
  },
  search: {
    icon: Search,
    defaultTitle: 'Search Error',
  },
  timeout: {
    icon: Clock,
    defaultTitle: 'Request Timeout',
  },
  general: {
    icon: AlertCircle,
    defaultTitle: 'Error',
  },
};

export function ErrorDisplay({
  title,
  message,
  onRetry,
  type = 'general',
}: ErrorDisplayProps) {
  const config = errorConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-8 text-center"
      role="alert"
    >
      <div className="mb-4 rounded-full bg-red-500/10 p-4">
        <Icon className="h-8 w-8 text-red-400" aria-hidden="true" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">
        {title || config.defaultTitle}
      </h3>
      <p className="mb-6 max-w-md text-sm text-white/70">
        {message}
      </p>
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="rounded-lg bg-white/10 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Retry"
        >
          Retry
        </motion.button>
      )}
    </motion.div>
  );
}