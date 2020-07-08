const medicinalProducts = [];
const formCategories = [
  {
    description: 'oral',
    type: 'form_category',
    has_child: [
      {
        description: 'tablet',
        has_child: [],
        type: 'form',
      },
      {
        description: 'capsule',
        has_child: [],
        type: 'form',
      },
      {
        description: 'oral liquid',
        has_child: [],
        type: 'form',
      },
    ],
  },
  {
    description: 'injection',
    type: 'form_category',
    has_child: [
      {
        description: 'injection',
        has_child: [],
        type: 'form',
      },
    ],
  },
  {
    description: 'topical',
    type: 'form_category',
    has_child: [
      {
        description: 'ointment',
        has_child: [],
        type: 'form',
      },
      {
        description: 'cream',
        has_child: [],
        type: 'form',
      },
    ],
  },
  {
    description: 'rectal',
    type: 'form_category',
    has_child: [
      {
        description: 'suppository',
        has_child: [],
        type: 'form',
      },
    ],
  },
  {
    description: 'vaginal',
    type: 'form_category',
    has_child: [
      {
        description: 'pessary',
        type: 'form',
        has_child: [],
      },
    ],
  },
  {
    description: 'inhalation',
    type: 'form_category',
    has_child: [
      {
        description: 'inhalation (aerosol)',
        has_child: [],
        type: 'form',
      },
      {
        description: 'nasal spray',
        has_child: [],
        type: 'form',
      },
    ],
  },
];

class Parser {
  regexp = /(.*)(\d+[^ ]+)/;
  forms = [];
  constructor() {
    Object.values(formCategories).forEach((category) => this.forms.push(...category.has_child));
  }

  findForm = (item) => {
    for (let i = 0; i < this.forms.length; i++) {
      const form = this.forms[i];
      const re = new RegExp(`${form.description}$`);

      if (item.name.match(re)) {
        form.has_child.push(this.transform(item));
        return form;
      }
    }
    return undefined;
  };

  transform = (item) => ({
    description: item.name,
    code: item.code,
    type: 'unit_of_use',
  });

  parse = (items) => {
    const set = [];

    items.forEach((item) => {
      const form = this.findForm(item);

      if (!form) {
        set.push(this.transform(item));
      }
    });

    formCategories.forEach((category) => set.push(category));
    const result = { set };

    return result;
  };

  parseDirect = (items) => {
    items.forEach((item) => console.log(item));

    const set = items.map((item) => ({
      description: item.name,
      code: item.code,
      type: 'unit_of_use',
    }));

    const result = { set };

    return result;
  };
}

exports.parser = new Parser();
