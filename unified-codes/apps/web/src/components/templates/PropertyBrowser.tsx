import * as React from 'react';
import { useParams } from 'react-router-dom';
import { IEntity } from 'libs/data/src/lib';
import { useState, useEffect } from 'react';

export type PropertyBrowser = React.FunctionComponent;

export const PropertyBrowser : PropertyBrowser = () => {
  const { code } = useParams();
  const url = `${process.env.NX_DATA_SERVICE_URL}:${process.env.NX_DATA_SERVICE_PORT}/${process.env.NX_DATA_SERVICE_GRAPHQL}`;;  
  const [entity, setEntity] = useState<IEntity>();

  useEffect(() => {
    getEntity(url)
  }, []);

  // TODO: Recurse on has_property and has_child to go deeper/wider in hierarchy
  const getEntityQuery = (code: string) => `
  {
    entity (code: "${code}") {
      code
      description
      type
      has_property {
        type
        value
      }
      has_child {
        code
        description
        type
      }
    }
  }`;

  const getEntity = async (url: string) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: getEntityQuery(code),
      }),
    });
    const json = await response.json();
    const { data } = json;
    const { entity } = data;
  
    setEntity(entity);
  };

// TODO: Create UI components and format this properly
return <div>{JSON.stringify(entity)}</div>;
}

export default PropertyBrowser;