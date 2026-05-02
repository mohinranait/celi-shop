"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

//  Generic Column টাইপ
export type Column<T> = {
  title: string;
  dataIndex: keyof T;
  key: string;
  isAction?: boolean;
  render?: (
    value: T[keyof T],
    record: T,
    index: number
  ) => React.ReactNode;
};

//  Props টাইপ
type TableType<T> = {
  columns: Column<T>[];
  dataSource: T[];
  actionWidth?: number | string;
  rowKey?: keyof T;
};

//  Generic Component
const GlobalTable =  <T extends object>({
  columns,
  dataSource,
  actionWidth = 120,
  rowKey,
}: TableType<T>) => {
  return (
    <Table className="custom_table w-full">
      {/* Header */}
      <TableHeader>
        <TableRow className="border-none">
          {columns.map((column) => (
            <TableHead
              key={column.key}
              className="h-10 text-nowrap text-text-title font-semibold"
              style={{
                width: column.isAction ? actionWidth : "auto",
              }}
            >
              {column.title}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      {/* Body */}
      <TableBody>
        {dataSource.length > 0 ? (
          dataSource.map((item, index) => (
            <TableRow
              key={
                rowKey
                  ? String(item[rowKey])
                  : index
              }
              className="bg-background-mist dark:bg-portal-bg hover:bg-muted/50 transition"
            >
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  className="font-medium text-text-gray py-3"
                  style={{
                    width: column.isAction ? actionWidth : "auto",
                  }}
                >
                  {column.render
                    ? column.render(
                        item[column.dataIndex],
                        item,
                        index
                      )
                    : String(item[column.dataIndex] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="text-center py-6 text-gray-400"
            >
              No Data Found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default GlobalTable;