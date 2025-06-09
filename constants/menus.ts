import type { NavMenu, NavMenuItems } from '~/types/nav'

const baseNavMenu: NavMenu[] = [
  {
    heading: 'Menü',
    items: [
      {
        title: 'Anasayfa',
        icon: 'i-lucide-home',
        link: '/',
        roles: ['ADMIN', 'CUSTOMER'],
      },
      {
        title: 'Potansiyel Müşteriler',
        icon: 'i-lucide-inbox',
        link: '/leads/',
        new: true,
        roles: ['ADMIN', 'CUSTOMER'],
      },
      {
        title: 'Alıcılar',
        icon: 'i-lucide-user-round',
        link: '/buyers/',
        roles: ['ADMIN', 'CUSTOMER'],
      },
      {
        title: 'Satıcılar',
        icon: 'i-lucide-user-round-plus',
        link: '/sellers/',
        roles: ['ADMIN', 'CUSTOMER'],
      },
      {
        title: 'Portföy',
        icon: 'i-lucide-building-2',
        link: '/properties/',
        roles: ['ADMIN', 'CUSTOMER'],
      },
      {
        title: 'Kullanıcılar',
        icon: 'i-lucide-users',
        link: '/users/',
        roles: ['ADMIN'],
      },
    ],
  },
]

export const navMenuBottom: NavMenuItems[] = []

export function getFilteredMenu(role: 'ADMIN' | 'CUSTOMER' | 'USER' | null) {
  if (!role) return []

  return baseNavMenu
    .map((group) => {
      group.items = group.items.filter((item) => {
        return !item.roles || (Array.isArray(item.roles) && item.roles.includes(role))
      })
      return group
    })
    .filter(group => group.items.length > 0)
}

export const navMenu = baseNavMenu
