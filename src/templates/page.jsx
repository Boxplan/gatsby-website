import * as React from "react"
import { graphql } from "gatsby"
import { BuilderComponent, builder, Builder } from "@builder.io/react"

builder.init("0e78fadf34594a87b1bda6eb8d249f7a")

function MyButton(props) {
  return <button href={props.link}>{props.content}</button>
}

function DoctorDetails(props) {
  return (
    <section
      style={{ display: "grid", gridTemplateColumns: "1fr", rowGap: "12px" }}
    >
      <h1 style={{ margin: "0px" }}>{props.headerLabel}</h1>
      <section style={{ display: "flex", gap: "12px" }}>
        <img
          style={{ width: "24%" }}
          src={props.mediaUrl}
          alt={props.altName}
        />
        <div>
          <p>{props.details}</p>
          <button
            style={{
              border: "none",
              borderRadius: "4px",
              boxShadow: "0px 0px 12px 0px #999",
              width: "100%",
              cursor: "pointer",
              padding: "12px",
              background: "#000",
              color: "#fff",
            }}
          >
            {props.btnName}
          </button>
        </div>
      </section>
    </section>
  )
}

Builder.registerComponent(DoctorDetails, {
  name: "DoctorDetails",
  inputs: [
    // 'name' is the name of your prop
    { name: "headerLabel", type: "text" },
    { name: "details", type: "text" },
    { name: "btnName", type: "text" },
    { name: "altName", type: "text" },
    { name: "mediaUrl", type: "url" },
  ],
})

function PageTemplate({ data }) {
  const models = data?.allBuilderModels
  const page = models.page?.content
  const searchParams = new URLSearchParams(window.location.search)

  const [apiEndpointDat, setApiEndPointData] = React.useState({})
  const [loader, setLoader] = React.useState(false)

  const getData = async () => {
    const PCMID = searchParams.get("PCMID")
    console.log({ PCMID })
    try {
      const apiData = await fetch(
        `https://devdash.askadmissionsthree.in/ask/feed?bid=1&format=json&PCMID=${PCMID}`
      )
      const apiRes = await apiData.json()

      const customData = {}
      if (
        apiRes?.ExistingPostContentData?.[0]?.PostContentMetaData?.length > 0
      ) {
        for (const key of apiRes?.ExistingPostContentData?.[0]
          ?.PostContentMetaData) {
          const type = key.PostMetaDataTypeId
          if (type === 15) {
            customData.description = key.MetaDataPayload
          }

          if (type === 1) {
            customData.imgUrl = key.MetaDataPayload
          }
          if (type === 28) {
            customData.categoryBtn = key.MetaType
          }
        }
      }
      if (apiRes?.ExistingPostContentData?.[0]) {
        customData.headerLabel =
          apiRes?.ExistingPostContentData?.[0]?.PostContentLabel
      }
      setApiEndPointData(customData)
    } catch (err) {
      console.log({ err })
    }
  }

  React.useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <BuilderComponent
        model="page"
        content={page}
        data={{
          products: apiEndpointDat,
          isLoggedIn: true,
        }}
      />
    </>
  )
}

export default PageTemplate

export const pageQuery = graphql`
  query ($path: String!) {
    allBuilderModels {
      onePage(target: { urlPath: $path }) {
        content
      }
    }
  }
`
