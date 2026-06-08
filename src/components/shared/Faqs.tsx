

import { useGetFaqsQuery } from "@/redux/service/faqs";
import {
  ChevronDown,
  Package,
} from "lucide-react";
import React from "react";

export const dynamic = "force-dynamic";

const FaqComponent =   () => {

  const {data, isLoading} = useGetFaqsQuery(`page=1&limit=6&status=true`)
  const faqs = data?.data;

  // console.log({faqs});
  

  return (
    <>


      <div className="space-y-4">
        {faqs?.map((item, index) => {
          const Icon = Package;
          const isFirstItem = index === 0;

          return (
            <details
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white/80 hover:bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-500"
              open={isFirstItem}
            >
              {/* Gradient overlay for open state */}
              <div className="absolute inset-0 bg-linear-to-r from-blue-50/50 via-transparent to-purple-50/50 pointer-events-none opacity-0 group-open:opacity-100 transition-opacity duration-500"></div>

              {/* Summary/Trigger */}
              <summary className="relative cursor-pointer list-none px-4 sm:px-8 py-6 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-gray-200 group-open:bg-linear-to-br group-open:from-primary/10 group-open:to-primary/10 group-open:shadow-lg group-open:shadow-blue-500/25 transition-all duration-300">
                      <Icon className="w-6 h-6 text-gray-600 group-open:text-primary transition-colors duration-300" />
                    </div>
                    <h3 className="sm:text-xl font-semibold text-gray-800 group-open:text-gray-900 transition-colors duration-300">
                      {item.title}
                    </h3>
                  </div>

                  <div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-open:bg-primary/10 group-open:text-primary group-open:rotate-180 transition-all duration-300">
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </summary>

              {/* Content */}
              <div className="px-8 pb-8 pt-6 animate-in slide-in-from-top-2 duration-500">
                <div className=" sm:pl-10 md:pl-16">
                  <div className="space-y-4">
                    {item?.contents?.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-gray-600 leading-relaxed text-balance opacity-0 group-open:opacity-100 transition-opacity duration-700"
                        style={{
                          transitionDelay: `${pIndex * 100 + 200}ms`,
                        }}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhanced border effect when open */}
              <div className="absolute inset-0 rounded-2xl border-2 border-primary/10 opacity-0 group-open:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="absolute inset-0 rounded-2xl shadow-xl shadow-blue-500/10 opacity-0 group-open:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </details>
          );
        })}
      </div>

    </>
  );
};

export default FaqComponent;