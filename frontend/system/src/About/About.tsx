import * as React from 'react';
import { Container, Typography } from '@common/ui';

const About = () => (
  <Container>
    <Container>
      <Heading>Why?</Heading>
      We were reluctant to publish a Universal Code server of our own, as after
      all, we’ve read this cartoon: <br />
      <a href="https://xkcd.com/927/">https://xkcd.com/927/</a>
    </Container>
    <Container>
      However, to our (limited) knowledge none of the existing universal codes
      do what we needed them to do. Which is to:
      <ul>
        <li>
          Code items on their generic name, not their trade name (good-bye GTINs
          etc...)
        </li>
        <li>
          Code items based on their strength and dosage formulation (good-bye{' '}
          <a href="https://www.unspsc.org">https://www.unspsc.org</a>)
        </li>
        <li>
          Not include the pack size (good-bye{' '}
          <a href="http://www.upc-search.org">http://www.upc-search.org</a>) as
          we want to aggregate data across pack sizes
        </li>
        <li>
          Have a freely available API so that applications can obtain codes as
          needed.
        </li>
      </ul>
    </Container>
    <Container>
      <Heading>How?</Heading>
      You can browse universal codes on this site, or use the API, details of
      which can be found through the{' '}
      <a href="https://github.com/openmsupply/unified-codes/wiki">
        GitHub wiki page
      </a>
    </Container>

    <Container>
      <Heading>How much?</Heading>
      It’s free.
      <br />
      Please don’t abuse the service, or we will have to change this policy.
    </Container>

    <Container>
      <Heading>Contact?</Heading>
      Feel free to email{' '}
      <a href="mailto:info@msupply.org.nz">info@msupply.org.nz </a>with
      suggestions or requests for additions or deletions
    </Container>

    <Container>
      <Heading>Future plans?</Heading>
      The next major release that we have planned will include benchmark pricing
      information, which also includes further integration with mSupply.
    </Container>

    <Container>
      <b>Disclaimer: </b>This product uses publicly available data from the U.S.
      National Library of Medicine (NLM), National Institutes of Health,
      Department of Health and Human Services; NLM is not responsible for the
      product and does not endorse or recommend this or any other product.
    </Container>
  </Container>
);

export default About;

const Heading = ({ children }: React.PropsWithChildren) => {
  return (
    <Typography variant="h5" marginTop="20px">
      {children}
    </Typography>
  );
};
