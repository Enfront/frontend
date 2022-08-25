import { Anchor, Container, List, Stack, Text, Title } from '@mantine/core';

import PublicLayout from '../../components/layouts/PublicLayout';

function AcceptableUse(): JSX.Element {
  return (
    <PublicLayout
      pageTitle="Enfront - Acceptable Use"
      metaDescription="Enfront takes ecommerce to the next level by offering a vast amount of innovative tools designed
      to simplify, optimize, and accelerate the process."
    >
      <Container px="xs" py={112}>
        <Stack>
          <Title order={1}>Acceptable Use Policy</Title>

          <Text color="gray" weight={600}>
            This policy was last reviewed on 13 May 2022.
          </Text>

          <Text color="gray">
            This acceptable use policy covers the products, services, and technologies (collectively referred to as the
            &ldquo;Products&rdquo;) provided by Enfront under any ongoing agreement. It’s designed to protect us, our
            customers, and the general Internet community from unethical, irresponsible, and illegal activity.
          </Text>

          <Text color="gray">
            Enfront customers found engaging in activities prohibited by this acceptable use policy can be liable for
            service suspension and account termination. In extreme cases, we may be legally obliged to report such
            customers to the relevant authorities.
          </Text>

          <Title order={2} mt={32}>
            Fair use
          </Title>

          <Text color="gray">
            We provide our facilities with the assumption your use will be &ldquo;business as usual&rdquo;, as per our
            offer schedule. If your use is considered to be excessive, then additional fees may be charged, or capacity
            may be restricted.
          </Text>

          <Text color="gray">
            We are opposed to all forms of abuse, discrimination, rights infringement, and/or any action that harms or
            disadvantages any group, individual, or resource. We expect our customers and, where applicable, their users
            (&ldquo;end-users&rdquo;) to likewise engage our Products with similar intent.
          </Text>

          <Title order={2} mt={32}>
            Customer accountability
          </Title>

          <Text color="gray">
            We regard our customers as being responsible for their own actions as well as for the actions of anyone
            using our Products with the customer’s permission. This responsibility also applies to anyone using our
            Products on an unauthorized basis as a result of the customer’s failure to put in place reasonable security
            measures.
          </Text>

          <Text color="gray">
            By accepting Products from us, our customers agree to ensure adherence to this policy on behalf of anyone
            using the Products as their end users. Complaints regarding the actions of customers or their end-users will
            be forwarded to the nominated contact for the account in question.
          </Text>

          <Text color="gray">
            If a customer — or their end-user or anyone using our Products as a result of the customer — violates our
            acceptable use policy, we reserve the right to terminate any Products associated with the offending account
            or the account itself or take any remedial or preventative action we deem appropriate, without notice. To
            the extent permitted by law, no credit will be available for interruptions of service resulting from any
            violation of our acceptable use policy.
          </Text>

          <Title order={2} mt={32}>
            Prohibited activity
          </Title>

          <Title order={3} mt={24}>
            Copyright infringement and access to unauthorized material
          </Title>

          <Text color="gray">
            Our Products must not be used to transmit, distribute or store any material in violation of any applicable
            law. This includes but isn’t limited to:
          </Text>

          <List spacing="md" withPadding>
            <List.Item>
              <Text color="gray" component="span">
                any material protected by copyright, trademark, trade secret, or other intellectual property right used
                without proper authorization, and
              </Text>
            </List.Item>

            <List.Item>
              <Text color="gray" component="span">
                any material that is obscene, defamatory, constitutes an illegal threat or violates export control laws.
              </Text>
            </List.Item>
          </List>

          <Text color="gray">
            The customer is solely responsible for all material they input, upload, disseminate, transmit, create or
            publish through or on our Products, and for obtaining legal permission to use any works included in such
            material.
          </Text>

          <Title order={3} mt={24}>
            SPAM and unauthorized message activity
          </Title>

          <Text color="gray">
            Our Products must not be used for the purpose of sending unsolicited bulk or commercial messages in
            violation of the laws and regulations applicable to your jurisdiction (“spam”). This includes but isn’t
            limited to sending spam, soliciting customers from spam sent from other service providers, and collecting
            replies to spam sent from other service providers.
          </Text>

          <Text color="gray">
            Our Products must not be used for the purpose of running unconfirmed mailing lists or telephone number lists
            (&ldquo;messaging lists&rdquo;). This includes but isn’t limited to subscribing email addresses or telephone
            numbers to any messaging list without the permission of the email address or telephone number owner, and
            storing any email addresses or telephone numbers subscribed in this way. All messaging lists run on or
            hosted by our Products must be &ldquo;confirmed opt-in&rdquo;. Verification of the address or telephone
            number owner’s express permission must be available for the lifespan of the messaging list.
          </Text>

          <Text color="gray">
            We prohibit the use of email lists, telephone number lists or databases purchased from third parties
            intended for spam or unconfirmed messaging list purposes on our Products.
          </Text>

          <Text color="gray">
            This spam and unauthorized message activity policy applies to messages sent using our Products, or to
            messages sent from any network by the customer or any person on the customer’s behalf, that directly or
            indirectly refer the recipient to a site hosted via our Products.
          </Text>

          <Title order={3} mt={24}>
            Unethical, exploitative, and malicious activity
          </Title>

          <Text color="gray">
            Our Products must not be used for the purpose of advertising, transmitting, or otherwise making available
            any software, program, product, or service designed to violate this acceptable use policy, or the acceptable
            use policy of other service providers. This includes but isn’t limited to facilitating the means to send
            spam and the initiation of network sniffing, pinging, packet spoofing, flooding, mail-bombing, and
            denial-of-service attacks.
          </Text>

          <Text color="gray">
            Our Products must not be used to access any account or electronic resource where the group or individual
            attempting to gain access does not own or is not authorized to access the resource (e.g.
            &ldquo;hacking&rdquo;, &ldquo;cracking&rdquo;, &ldquo;phreaking&rdquo;, etc.).
          </Text>

          <Text color="gray">
            Our Products must not be used for the purpose of intentionally or recklessly introducing viruses or
            malicious code into our Products and systems.
          </Text>

          <Text color="gray">
            Our Products must not be used for purposely engaging in activities designed to harass another group or
            individual. Our definition of harassment includes but is not limited to denial-of-service attacks,
            hate-speech, advocacy of racial or ethnic intolerance, and any activity intended to threaten, abuse,
            infringe upon the rights of, or discriminate against any group or individual.
          </Text>

          <Text color="gray">Other activities considered unethical, exploitative, and malicious include:</Text>

          <List spacing="md" withPadding>
            <List.Item>
              <Text color="gray" component="span">
                Obtaining (or attempting to obtain) services from us with the intent to avoid payment;
              </Text>
            </List.Item>

            <List.Item>
              <Text color="gray" component="span">
                Using our facilities to obtain (or attempt to obtain) services from another provider with the intent to
                avoid payment;
              </Text>
            </List.Item>

            <List.Item>
              <Text color="gray" component="span">
                The unauthorized access, alteration, or destruction (or any attempt thereof) of any information about
                our customers or end-users, by any means or device;
              </Text>
            </List.Item>

            <List.Item>
              <Text color="gray" component="span">
                Using our facilities to interfere with the use of our facilities and network by other customers or
                authorized individuals;
              </Text>
            </List.Item>

            <List.Item>
              <Text color="gray" component="span">
                Publishing or transmitting any content of links that incite violence, depict a violent act, depict child
                pornography, or threaten anyone’s health and safety;
              </Text>
            </List.Item>

            <List.Item>
              <Text color="gray" component="span">
                Any act or omission in violation of consumer protection laws and regulations;
              </Text>
            </List.Item>

            <List.Item>
              <Text color="gray" component="span">
                Any violation of a person’s privacy.
              </Text>
            </List.Item>
          </List>

          <Text color="gray">
            Our Products may not be used by any person or entity, which is involved with or suspected of involvement in
            activities or causes relating to illegal gambling; terrorism; narcotics trafficking; arms trafficking or the
            proliferation, development, design, manufacture, production, stockpiling, or use of nuclear, chemical or
            biological weapons, weapons of mass destruction, or missiles; in each case including any affiliation with
            others whatsoever who support the above such activities or causes.
          </Text>

          <Title order={3} mt={24}>
            Unauthorized use of Enfront property
          </Title>

          <Text color="gray">
            We prohibit the impersonation of Enfront, the representation of a significant business relationship with
            Enfront, or ownership of any Enfront property (including our Products and brand) for the purpose of
            fraudulently gaining service, custom, patronage, or user trust.
          </Text>

          <Title order={2} mt={32}>
            About this policy
          </Title>

          <Text color="gray">
            This policy outlines a non-exclusive list of activities and intent we deem unacceptable and incompatible
            with our brand.
          </Text>

          <Text color="gray">
            We reserve the right to modify this policy at any time by publishing the revised version on our website. The
            revised version will be effective from the earlier of:
          </Text>

          <List spacing="md" withPadding>
            <List.Item>
              <Text color="gray" component="span">
                the date the customer uses our Products after we publish the revised version on our website; or
              </Text>
            </List.Item>

            <List.Item>
              <Text color="gray" component="span">
                30 days after we publish the revised version on our website.
              </Text>
            </List.Item>
          </List>

          <Title order={2} mt={32}>
            Contact Us
          </Title>

          <Text color="gray">
            For any reports of copyright infringement or a breach of this acceptable use policy please contact us at:
            <Anchor href="mailto:abuse@enfront.io">abuse@enfront.io</Anchor>
          </Text>

          <Text color="gray">
            For all other inquiries please contact us at:{' '}
            <Anchor href="mailto:support@enfront.io">support@enfront.io</Anchor>
          </Text>
        </Stack>
      </Container>
    </PublicLayout>
  );
}

export default AcceptableUse;
