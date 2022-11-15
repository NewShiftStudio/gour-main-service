export function cutUuidFromMoyskladHref(href: string): string {
  const splitedHref = href.split('/');

  return splitedHref[splitedHref.length - 1];
}

export type OrderStatus = {
  name: string;
  sort: number;
  color?: string;
};

export const statuses: OrderStatus[] = [
  {
    name: 'Новый заказ',
    sort: 151,
    // color: '',
  },
  {
    name: 'Подтвержден',
    sort: 151,
    // color: '',
  },
  {
    name: 'Ожидается поступление',
    sort: 152,
    // color: '',
  },
  {
    name: 'Ждем оплату',
    sort: 153,
    // color: '',
  },
  {
    name: 'Оплачен',
    sort: 154,
    // color: '',
  },
  {
    name: 'Передан в сборку',
    sort: 155,
    // color: '',
  },
  {
    name: 'Собран',
    sort: 156,
    // color: '',
  },
  {
    name: 'Передан курьеру',
    sort: 157,
    // color: '',
  },
  {
    name: 'Доставлен',
    sort: 158,
    // color: '',
  },
  {
    name: 'Возврат',
    sort: 159,
    // color: '',
  },
  {
    name: 'Отменен',
    sort: 160,
    // color: '',
  },

  {
    name: 'Удален',
    sort: 161,
    // color: '',
  },
];
