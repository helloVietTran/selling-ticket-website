import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { format } from "date-fns"
import { Filter } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

import { EventCategory, categoryLabels } from "@/constant"

export default function FilterBar() {
  const [, setSearchParams] = useSearchParams()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [location, setLocation] = useState<string>("")
  const [categories, setCategories] = useState<string[]>([])

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (dateRange?.from) params.set("startDate", dateRange.from.toISOString())
    if (dateRange?.to) params.set("endDate", dateRange.to.toISOString())
    if (location) params.set("province", location)
    if (categories.length > 0) params.set("categories", categories.join(","))
    setSearchParams(params)
  }

  const locArray = [
    { id: "all", label: "Toàn quốc" },
    { id: "79", label: "Hồ Chí Minh" },
    { id: "01", label: "Hà Nội" },
    { id: "48", label: "Đà Nẵng" },
  ]

  const resetFilters = () => {
    setDateRange(undefined)
    setLocation("")
    setCategories([])
    setSearchParams({})
  }

  const renderDateLabel = () => {
    if (dateRange?.from && dateRange.to) {
      return `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`
    }
    if (dateRange?.from) {
      return format(dateRange.from, "dd/MM/yyyy")
    }
    return "Hôm nay"
  }

  return (
    <div className="flex justify-between items-end pb-6">
      <h2 className="text-gray-200 text-sm font-semibold">Kết quả tìm kiếm:</h2>
      <div className="flex items-center gap-3">
        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[184px] justify-start text-left cursor-pointer">
              {renderDateLabel()}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Dropdown Filters */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:bg-emerald-500 hover:text-white transition-colors "
            >
              <Filter className="w-4 h-4" />
              Bộ lọc
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-96 space-y-6 p-4">
            <>
              <label className="text-sm font-bold">Vị trí</label>
              <div className="mt-2 space-y-2">
                {locArray.map(({ id, label }) => (
                  <label key={id} htmlFor={id} className="flex items-center gap-2 text-sm ">
                    <input
                      type="radio"
                      id={id}
                      name="location"
                      value={id}
                      checked={location === id}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-4 w-4 border-gray-300 text-emerald-500 focus:ring-emerald-500 "
                    />
                    {label}
                  </label>
                ))}
              </div>
            </>


            <div className="border-t pt-4">
              <label className="text-sm font-bold">Thể loại</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(categoryLabels)
                  .filter(([key]) => key !== EventCategory.ALL) // bỏ "Tất cả"
                  .map(([key, label]) => {
                    const isSelected = categories.includes(key)
                    return (
                      <Button
                        key={key}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        onClick={() =>
                          setCategories(
                            isSelected
                              ? categories.filter((c) => c !== key)
                              : [...categories, key]
                          )
                        }
                        className={`text-sm px-4 py-1 rounded-full ${isSelected
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                          : "border-gray-300 text-black hover:bg-emerald-50"
                          }`}
                      >
                        {label}
                      </Button>
                    )
                  })}
              </div>
            </div>


            {/* Action buttons */}
            <div className="flex justify-between gap-4 border-t pt-4">
              <Button
                variant="outline"
                className="cursor-pointer flex-1 border-emerald-500 text-emerald-500 hover:bg-emerald-50"
                onClick={resetFilters}
              >
                Thiết lập lại
              </Button>
              <Button
                className="cursor-pointer flex-1 bg-emerald-500 hover:bg-emerald-600"
                onClick={applyFilters}
              >
                Áp dụng
              </Button>
            </div>

          </PopoverContent>



        </Popover>
      </div>
    </div>
  )
}
