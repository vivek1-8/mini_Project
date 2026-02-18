import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { cn } from '@/lib/utils';

const StatCard = ({ title, icon: Icon, apiUrl, className }) => {
  const [value, setValue] = useState(null);
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStat = async () => {
      try {
        const response = await axios.get(apiUrl);

        // expected API shape:
        // {
        //   value: number | string,
        //   trend: { value: number, isPositive: boolean }
        // }

        if (isMounted) {
          setValue(response.data.value);
          setTrend(response.data.trend);
        }
      } catch (error) {
        console.error('Failed to fetch stat:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStat();

    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-hover",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <p className="text-3xl font-bold text-foreground">
            {loading ? '—' : value}
          </p>

          {trend && !loading && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-accent" : "text-destructive"
                )}
              >
                {trend.isPositive ? '+' : '-'}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground">
                vs last month
              </span>
            </div>
          )}
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          {Icon && <Icon className="h-6 w-6 text-primary" />}
        </div>
      </div>

      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5" />
    </div>
  );
};

export default StatCard;
