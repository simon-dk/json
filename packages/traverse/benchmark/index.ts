/* eslint-disable array-callback-return */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Event, Suite } from 'benchmark';

import { Traverse } from '../src/Traverse';

const suite = new Suite('traverse');

const simple = {
  name: 'John Doe',
  age: 30,
};

const nested = {
  name: 'John Doe',
  age: 30,
  address: {
    street: '123 Fake St',
    city: 'Springfield',
    state: 'ZZ',
    zip: '12345',
  },
  pets: [{ cat: 'fluffy', dog: 'spot' }],
  phone: '123-456-7890',
  email: 'john@email.com',
};

const large = {
  id: 1,
  name: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  maidenName: 'Smith',
  age: 30,
  gender: 'male',
  email: 'john@email.com',
  phone: '123-456-7890',
  username: 'atuny0',
  password: '9uQFF1Lh',
  birthDate: '2000-12-25',
  image: 'https://robohash.org/Terry.png?set=set4',
  bloodGroup: 'A-',
  height: 189,
  weight: 75.4,
  eyeColor: 'Green',
  hair: {
    color: 'Black',
    type: 'Strands',
  },
  domain: 'slashdot.org',
  ip: '117.29.86.254',
  address: {
    address: '1745 T Street Southeast',
    city: 'Washington',
    coordinates: {
      lat: 38.867033,
      lng: -76.979235,
    },
    postalCode: '20020',
    state: 'DC',
  },
  macAddress: '13:69:BA:56:A3:74',
  university: 'Capitol University',
  bank: {
    cardExpire: '06/22',
    cardNumber: '50380955204220685',
    cardType: 'maestro',
    currency: 'Peso',
    iban: 'NO17 0695 2754 967',
  },
  company: {
    address: {
      address: '629 Debbie Drive',
      city: 'Nashville',
      coordinates: {
        lat: 36.208114,
        lng: -86.58621199999999,
      },
      postalCode: '37076',
      state: 'TN',
    },
    department: 'Marketing',
    name: "Blanda-O'Keefe",
    title: 'Help Desk Operator',
  },
  ein: '20-9487066',
  ssn: '661-64-2976',
  userAgent:
    'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/12.0.702.0 Safari/534.24',
  crypto: {
    coin: 'Bitcoin',
    wallet: '0xb9fc2fe63b2a6c003f1c324c3bfa53259162181a',
    network: 'Ethereum (ERC20)',
  },
};

suite.add('simple forEach', () => {
  const t = new Traverse(simple);
  t.forEach(() => {});
});

suite.add('nested forEach', () => {
  const t = new Traverse(nested);
  t.forEach(() => {});
});

suite.add('large forEach', () => {
  const t = new Traverse(large);
  t.forEach(() => {});
});

suite.add('simple map', () => {
  const t = new Traverse(simple);
  t.map(() => {});
});

suite.add('nested map', () => {
  const t = new Traverse(nested);
  t.map(() => {});
});

suite.add('large map', () => {
  const t = new Traverse(large);
  t.map(() => {});
});

suite.add('simple map with mutation', () => {
  const t = new Traverse(simple);
  t.map((val, node) => {
    if (node.key === 'name') {
      node.update('Jane Doe');
    }
  });
});

suite.add('nested map with mutation', () => {
  const t = new Traverse(nested);
  t.map((val, node) => {
    if (node.key === 'name') {
      node.update('Jane Doe');
    }
  });
});

suite.add('large map with mutation', () => {
  const t = new Traverse(large);
  t.map((val, node) => {
    if (node.key === 'name') {
      node.update('Jane Doe');
    }
  });
});

suite
  .on('cycle', (event: Event) => {
    console.log(String(event.target));
  })
  .on('complete', () => {
    console.log(`Fastest is ${suite.filter('fastest').map('name')} `);
  })
  .run({ async: true });

// simple forEach x 14,152,843 ops/sec ±0.23% (97 runs sampled)
// nested forEach x 2,847,008 ops/sec ±1.07% (98 runs sampled)
// large forEach x 756,852 ops/sec ±0.15% (98 runs sampled)
// simple map x 1,114,646 ops/sec ±0.22% (99 runs sampled)
// nested map x 414,776 ops/sec ±0.42% (99 runs sampled)
// large map x 127,487 ops/sec ±0.21% (95 runs sampled)
// simple map with mutation x 1,094,734 ops/sec ±0.30% (97 runs sampled)
// nested map with mutation x 411,063 ops/sec ±1.05% (97 runs sampled)
// large map with mutation x 125,044 ops/sec ±0.16% (96 runs sampled)
// Fastest is simple forEach x

// 2024-03-01: Tested on M1 MacBook Air 2020 (16GB RAM)
