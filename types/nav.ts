export interface NavMenuItems {
  title: string
  link?: string
  icon?: string
  new?: boolean
  children?: NavMenuItems[]
  roles?: string[]
  isMailto?: boolean
  target?: string
}

export interface NavMenu {
  heading: string
  items: NavMenuItems[]
}
