import { render, screen, fireEvent } from "@testing-library/react"
import RightPanel from ".."
import mockData from "../../../data/items.json"
import mockFormData from "../../../data/form.json"

it("Right Panel renders and working correctly ", () => {
  const onUpdateMock = jest.fn()
  render(
    <RightPanel
      data={mockFormData}
      toggle
      selectedRow={mockData.collection.items[0].entity.data}
      onUpdate={onUpdateMock}
    />
  )

  const button = screen.getByText("Submit")
  const knowledgeSelect = screen.getByTestId("KnownErrorTypeId")
  const statusSelect = screen.getByTestId("Status")
  const isPrivateCheckbox = screen.getByTestId("IsPrivate")
  const summaryTextarea = screen.getByTestId("Summary")

  // Label has in document
  expect(screen.getByText("Knowledge Item Type")).toBeInTheDocument()
  expect(screen.getByText("Lifecycle Status")).toBeInTheDocument()
  expect(screen.getByText("Is Private?")).toBeInTheDocument()
  expect(screen.getByText("Summary")).toBeInTheDocument()
  expect(button).toBeInTheDocument()

  // Form elements default values check
  expect(knowledgeSelect).toHaveDisplayValue(["Known Error"])
  expect(statusSelect).toHaveDisplayValue(["Planned"])
  // @ts-ignore
  expect(isPrivateCheckbox.checked).toEqual(false)
  expect(summaryTextarea).toHaveDisplayValue(["Auto Test KI Summary"])

  // Change Form elements
  fireEvent.change(knowledgeSelect, {
    target: { value: 5 }
  })
  fireEvent.change(statusSelect, {
    target: { value: 3 }
  })
  fireEvent.click(isPrivateCheckbox)
  fireEvent.change(summaryTextarea, {
    target: { value: "Auto Test KI Summary with Test" }
  })
  fireEvent.click(button)

  // Check Update data
  expect(onUpdateMock).toHaveBeenCalledWith({
    author: { id: 5280, name: "Horseman, Lennie" },
    createdOn: "2022-04-12T08:30:36.577Z",
    id: 200,
    isPrivate: true,
    nextReviewOn: null,
    number: "AD-223",
    service: null,
    status: { id: 3, name: "Retired" },
    summary: "Auto Test KI Summary with Test",
    type: { id: 5, name: "Advice", prefix: "AD" },
    updatedOn: "2022-04-12T08:30:36.577Z"
  })
})
