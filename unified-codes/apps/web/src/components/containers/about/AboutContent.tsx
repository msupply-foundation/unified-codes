import * as React from 'react';

import { Container, Typography } from '@unified-codes/ui/components';

export const AboutContent = () => (
  <Container>
    <Container>
      <Typography variant="h4">Why?</Typography>
      We were reluctant to publish a Universal Code server of our own, as after all, we’ve read this
      cartoon: <br />
      <a href="https://xkcd.com/927/">https://xkcd.com/927/</a>
    </Container>
    <Container>
      However, to our (limited) knowledge none of the existing universal codes do what we needed
      them to do. Which is to:
      <ul>
        <li>Code items on their generic name, not their trade name (good-bye GTINs etc...)</li>
        <li>
          Code items based on their strength and dosage formulation (good-bye{' '}
          <a href="https://www.unspsc.org">https://www.unspsc.org</a>)
        </li>
        <li>
          Not include the pack size (good-bye{' '}
          <a href="http://www.upc-search.org">http://www.upc-search.org</a>) as we want to aggregate
          data across pack sizes
        </li>
        <li>Have a freely available API so that applications can obtain codes as needed.</li>
      </ul>
    </Container>
    <Container>
      <Typography variant="h4">How?</Typography>
      You can browse universal codes on this site, or use the API, details of which can be found
      through the <a href="https://github.com/openmsupply/unified-codes/wiki">GitHub wiki page</a>
    </Container>

    <Container>
      <Typography variant="h4">How much?</Typography>
      It’s free.
      <br />
      Please don’t abuse the service, or we will have to change this policy.
    </Container>

    <Container>
      <Typography variant="h4">Contact?</Typography>
      Feel free to email <a href="mailto:info@msupply.org.nz">info@msupply.org.nz </a>with
      suggestions or requests for additions or deletions
    </Container>

    <Container>
      <Typography variant="h4">Future plans?</Typography>
      The next major release that we have planned will include benchmark pricing information, which
      also includes further integration with mSupply.
    </Container>
  </Container>
);

export default AboutContent;
