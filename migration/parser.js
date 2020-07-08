const medicinalProducts = [];
const formCategories = [
  {
    description: 'oral',
    type: 'form_category',
  },
  {
    description: 'injection',
    type: 'form_category',
  },
  {
    description: 'topical',
    type: 'form_category',
  },
  {
    description: 'rectal',
    type: 'form_category',
  },
  {
    description: 'vaginal',
    type: 'form_category',
  },
  {
    description: 'inhalation',
    type: 'form_category',
  },
];
const forms = [
  {
    description: 'tablet',
    parent: 'oral',
    type: 'form',
  },
  {
    description: 'capsule',
    parent: 'oral',
    type: 'form',
  },
  {
    description: 'oral liquid',
    parent: 'oral',
    type: 'form',
  },
  {
    description: 'injection',
    parent: 'injection',
    type: 'form',
  },
  {
    description: 'ointment',
    parent: 'topical',
    type: 'form',
  },
  {
    description: 'suppository',
    parent: 'rectal',
    type: 'form',
  },
];

exports.parse = (items) => {
  items.forEach((item) => console.log(item));

  const set = items.map((item) => ({
    description: item.name,
    code: item.code,
    type: 'unit_of_use',
  }));

  const result = { set };

  return result;
};

exports.parseDirect = (items) => {
  items.forEach((item) => console.log(item));

  const set = items.map((item) => ({
    description: item.name,
    code: item.code,
    type: 'unit_of_use',
  }));

  const result = { set };

  return result;
};
