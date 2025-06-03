import type { NavMenu, NavMenuItems, NavLink, NavGroup, NavSectionTitle } from '~/types/nav'

// Tip koruyucuları
function isNavLink(item: NavLink | NavGroup | NavSectionTitle): item is NavLink {
  return (item as NavLink).link !== undefined;
}

function isNavGroup(item: NavLink | NavGroup | NavSectionTitle): item is NavGroup {
  return (item as NavGroup).children !== undefined;
}

// Temel menü öğeleri
const baseNavMenu: NavMenu[] = [
  {
    heading: 'nav.general', // Genel
    items: [
      {
        title: 'nav.dashboard', // Ana Panel (Dashboard)
        icon: 'i-lucide-layout-dashboard',
        link: '/dashboard/',
      },
      {
        title: 'nav.realEstateListings', // Emlak İlanları
        icon: 'i-lucide-building-2',
        link: '/real-estate/',
      },
      {
        title: 'nav.myEmails', // E-postalarım (Bildirimler/Gelen Kutusu)
        icon: 'i-lucide-mail',
        link: '/email/', // Bu sayfa daha sonra detaylandırılacak
      },
      {
        title: 'nav.users', // Kullanıcılar (Admin için)
        icon: 'i-lucide-users',
        link: '/users/',
        // role: ['ADMIN'] // Örnek rol kısıtlaması
      },
    ],
  },
  {
    heading: 'nav.myProfile', // Profilim
    items: [
      {
        title: 'nav.buyerPreferences', // Alıcı Tercihlerim
        icon: 'i-lucide-sliders-horizontal',
        link: '/my-profile/preferences/',
        // role: ['BUYER', 'ADMIN'] // Örnek rol
      },
      {
        title: 'nav.matchedListings', // Eşleşen İlanlar
        icon: 'i-lucide-list-checks',
        link: '/my-profile/matched-listings/',
        // role: ['BUYER', 'ADMIN']
      },
      // {
      //   title: 'nav.myListings', // İlanlarım (Satıcılar için)
      //   icon: 'i-lucide-list-ordered',
      //   link: '/my-profile/listings/',
      //   // role: ['SELLER', 'ADMIN']
      // },
    ]
  },
  {
    heading: 'nav.pages', // Diğer Sayfalar
    items: [
      {
        title: 'nav.authentication',
        icon: 'i-lucide-lock-keyhole-open',
        children: [
          {
            title: 'nav.login',
            icon: 'i-lucide-circle',
            link: '/login',
          },
          // Diğer auth linkleri (register, forgot-password) eklenebilir
        ],
      },
      {
        title: 'nav.errors',
        icon: 'i-lucide-triangle-alert',
        children: [
          {
            title: '401 - Unauthorized',
            icon: 'i-lucide-circle',
            link: '/401',
          },
          {
            title: '404 - Not Found',
            icon: 'i-lucide-circle',
            link: '/404',
          },
          {
            title: '500 - Internal Server Error',
            icon: 'i-lucide-circle',
            link: '/500',
          },
        ],
      },
      {
        title: 'nav.settings',
        icon: 'i-lucide-settings',
        children: [
          {
            title: 'Profile',
            icon: 'i-lucide-circle',
            link: '/settings/profile',
          },
          {
            title: 'Account',
            icon: 'i-lucide-circle',
            link: '/settings/account',
          },
          {
            title: 'Appearance',
            icon: 'i-lucide-circle',
            link: '/settings/appearance',
          },
        ],
      },
    ],
  },
  // Components bölümü şimdilik kaldırıldı.
]

// Alt menü öğeleri
export const navMenuBottom: NavMenuItems = [
  {
    title: 'nav.settings',
    icon: 'i-lucide-settings',
    link: '/settings/profile',
  },
  // {
  //   title: 'nav.help',
  //   icon: 'i-lucide-help-circle',
  //   link: '/help',
  // },
]

// Kullanıcı rollerine göre menüyü filtreleme fonksiyonu
// Bu fonksiyonun iç mantığı daha sonra portfoyAI rollerine göre detaylıca düzenlenecektir.
export function getFilteredMenu(role: 'ADMIN' | 'CUSTOMER' | 'BUYER' | 'SELLER' | 'AGENT' | null, isDefault: boolean = false) {
  if (isDefault || !role) {
    return baseNavMenu.filter(group => 
        group.heading === 'nav.general' || 
        group.heading === 'nav.pages'
    ).map(group => {
        const newGroup = { ...group, items: [...group.items] }; // Kopyasını alarak çalışalım
        if (newGroup.heading === 'nav.general') {
            newGroup.items = newGroup.items.filter(item => 
                isNavLink(item) && (item.link === '/dashboard/' || item.link === '/real-estate/')
            );
        }
        if (newGroup.heading === 'nav.pages') {
            newGroup.items = newGroup.items.filter(item => 
                isNavGroup(item) && (item.title === 'nav.authentication' || item.title === 'nav.errors')
            ); // Burada NavGroup'ları filtreliyoruz, içindeki NavLink'ler olduğu gibi kalır.
        }
        return newGroup;
    }).filter(group => group.items.length > 0); // Boş grupları kaldır
  }

  const filteredMenu: NavMenu[] = JSON.parse(JSON.stringify(baseNavMenu));

  if (role === 'BUYER') {
    return filteredMenu.filter(group => 
        group.heading === 'nav.general' || 
        group.heading === 'nav.myProfile' ||
        group.heading === 'nav.pages'
    ).map(group => {
        const newGroup = { ...group, items: [...group.items] }; // Kopyasını alarak çalışalım
        if (newGroup.heading === 'nav.general') {
            newGroup.items = newGroup.items.filter(item => 
                isNavLink(item) && (item.link === '/dashboard/' || item.link === '/real-estate/' || item.link === '/email/')
            );
        }
        // myProfile için özel bir filtreleme gerekirse eklenebilir (örn: myListings'i çıkarma, zaten base menüde yok)
        return newGroup;
    }).filter(group => group.items.length > 0); // Boş grupları kaldır
  } else if (role === 'ADMIN') {
    return filteredMenu; // Admin her şeyi görür
  }
  // Diğer roller (SELLER, AGENT) için benzer mantık eklenebilir
  
  // Varsayılan olarak (tanımsız rol veya yukarıdakilere uymayan rol için) kısıtlı bir menü gösterelim
    return baseNavMenu.filter(group => 
        group.heading === 'nav.general' || 
        group.heading === 'nav.pages'
    ).map(group => {
        const newGroup = { ...group, items: [...group.items] };
        if (newGroup.heading === 'nav.general') {
            newGroup.items = newGroup.items.filter(item => 
                isNavLink(item) && (item.link === '/dashboard/' || item.link === '/real-estate/')
            );
        }
        if (newGroup.heading === 'nav.pages') {
            newGroup.items = newGroup.items.filter(item => 
                isNavGroup(item) && (item.title === 'nav.authentication' || item.title === 'nav.errors')
            );
        }
        return newGroup;
    }).filter(group => group.items.length > 0);
}

// Diğer menü veya sabitler buraya eklenebilir.
