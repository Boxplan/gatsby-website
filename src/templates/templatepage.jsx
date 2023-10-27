import * as React from "react"
import { graphql } from "gatsby"
import { BuilderComponent, builder } from "@builder.io/react"

builder.init("0e78fadf34594a87b1bda6eb8d249f7a")

function PageTemplate({ data }) {
  const models = data?.allBuilderModels
  const page = models.page?.content

  return <BuilderComponent model="page" content={page} />
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
