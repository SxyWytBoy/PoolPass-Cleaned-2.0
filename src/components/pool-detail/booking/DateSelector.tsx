
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateSelectorProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  isDayAvailable?: (date: Date) => boolean;
}

const DateSelector = ({ selectedDate, setSelectedDate, isDayAvailable }: DateSelectorProps) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="mb-6">
      <span className="block text-sm font-medium text-gray-700 mb-2">Select Date</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setOpen(false);
            }}
            initialFocus
            disabled={(day) => day < new Date(new Date().setHours(0, 0, 0, 0)) || (isDayAvailable ? !isDayAvailable(day) : false)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateSelector;
