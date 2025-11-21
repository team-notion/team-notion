import { useState } from "react"
import { useReactTable, getCoreRowModel, flexRender, ColumnDef, PaginationState, SortingState, getSortedRowModel, OnChangeFn, } from "@tanstack/react-table";
import { TablePagination } from "../TablePagination";
import Loader from "../ui/Loader/Loader";

export type TransactionTableProps<T extends object> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  pageCount: number;
  pageSize: number;
  pageIndex: number;
  isLoading: boolean;
  onPaginationChange: OnChangeFn<PaginationState>;
  onSortingChange?: (sorting: SortingState) => void;
  totalItems: number;
  title?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonVariant?: 'primary' | 'secondary' | 'danger';
  onButtonClick?: () => void;
};

export function TransactionTable<T extends object>({
  data,
  columns,
  pageCount,
  pageSize,
  pageIndex,
  isLoading,
  onPaginationChange,
  onSortingChange,
  totalItems,
  title = "Transactions history",
  showButton = false,
  buttonText = "Action",
  buttonVariant = 'secondary',
  onButtonClick,
}: TransactionTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const pagination: PaginationState = {
    pageIndex,
    pageSize,
  };

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: onPaginationChange,
    onSortingChange: (updater) => {
      const newSorting = typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);
      onSortingChange?.(newSorting);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  const buttonStyles = {
    primary: "px-5 py-3 text-sm bg-[#FA8F45] text-white rounded-lg hover:bg-[#E87E34] transition-colors font-medium cursor-pointer",
    secondary: "px-5 py-3 text-sm border border-[#FA8F45] text-[#FA8F45] rounded-lg hover:bg-orange-50 transition-colors font-medium cursor-pointer",
    danger: "px-5 py-3 text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium cursor-pointer",
  };

  return (
    <div className="bg-white rounded-lg border border-[#EAECF0] mt-8 w-full overflow-hidden">
      <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between p-6 gap-4'>
        <h2 className="text-lg font-medium text-[#344054] leading-6 font-[Inter]">{title}</h2>
        {showButton && (
          <button onClick={onButtonClick} className={buttonStyles[buttonVariant]} >
            {buttonText}
          </button>
        )}
      </div>
      <div className="overflow-x-auto w-full">
        <div className="min-w-[64rem]">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader type="bars" color="#175CD3" height={40} width={40} />
            </div>
          ) : (
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="text-left items-start justify-start text-[#2B3D5F] border-b border-[#EAECF0]"
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-5 font-semibold lg:min-w-[140px] text-sm"
                        onClick={header.column.getToggleSortingHandler()}
                        style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
                      >
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {/* {header.column.getCanSort() && (
                            <div className="flex flex-col">
                              {header.column.getIsSorted() === "asc" ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <div className="flex flex-col">
                                  <ChevronUp className="h-2 w-2 opacity-30" />
                                  <ChevronDown className="h-2 w-2 opacity-30" />
                                </div>
                              )}
                            </div>
                          )} */}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="border-b border-[#EAECF0]">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="text-left items-start justify-start text-sm font-light text-[#667085] hover:bg-[#EAECF0] border-b border-[#EAECF0] hover:border hover:border-[#EAECF0]"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-5 lg:min-w-[140px]">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-5 text-center text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="px-6 py-4">
        <TablePagination
          currentPage={pageIndex + 1}
          totalPages={pageCount}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          onPageChange={(page) => onPaginationChange({ pageIndex: page - 1, pageSize })}
          onItemsPerPageChange={(size) => onPaginationChange({ pageIndex: 0, pageSize: size })}
        />
      </div>
    </div>
  )
}

export default TransactionTable

