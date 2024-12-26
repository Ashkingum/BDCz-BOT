const PERIODIC_OPTIONS = {
  front: [
    { label: '30m', value: '30m' },
    { label: '1h', value: '1h' },
    { label: '6h', value: '6h' },
    { label: '12h', value: '12h' },
    { label: '1D', value: '1d' }
  ],
  back: [
    { label: '1M', value: '1m' },
    { label: '3M', value: '3m' },
    { label: '6M', value: '6m' },
    { label: '1Y', value: '1y' },
    { label: '♾', value: 'infinite' }
  ]
};

module.exports = { PERIODIC_OPTIONS };