export const SITE_TITLE_QUERY = /* GraphQL */ `
  query SiteTitle {
    generalSettings {
      title
      description
    }
  }
`
