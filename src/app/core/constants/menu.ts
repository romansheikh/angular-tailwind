import { MenuItem, ProfileMenuItem, UserMenuItem } from '../models/menu';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Base',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Dashboard',
          route: '/dashboard',
          children: [{ label: 'Nfts', route: '/dashboard/nfts' }],
        },
        {
          icon: 'assets/icons/heroicons/outline/lock-closed.svg',
          label: 'Auth',
          route: '/auth',
          children: [
            { label: 'Sign up', route: '/auth/sign-up' },
            { label: 'Sign in', route: '/auth/sign-in' },
            { label: 'Forgot Password', route: '/auth/forgot-password' },
            { label: 'New Password', route: '/auth/new-password' },
            { label: 'Two Steps', route: '/auth/two-steps' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/exclamation-triangle.svg',
          label: 'Errors',
          route: '/errors',
          children: [
            { label: '404', route: '/errors/404' },
            { label: '500', route: '/errors/500' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Components',
          route: '/components',
          children: [{ label: 'Table', route: '/components/table' }],
        },
      ],
    },
    {
      group: 'Collaboration',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/download.svg',
          label: 'Download',
          route: '/download',
        },
        {
          icon: 'assets/icons/heroicons/outline/gift.svg',
          label: 'Gift Card',
          route: '/gift',
        },
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Users',
          route: '/users',
        },
      ],
    },
    {
      group: 'Config',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/cog.svg',
          label: 'Settings',
          route: '/settings',
        },
        {
          icon: 'assets/icons/heroicons/outline/bell.svg',
          label: 'Notifications',
          route: '/gift',
        },
        {
          icon: 'assets/icons/heroicons/outline/folder.svg',
          label: 'Folders',
          route: '/folders',
          children: [
            { label: 'Current Files', route: '/folders/current-files' },
            { label: 'Downloads', route: '/folders/download' },
            { label: 'Trash', route: '/folders/trash' },
          ],
        },
      ],
    },
  ];

  public static userMenu: UserMenuItem[] = [
    { icon: 'assets/icons/heroicons/outline/user.svg', label: 'Exchange', route: '/exchange', selected: false, },
    { icon: 'assets/icons/heroicons/outline/cog.svg', label: 'Our Rates', route: '/our-rates', selected: false, },
    { icon: 'assets/icons/heroicons/outline/question-mark-circle.svg', label: 'Affiliates', route: '/affiliates', selected: false, },
    { icon: 'assets/icons/heroicons/outline/logout.svg', label: 'Reviews', route: '/reviews', selected: false },
    { icon: 'assets/icons/heroicons/outline/logout.svg', label: 'News', route: '/news', selected: false },
    { icon: 'assets/icons/heroicons/outline/logout.svg', label: 'Contact Us', route: '/contact-us', selected: false },
  ];
  

public static Profile_Menu: ProfileMenuItem[] = [
  {
    title: 'My Profile',
    icon: './assets/icons/heroicons/outline/user-circle.svg',
    link: '/profile',
  },
  {
    title: 'My Order',
    icon: './assets/icons/heroicons/outline/order.svg',
    link: '/orders',
  },
  {
    title: 'Settings',
    icon: './assets/icons/heroicons/outline/cog-6-tooth.svg',
    link: '/settings',
  },
  {
    title: 'Log out',
    icon: './assets/icons/heroicons/outline/logout.svg',
    link: '/auth',
  },
];



  public static getMenus(): UserMenuItem[] {
    return this.userMenu;
  }
}
