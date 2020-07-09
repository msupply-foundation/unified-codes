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
        description: 'tablet (chewable)',
        has_child: [],
        type: 'form',
      },
      {
        description: 'tablet (scored)',
        has_child: [],
        type: 'form',
      },
      {
        description: 'tablet scored',
        has_child: [],
        type: 'form',
      },
      {
        description: 'tablet dispersible',
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
      {
        description: 'pre filled syringe',
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
      {
        description: 'lotion',
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
  {
    description: 'To the eye',
    type: 'form_category',
    has_child: [
      {
        description: 'eye drops solution',
        has_child: [],
        type: 'form',
      },
      {
        description: 'eye drops',
        has_child: [],
        type: 'form',
      },
    ],
  },
];

class Parser {
  regexp = /(.*)( \d+[^ ]+)/;
  itemsWithNoFormCount = 0;

  generateCode = () => {
    return 'ABCDEF';
  };

  renderProperty = (type, value) => ({
    value,
    type,
  });

  clone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };

  findForm = (item) => {
    for (let i = 0; i < formCategories.length; i++) {
      const category = formCategories[i];
      for (let j = 0; j < category.has_child.length; j++) {
        const form = category.has_child[j];
        const formDescription = form.description.replace('(', '\\x28').replace(')', '\\x29');
        const re = new RegExp(`${formDescription}$`, 'i');
        const itemName = item.name.trim();

        if (itemName.match(re)) {
          // return a copy of the form and category
          return { category: this.clone(category), form: this.clone(form) };
        }
      }
    }
    return undefined;
  };

  matchProduct = (item, parent) => {
    let product;
    const match = this.regexp.exec(item.name);
    if (!match) return product;
    if (!match[1]) return product;

    const { form, category } = parent || {};
    const productName = (match[1] || '').trim();
    const strength = (match[2] || '').trim();
    const node = this.transform(item);

    if (strength) {
      if (!node.has_property) {
        node.has_property = [];
      }
      node.has_property.push(this.renderProperty('strength', strength));
    }

    product = medicinalProducts.find((p) => p.description === productName);
    if (!product) {
      product = {
        code: this.generateCode(),
        description: productName,
        type: 'medicinal_product',
        has_child: [],
      };

      medicinalProducts.push(product);
    }

    if (parent) {
      let currentCategory = product.has_child.find((x) => x.description === category.description);
      if (!currentCategory) {
        currentCategory = category;
        product.has_child.push(currentCategory);
      }
      let currentForm = currentCategory.has_child.find((x) => x.description === form.description);
      if (!currentForm) {
        currentForm = form;
        currentCategory.has_child.push(currentForm);
      }
      currentForm.has_child.push(node);
      product.has_child.push(form);
    } else {
      product.has_child.push(node);
      this.itemsWithNoFormCount++;
      // console.info(`no form? product: ${item.name}`);
    }

    return product;
  };

  transform = (item) => ({
    description: item.name,
    code: item.code,
    type: 'unit_of_use',
  });

  parse = (items) => {
    const set = [];
    let itemsWithNoProductCount = 0;

    items.forEach((item) => {
      const form = this.findForm(item);
      const product = this.matchProduct(item, form);

      if (!product) {
        itemsWithNoProductCount++;
        set.push(this.transform(item));
      }
    });

    medicinalProducts.forEach((product) => set.push(product));

    const result = { set };

    console.info();
    console.info(` - Number of items with no product: ${itemsWithNoProductCount}`);
    console.info(` - Number of items with no form: ${this.itemsWithNoFormCount}`);
    console.info(` - Total number of items: ${items.length}`);
    console.info();

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
