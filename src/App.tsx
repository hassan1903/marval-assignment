import * as React from "react"
import "./App.css"
import DataTable, { EntityType, ItemsType } from "./components/datatable"
import RightPanel from "./components/rightpanel"
import mockData from "./data/items.json"
import mockFormData from "./data/form.json"

const App = () => {
  const [tableData, setTableData] = React.useState<Array<EntityType>>(
    mockData?.collection?.items ?? null
  )
  const [toggle, setToggle] = React.useState(false)
  const [selectedRow, setSelectedRow] = React.useState<ItemsType | null>(null)
  const handleSort = (value: string, sortOrder: string) => {
    if (value && tableData) {
      const sorted = [...tableData].sort((a: any, b: any): number => {
        let elemA = a.entity.data[value]
        let elemB = b.entity.data[value]
        if (elemA === null) return 1
        if (elemB === null) return -1
        if (elemA === null && elemB === null) return 0
        if (typeof elemA === "object") {
          elemA = elemA.name
        }
        if (typeof elemB === "object") {
          elemB = elemB.name
        }
        return (
          elemA.toString().localeCompare(elemB.toString(), "en", {
            numeric: true
          }) * (sortOrder === "ascending" ? 1 : -1)
        )
      })
      setTableData(sorted)
    }
  }
  return (
    <div className="App">
      <div style={{ width: toggle ? "60%" : "100%", maxWidth: toggle ? "60%" : "100%" }}>
        <DataTable
          data={tableData}
          toggle={toggle}
          handleSort={handleSort}
          onRowClick={(item: ItemsType) => {
            setToggle(true)
            setSelectedRow(item)
          }}
        />
      </div>
      <div style={{ flexGrow: 1 }}>
        {toggle && selectedRow ? (
          <RightPanel
            data={mockFormData}
            toggle={toggle}
            selectedRow={selectedRow}
            onUpdate={(formData: ItemsType) => {
              const newTableData = [...tableData]
              const ind = newTableData.findIndex(
                (it: EntityType) => it?.entity?.data?.id == formData?.id
              )
              if (ind > -1) {
                newTableData[ind].entity.data = formData
                newTableData[ind].entity.data.updatedOn = new Date().toISOString()
                setTableData(newTableData)
              }
            }}
          />
        ) : null}
      </div>
    </div>
  )
}

export default App
