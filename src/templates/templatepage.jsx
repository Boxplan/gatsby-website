import * as React from "react"
import { graphql } from "gatsby"

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
