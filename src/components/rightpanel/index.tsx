import * as React from "react"
import { useSpring, animated } from "react-spring"
import "./index.css"
import type { DataType, ItemsType, ItemType } from "../datatable"

type ValueTextType = {
  value: number
  text: string
}

type FieldSetsItemType = {
  name: string
  displayName: string
  type: string
  xOptions?: Array<ValueTextType>
}

type FieldSetsType = {
  fields: Array<FieldSetsItemType>
  displayName: string
}

type FormsDataType = {
  fieldsets: Array<FieldSetsType>
  name: string
  displayName: string
}

type FormDataType = {
  forms: Array<FormsDataType>
}

interface PropsType {
  data: FormDataType
  selectedRow: ItemsType
  toggle: boolean
  onUpdate: (item: ItemsType) => void
}

const RightPanel = (props: PropsType) => {
  const [formData, setFormData] = React.useState<ItemsType>(props.selectedRow)
  React.useEffect(() => {
    setFormData(props.selectedRow)
  }, [props.selectedRow])

  const styleProps = useSpring({
    from: {
      opacity: props.toggle ? 0 : 1,
      width: props.toggle ? "0" : "100%",
      height: props.toggle ? "0" : "100%",
      backgroundColor: "gray"
    },
    to: {
      opacity: props.toggle ? 1 : 0,
      width: props.toggle ? "100%" : "0",
      height: props.toggle ? "100%" : "0",
      backgroundColor: "gray"
    },
    config: { mass: 1, tension: 170, friction: 26, precision: 0.01, velocity: 0 }
  })

  const onChangeText = (e: any) => {
    const newFormData = { ...formData }
    if (e?.target?.value) {
      newFormData.summary = e.target.value
      setFormData(newFormData)
    }
  }

  const onCheckboxChanged = () => {
    const newFormData = { ...formData }
    newFormData.isPrivate = !formData?.isPrivate
    setFormData(newFormData)
  }

  const onSelectChanged = (e: any) => {
    e.preventDefault()
    const optArr = [
      {
        prefix: "KE",
        id: 1,
        name: "Known Error"
      },
      {
        prefix: "FA",
        id: 2,
        name: "FAQ"
      },
      {
        prefix: "AD",
        id: 5,
        name: "Advice"
      }
    ]

    const statusOptArr = [
      {
        id: 1,
        name: "Published"
      },
      {
        id: 2,
        name: "Planned"
      },
      {
        id: 3,
        name: "Retired"
      }
    ]
    const newFormData = { ...formData }
    switch (e?.target?.name) {
      case "KnownErrorTypeId":
        const foundItem = optArr.find((it: ItemType) => it.id == e.target.value)
        if (foundItem) {
          newFormData.type = foundItem
        }

        newFormData.number =
          formData?.type?.prefix && newFormData?.type?.prefix
            ? newFormData.number?.replace(formData.type.prefix, newFormData.type.prefix)
            : newFormData.number
        break
      case "Status":
        const foundStatusItem = statusOptArr.find((it: DataType) => it.id == e.target.value)
        if (foundStatusItem) {
          newFormData.status = foundStatusItem
        }

        break
      default:
        break
    }
    if (newFormData) {
      setFormData(newFormData)
    }
  }

  const onSubmitData = (e: any) => {
    e.preventDefault()
    props.onUpdate(formData)
  }

  return (
    <animated.div style={styleProps}>
      <form
        action="#"
        onSubmit={onSubmitData}
        key={props.data.forms[0].name}
        id={props.data.forms[0].name}
      >
        <div key={props.data.forms[0].name}>
          {props.data.forms[0].fieldsets[0].fields.map((item: FieldSetsItemType) => {
            const renderForm = []
            switch (item.type) {
              case "select":
                renderForm.push(<label htmlFor={item.name}>{item.displayName}</label>)
                renderForm.push(<br />)
                renderForm.push(<br />)
                renderForm.push(
                  <select
                    form="updateKnowledgeItemBasicDetails"
                    id={item.name}
                    data-testid={item.name}
                    name={item.name}
                    onChange={onSelectChanged}
                    value={
                      item.name === "KnownErrorTypeId" ? formData?.type?.id : formData?.status?.id
                    }
                  >
                    {item.xOptions &&
                      item.xOptions.map((options: ValueTextType) => (
                        <option key={options.text} value={options.value}>
                          {options.text}
                        </option>
                      ))}
                  </select>
                )
                renderForm.push(<br />)
                renderForm.push(<br />)
                break
              case "checkbox":
                renderForm.push(
                  <input
                    type={item.type}
                    data-testid={item.name}
                    id={item.name}
                    name={item.name}
                    onChange={onCheckboxChanged}
                    checked={formData?.isPrivate}
                  />
                )
                renderForm.push(
                  <label className="paddingLeft" htmlFor={item.name}>
                    {item.displayName}
                  </label>
                )
                renderForm.push(<br />)
                renderForm.push(<br />)
                break
              default:
                renderForm.push(<label htmlFor={item.name}>{item.displayName}</label>)
                renderForm.push(<br />)
                renderForm.push(<br />)
                renderForm.push(
                  <textarea
                    id={item.name}
                    data-testid={item.name}
                    name={item.name}
                    value={formData?.summary}
                    onChange={onChangeText}
                  />
                )
                renderForm.push(<br />)
                renderForm.push(<br />)
                break
            }

            return renderForm
          })}
        </div>
        <button>Submit</button>
      </form>
    </animated.div>
  )
}

export default RightPanel
