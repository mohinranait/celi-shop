"use client";

import { Input } from "@/components/ui/input";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";

type Props = {
  setParams: Dispatch<SetStateAction<string>>;
};

const Filters = ({ setParams }: Props) => {
  const [status, setStatus] = useState<"all" | "true" | "false">("all");
  const [search, setSearch] = useState("");
 const [date, setDate] = React.useState<Date>()

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const params = new URLSearchParams();

    //  search (debounced)
    if (debouncedSearch) {
      params.append("search", debouncedSearch);
    }

  
    if (status !== "all") {
      params.append("status", status);
    }

    
    if (date) {
      params.append("date", format(date, "yyyy-MM-dd"));
    }

    setParams(params.toString());
  }, [status, debouncedSearch, setParams,date]);

  return (
    <div className="flex gap-4">
      <Input
        type="search"
        placeholder="Search..."
        value={search}
        className="max-w-sm"
        onChange={(e) => setSearch(e.target.value)}
      />

      <Select value={status} onValueChange={(value) => setStatus(value as 'all' | 'true'|'false')}>
        <SelectTrigger className="w-60">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="w-60 justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          <CalendarIcon />
          {date ? format(date, "dd MMM, yyyy") : <span>Pick Created Date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
    </div>
  );
};

export default Filters;