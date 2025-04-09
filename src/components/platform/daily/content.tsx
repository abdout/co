'use client'

import { useState, useEffect, useRef } from 'react'
import {
  ColumnDef,
  flexRender,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { useFilter } from './filter'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { Icon } from '@iconify/react'
import { useModal } from '@/components/atom/modal/context'
import Create from '@/components/platform/daily/create'
import Modal from '@/components/atom/modal/modal'
import { syncTasksWithDailies } from './actions'
import { toast } from 'sonner'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onTasksChange?: () => void
  onRowClick?: (row: TData, event: React.MouseEvent<HTMLElement>) => void
}

export function Content<TData, TValue>({
  columns,
  data,
  onTasksChange,
  onRowClick
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    priority: false,
    blockers: false,
    plannedTomorrow: false
  })
  const [rowSelection, setRowSelection] = useState({})
  const [page, setPage] = useState(0)
  const [syncing, setSyncing] = useState(false)
  const loadMoreRef = useRef(null)

  const PAGE_SIZE = 20

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const statusOptions = useFilter('status')
  const priorityOptions = useFilter('priority')
  const projectOptions = useFilter('project')
  const statusColumn = table.getColumn('status')
  const priorityColumn = table.getColumn('priority')
  const projectColumn = table.getColumn('project')

  useEffect(() => {
    setPage(0)
  }, [table.getFilteredRowModel(), columnFilters, sorting])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const filteredRows = table.getFilteredRowModel().rows
          if ((page + 1) * PAGE_SIZE < filteredRows.length) {
            setPage((prevPage) => prevPage + 1)
          }
        }
      },
      { threshold: 1.0 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current)
      }
    }
  }, [page, table.getFilteredRowModel()])

  const visibleRows = table.getRowModel().rows.slice(0, (page + 1) * PAGE_SIZE)

  const { modal, openModal, closeModal } = useModal()

  const handleCloseModal = () => {
    closeModal()
  }

  const handleSyncWithTasks = async () => {
    try {
      setSyncing(true);
      toast.info('Syncing tasks with dailies...');
      
      const result = await syncTasksWithDailies();
      
      if (result.error) {
        console.error('Failed to sync with tasks:', result.error);
        toast.error('Failed to sync with tasks');
        return;
      }
      
      toast.success('Successfully synced with tasks');
      
      // Fetch updated dailies after sync
      if (onTasksChange) await onTasksChange();
    } catch (error) {
      console.error('Error syncing with tasks:', error);
      toast.error('Error syncing with tasks');
    } finally {
      setSyncing(false);
    }
  };

  // Initial sync on component mount and set up auto-sync interval
  useEffect(() => {
    // Auto-sync with tasks on initial load
    handleSyncWithTasks();
    
    // Set up an interval to sync with tasks every 5 minutes
    const syncInterval = setInterval(() => {
      handleSyncWithTasks();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
    
    // Clean up interval on component unmount
    return () => clearInterval(syncInterval);
  }, []); // Empty dependency array means this runs once on mount

  return (
    <>
      {modal.open && modal.id === null && (
        <Modal 
          content={
            <Create 
              onClose={() => {
                handleCloseModal();
                if (onTasksChange) onTasksChange();
              }} 
            />
          } 
        />
      )}
      
      {/* Filters and Add Daily Report Button */}
      <div className='flex flex-wrap items-center justify-between gap-2 md:gap-4 py-4'>
        <div className='flex flex-wrap items-center gap-2 md:gap-4'>
          {/* Search Input */}
          <Input
            placeholder='Search by task name...'
            value={(table.getColumn('task')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('task')?.setFilterValue(event.target.value)
            }
            className='w-[200px]'
          />

          {/* Mobile filter trigger */}
          <div className='block sm:hidden'>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='ghost'>
                  <Icon icon='mdi:filter' width={24} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Filter Options</DialogTitle>
                <div className='flex flex-col gap-4'>
                  {/* Filters inside modal */}
                  {statusColumn && (
                    <DataTableFacetedFilter
                      column={statusColumn}
                      title='Status'
                      options={statusOptions}
                      onFilterChange={(filterValue) => {
                        statusColumn.setFilterValue(filterValue)
                      }}
                    />
                  )}
                  {projectColumn && (
                    <DataTableFacetedFilter
                      column={projectColumn}
                      title='Project'
                      options={projectOptions}
                      onFilterChange={(filterValue) => {
                        projectColumn.setFilterValue(filterValue)
                      }}
                    />
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        aria-label='Select Columns'
                        variant='outline'
                        className='ml-auto gap-2 reveal'
                      >
                        <MixerHorizontalIcon className='mr-2 size-4' />
                        Columns
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className='capitalize'
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          )
                        })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Desktop filters */}
          <div className='hidden gap-4 sm:flex'>
            {statusColumn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-9 px-3 gap-2 reveal"
                  >
                    <Icon icon="lucide:filter" className="size-3" />
                    Status
                    {!!statusColumn?.getFilterValue() && (
                      <span className="ml-1 rounded-full bg-primary/10 px-1.5 text-xs font-medium">
                        1
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DataTableFacetedFilter
                    column={statusColumn}
                    title='Status'
                    options={statusOptions}
                    onFilterChange={(filterValue) => {
                      statusColumn.setFilterValue(filterValue);
                    }}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {projectColumn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-9 px-3 gap-2 reveal"
                  >
                    <Icon icon="lucide:filter" className="size-3" />
                    Project
                    {!!projectColumn?.getFilterValue() && (
                      <span className="ml-1 rounded-full bg-primary/10 px-1.5 text-xs font-medium">
                        1
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DataTableFacetedFilter
                    column={projectColumn}
                    title='Project'
                    options={projectOptions}
                    onFilterChange={(filterValue) => {
                      projectColumn.setFilterValue(filterValue);
                    }}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Column visibility dropdown */}
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label='Select Columns'
                  variant='outline'
                  className='h-9 px-3 gap-2 reveal'
                >
                  <MixerHorizontalIcon className='size-4' />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className='capitalize'
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sync Button */}
            <div className='pl-2'>
              <Button
                variant="outline"
                className="h-9 px-3 gap-2 reveal"
                onClick={handleSyncWithTasks}
                disabled={syncing}
              >
                <Icon 
                  icon="lucide:refresh-cw" 
                  className={`size-4 ${syncing ? 'animate-spin' : ''}`} 
                />
                {syncing ? 'Syncing...' : 'Sync'}
              </Button>
            </div>

            {/* Add Daily Report Button */}
            <Button 
              variant="outline"
              className="h-9 w-9 rounded-full flex items-center justify-center p-0 mx-1.5"
              onClick={() => openModal(null)}
            >
              <Icon icon="lucide:plus" className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {visibleRows.length ? (
              visibleRows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={(event) => onRowClick && onRowClick(row.original, event)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center border-0'
                >
                  No results found
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell
                ref={loadMoreRef}
                colSpan={columns.length}
                className='p-2 border-0'
              ></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  )
} 