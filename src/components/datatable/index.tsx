import * as React from "react"
import "./index.css"

export type DataType = {
  id: number
  name: string
}

export type ItemType = {
  id: number
  name: string
  prefix: string
}

export interface ItemsType {
  author: DataType
  createdOn: string
  id: number
  isPrivate: boolean
  number: string
  service: DataType | null
  status: DataType
  summary: string
  type: ItemType
  updatedOn: string
}

export interface EntityDataType {
  data: ItemsType
}

export interface EntityType {
  entity: EntityDataType
}

interface DateTimeFormatOptions {
  localeMatcher?: "best fit" | "lookup" | undefined
  weekday?: "long" | "short" | "narrow" | undefined
  era?: "long" | "short" | "narrow" | undefined
  year?: "numeric" | "2-digit" | undefined
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined
  day?: "numeric" | "2-digit" | undefined
  hour?: "numeric" | "2-digit" | undefined
  minute?: "numeric" | "2-digit" | undefined
  second?: "numeric" | "2-digit" | undefined
  timeZoneName?: "long" | "short" | undefined
  formatMatcher?: "best fit" | "basic" | undefined
  hour12?: boolean | undefined
  timeZone?: string | undefined
}

interface PropsType {
  data: Array<EntityType>
  toggle: boolean
  style?: Object
  handleSort: (value: string, sortOrder: string) => void
  onRowClick: (item: ItemsType) => void
}

const DataTable = (props: PropsType) => {
  let columns = [
    { label: "Type", value: "type" },
    { label: "#", value: "number" },
    { label: "Summary", value: "summary" },
    { label: "Private", value: "isPrivate" },
    { label: "Status", value: "status" }
  ]
  if (!props.toggle) {
    columns = [
      ...columns,
      { label: "Service", value: "service" },
      { label: "Author", value: "author" },
      { label: "Created", value: "createdOn" },
      { label: "Updated", value: "updatedOn" }
    ]
  }
  const [sortField, setSortField] = React.useState("")
  const [order, setOrder] = React.useState<
    "none" | "ascending" | "descending" | "other" | undefined
  >(undefined)
  const handleSortingChange = (value: string) => {
    const sortOrder = value === sortField && order === "ascending" ? "descending" : "ascending"
    setSortField(value)
    setOrder(sortOrder)
    props.handleSort(value, sortOrder)
  }

  const renderTableHead = () => {
    return (
      <thead>
        <tr>
          {columns.map(({ label, value }) => {
            return (
              <th
                aria-sort={sortField === value ? order : undefined}
                data-label={value}
                key={value}
                onClick={() => handleSortingChange(value)}
              >
                {label}
              </th>
            )
          })}
        </tr>
      </thead>
    )
  }

  const renderTableBody = (item: ItemsType) => {
    const { author, createdOn, id, isPrivate, number, service, status, summary, type, updatedOn } =
      item
    const options: DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }

    return (
      <tr key={id} onClick={() => props.onRowClick(item)}>
        <td data-label="Type">{type?.name ?? ""}</td>
        <td data-label="Number">{number ?? ""}</td>
        <td data-label="Summary">
          <div className="summaryText">{summary ?? ""}</div>
        </td>
        <td data-label="Private">
          {isPrivate ? <span className="yes">&#10003;</span> : <span className="no">&#10007;</span>}
        </td>
        <td data-label="Status">{status?.name ?? ""}</td>
        {!props.toggle ? <td data-label="Service">{service?.name ?? ""}</td> : null}
        {!props.toggle ? <td data-label="Author">{author?.name ?? ""}</td> : null}
        {!props.toggle ? (
          <td data-label="Created">
            {createdOn ? new Date(createdOn).toLocaleDateString("en-US", options) : ""}
          </td>
        ) : null}
        {!props.toggle ? (
          <td data-label="Updated">
            {updatedOn ? new Date(updatedOn).toLocaleDateString("en-US", options) : ""}
          </td>
        ) : null}
      </tr>
    )
  }

  return (
    <div className="container" style={props.style}>
      <table>
        {renderTableHead()}
        <tbody>
          {props.data?.map((item: EntityType) =>
            item?.entity?.data ? renderTableBody(item.entity.data) : null
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
