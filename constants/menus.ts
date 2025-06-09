import type { NavMenu, NavMenuItems } from '~/types/nav'

const baseNavMenu: NavMenu[] = [
  {
    heading: 'Menü',
    items: [
      {
        title: 'Kontrol Paneli',
        icon: 'i-lucide-layout-dashboard',
        link: '/dashboard',
        roles: ['ADMIN', 'USER'],
      },
      {
        title: 'Talepler',
        icon: 'i-lucide-users',
        link: '/leads',
        roles: ['ADMIN', 'USER'],
      },
      {
        title: 'İlanlar',
        icon: 'i-lucide-package',
        link: '/properties',
        roles: ['ADMIN', 'USER'],
      },
      {
        title: 'Alıcılar',
        icon: 'i-lucide-user-search',
        link: '/buyers',
        roles: ['ADMIN', 'USER'],
      },
      {
        title: 'Satıcılar',
        icon: 'i-lucide-user-round-plus',
        link: '/sellers/',
        roles: ['ADMIN', 'CUSTOMER'],
      },
      {
        title: 'Kullanıcı Yönetimi',
        icon: 'i-lucide-user-cog',
        link: '/users',
        roles: ['ADMIN'],
      },
    ],
  },
]

export const navMenuBottom: NavMenuItems[] = []

export function getFilteredMenu(role: 'ADMIN' | 'USER' | null) {
  if (!role)
    return []

  return baseNavMenu
    .map((group) => {
      const newGroup = { ...group }
      newGroup.items = newGroup.items.filter((item) => {
        return !item.roles || item.roles.includes(role)
      })
      return newGroup
    })
    .filter(group => group.items.length > 0)
}

export const navMenu = baseNavMenu
