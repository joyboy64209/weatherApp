export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatHour(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    hour12: true,
  });
}

export function formatDay(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export function isNightTime(sunrise: string, sunset: string, checkTime?: string): boolean {
  if (checkTime) {
    // Compare only time-of-day (ignore date) so hourly forecast across days works correctly
    const checkDate = new Date(checkTime);
    const riseDate = new Date(sunrise);
    const setDate = new Date(sunset);

    const checkMinutes = checkDate.getHours() * 60 + checkDate.getMinutes();
    const riseMinutes = riseDate.getHours() * 60 + riseDate.getMinutes();
    const setMinutes = setDate.getHours() * 60 + setDate.getMinutes();

    return checkMinutes < riseMinutes || checkMinutes > setMinutes;
  }
  const now = new Date();
  const sunriseTime = new Date(sunrise);
  const sunsetTime = new Date(sunset);
  return now < sunriseTime || now > sunsetTime;
}

export function getCurrentTimeFormatted(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}