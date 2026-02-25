import React, { useMemo } from 'react';
import { format } from 'date-fns';

export interface DayActivity {
  date: string;
  updateCount: number;
  projectIds: string[];
}

export function formatHeatmapDate(dateStr: string) {
  const date = new Date(dateStr);
  return format(date, 'MMM d, yyyy');
}

export function ActivityHeatmap({
  data,
  selectedDate,
  onSelectDate,
}: {
  data: DayActivity[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}) {
  // Group by week (7 days)
  const weeks = useMemo(() => {
    const result: DayActivity[][] = [];
    for (let i = 0; i < data.length; i += 7) {
      result.push(data.slice(i, i + 7));
    }
    return result;
  }, [data]);

  function getCellLevel(count: number): number {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    return 3;
  }

  // Calculate month labels
  const monthLabels = useMemo(() => {
    const labels: { label: string; offset: number }[] = [];
    let currentMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      // Find the first day of this week
      const firstDay = week[0];
      if (firstDay) {
        const month = new Date(firstDay.date).getMonth();
        if (month !== currentMonth && weekIndex > 0) {
          labels.push({
            label: format(new Date(firstDay.date), 'MMM'),
            offset: weekIndex
          });
          currentMonth = month;
        } else if (currentMonth === -1) {
          currentMonth = month;
        }
      }
    });
    
    return labels;
  }, [weeks]);

  return (
    <div className="mb-6">
      <div className="flex gap-[3px]">
        {/* Row labels */}
        <div className="flex flex-col justify-between text-[10px] text-muted-foreground/50 pr-2 py-[2px] h-[75px]">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>
        {/* Grid */}
        <div className="flex gap-[3px] relative pb-5">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.date}
                  className={`w-2.5 h-2.5 rounded-[2px] transition-colors
                    ${day.updateCount === 0 ? 'bg-white/5' : 
                      getCellLevel(day.updateCount) === 1 ? 'bg-green-500/30' :
                      getCellLevel(day.updateCount) === 2 ? 'bg-green-500/55' : 'bg-green-500/85'}
                    ${day.updateCount > 0 ? 'cursor-pointer hover:ring-1 hover:ring-white/50' : ''}
                    ${selectedDate === day.date ? 'ring-1 ring-white' : ''}`}
                  onClick={() => {
                    if (day.updateCount === 0) return;
                    onSelectDate(selectedDate === day.date ? null : day.date);
                  }}
                  title={`${formatHeatmapDate(day.date)}: ${day.updateCount} updates in ${day.projectIds.length} projects`}
                />
              ))}
            </div>
          ))}
          
          {/* Month labels */}
          {monthLabels.map((ml, i) => (
            <div 
              key={i} 
              className="absolute bottom-0 text-[10px] text-muted-foreground/40"
              style={{ left: `${ml.offset * 13}px` }} 
            >
              {ml.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
