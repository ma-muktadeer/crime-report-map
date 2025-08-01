import { AppPermission } from "../../../../softcafe/service/permissioin-store.service";

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  isHidden?: boolean;
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  permission: AppPermission[] | 'DEFAULT';
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  // {
  //   id: 'navigation',
  //   title: 'নেভিগেশন',
  //   type: 'group',
  //   icon: 'icon-group',
  //   permission: [AppPermission.DASHBOARD_VIWER],
  //   children: [
  //     {
  //       id: 'dashboard',
  //       title: 'ড্যাশবোর্ড',
  //       type: 'item',
  //       url: '/dashboard',
  //       permission: [AppPermission.DASHBOARD_VIWER],
  //       icon: 'feather icon-home'
  //     }
  //   ]
  // },
  {
    id: 'admin',
    title: 'অ্যাডমিন',
    type: 'group',
    icon: 'feather icon-box',
    permission: [
      AppPermission.USER_MAKER,
      AppPermission.VIEW_PERMISSION,
      AppPermission.VIEW_ROLE,
      AppPermission.USER_VIEWER,
    ],
    children: [
      {
        id: 'admin-basic',
        title: 'অ্যাডমিন',
        type: 'collapse',
        permission: 'DEFAULT',
        icon: 'feather icon-box',
        children: [
          {
            id: 'user',
            title: 'ব্যবহারকারী যোগ করুন',
            permission: [
              AppPermission.USER_MAKER,
            ],
            type: 'item',
            url: '/admin/profile'
          },
          {
            id: 'user-list',
            title: 'ব্যবহারকারীর তালিকা',
            permission: [
              AppPermission.USER_VIEWER,
            ],
            type: 'item',
            url: '/admin/user-list',
          },

          {
            id: 'permission-list',
            title: 'অনুমতি তালিকা',
            permission: [
              AppPermission.VIEW_PERMISSION,
            ],
            type: 'item',
            url: '/admin/permission-list'
          },
          {
            id: 'role-list',
            title: 'ভূমিকা তালিকা',
            permission: [
              AppPermission.VIEW_ROLE,
            ],
            type: 'item',
            url: '/admin/role-list'
          },
          {
            id: 'add-seat',
            title: 'সংসদীয় আসন যোগ করুন',
            permission: [
              AppPermission.ADD_SEAT,
            ],
            type: 'item',
            url: '/admin/add-seat'
          },
        ]
      }
    ]
  },
  {
    id: 'dgfi_main',
    title: 'ডি জিএফআই',
    type: 'group',
    icon: 'feather icon-box',
    permission: [
      AppPermission.DGFI_MAKER,
      AppPermission.DGFI_ECONOMIC,

    ],
    children: [
      {
        id: 'dgfi_basic',
        title: 'ইনপুট',
        type: 'collapse',
        permission: 'DEFAULT',
        icon: 'feather icon-box',
        children: [
          {
            id: 'dgfi_add',
            title: 'আইনশৃঙ্খলা জনিত ঘটনা',
            permission: [
              AppPermission.DGFI_MAKER,
            ],
            type: 'item',
            url: '/dgfi/add'
          },
          {
            id: 'dgfi_add_rajnoitik',
            title: 'রাজনৈতিক',
            permission: [
              AppPermission.DGFI_MAKER,
            ],
            type: 'item',
            url: '/dgfi/political'
          },
          {
            id: 'dgfi_ecnmic',
            title: 'অর্থনৈতিক',
            permission: [
              AppPermission.DGFI_ECONOMIC,
            ],
            type: 'item',
            url: '/dgfi/economic'
          }
          // {
          //   id: 'dgfi_map',
          //   title: 'মানচিত্র',
          //   permission: 'DEFAULT',
          //   type: 'item',
          //   url: '/dgfi/map'
          // },

        ]
      }
    ]
  },
  {
    id: 'report',
    title: 'রিপোর্ট',
    type: 'group',
    icon: 'feather icon-box',
    permission: [
      AppPermission.TIMELY_REPORT_VIEWER,
      AppPermission.INTERVAL_REPORT_VIEWER,
      AppPermission.COMPARE_REPORT_VIEWER,
      AppPermission.MAP_REPORT_VIEWER,
      AppPermission.ECONOMIC_REPORT_VIEWER,
      AppPermission.TABULAR_REPORT_VIEWER,
      AppPermission.DGFI_VIEWER,
    ],
    children: [
      {
        id: 'report-all',
        title: 'রিপোর্ট',
        type: 'collapse',
        permission: 'DEFAULT',
        icon: 'feather icon-box',
        children: [
          {
            id: 'dgfi_list',
            title: 'কর্মকান্ড (রাজনৈতিক/অপরাধ)',
            permission: [
              AppPermission.DGFI_VIEWER,
            ],
            type: 'item',
            url: '/dgfi/list'
          },
          {
            id: 'report-timely',
            title: 'টাইমলি রিপোর্ট',
            permission: [
              AppPermission.TIMELY_REPORT_VIEWER,
            ],
            type: 'item',
            url: '/report/timely'
          },
          {
            id: 'report-interval',
            title: 'ইন্টারভ্যাল রিপোর্ট',
            permission: [
              AppPermission.INTERVAL_REPORT_VIEWER,
            ],
            type: 'item',
            url: '/report/interval'
          },
          {
            id: 'report-compare',
            title: 'কম্পেয়ার রিপোর্ট',
            permission: [
              AppPermission.COMPARE_REPORT_VIEWER,
            ],
            type: 'item',
            url: '/report/compare'
          },
          {
            id: 'report-ecnmc',
            title: 'অর্থনৈতিক রিপোর্ট',
            permission: [
              AppPermission.ECONOMIC_REPORT_VIEWER,
            ],
            type: 'item',
            url: '/report/economic'
          },
          {
            id: 'report-tabular',
            title: 'ট্যাবুলার রিপোর্ট',
            permission: [
              AppPermission.TABULAR_REPORT_VIEWER,
            ],
            type: 'item',
            url: '/report/tabular'
          },
          {
            id: 'report-map',
            title: 'মানচিত্র রিপোর্ট',
            permission: [
              AppPermission.MAP_REPORT_VIEWER,
            ],
            type: 'item',
            url: '/report/map'
          },


        ]
      },
    ]
  },

  {
    id: 'extra-uri',
    title: 'Extra URL',
    type: 'group',
    isHidden: true,
    icon: 'icon-group',
    permission: 'DEFAULT',
    children: [
      {
        id: 'bank-view',
        isHidden: true,
        title: 'Bank View',
        type: 'item',
        url: '/admin/bank-view',
        permission: 'DEFAULT',
        icon: 'feather icon-home'
      },
      {
        id: 'mng-role',
        isHidden: true,
        title: 'রোল ব্যবস্থাপনা',
        type: 'item',
        url: '/admin/manage-role',
        permission: 'DEFAULT',
        icon: 'feather icon-home'
      }

    ]
  },
];
