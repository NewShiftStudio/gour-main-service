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
    sort: 0,
    // color: '',
  },
  {
    name: 'Подтвержден',
    sort: 1,
    // color: '',
  },
  {
    name: 'Ожидается поступление',
    sort: 2,
    // color: '',
  },
  {
    name: 'Ждем оплату',
    sort: 3,
    // color: '',
  },
  {
    name: 'Оплачен',
    sort: 4,
    // color: '',
  },
  {
    name: 'Передан в сборку',
    sort: 5,
    // color: '',
  },
  {
    name: 'Собран',
    sort: 6,
    // color: '',
  },
  {
    name: 'Передан курьеру',
    sort: 7,
    // color: '',
  },
  {
    name: 'Доставлен',
    sort: 8,
    // color: '',
  },
  {
    name: 'Возврат',
    sort: 9,
    // color: '',
  },
  {
    name: 'Отменен',
    sort: 10,
    // color: '',
  },

  {
    name: 'Удален',
    sort: 11,
    // color: '',
  },
];
