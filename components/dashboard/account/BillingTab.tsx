import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';

import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { Calendar, CircleCheck, CircleX, FileInvoice, Receipt2 } from 'tabler-icons-react';
import { getSymbolWithIsoCode } from 'jkshop-country-list/dist/countryFinder';
import axios, { AxiosResponse } from 'axios';
import { format, fromUnixTime } from 'date-fns';

import useShop from '../../../contexts/ShopContext';
import useAuth from '../../../contexts/AuthContext';
import { StatsCard, SubscriptionDetails, SubscriptionTier } from '../../../types/types';

function BillingTab(): JSX.Element {
  const theme = useMantineTheme();
  const modals = useModals();

  const { getUserShops, selectedShop } = useShop();
  const { userDetails } = useAuth();

  const [currentTierId, setCurrentTierId] = useState<number>(selectedShop.owner.subscription_tier);
  const [patchPending, setPatchPending] = useState<boolean>(false);

  const [stats, setStats] = useState<StatsCard[]>([
    {
      id: 1,
      name: 'Current Monthly Fees',
      stat: '$0.00',
      icon: (
        <Box sx={{ color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4] }}>
          <Receipt2 size={24} />
        </Box>
      ),
    },
    {
      id: 2,
      name: 'Next Payment Due',
      stat: '$0.00',
      icon: (
        <Box sx={{ color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4] }}>
          <FileInvoice size={24} />
        </Box>
      ),
    },
    {
      id: 3,
      name: 'Next Payment Due Date',
      stat: 'N/A',
      icon: (
        <Box sx={{ color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4] }}>
          <Calendar size={24} />
        </Box>
      ),
    },
  ]);

  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails>({
    total_fees: 0,
    cancel_at_period_end: false,
    current_period_end: 0,
    subscription_id: '',
    ref_id: '',
  });

  const tiers: SubscriptionTier[] = [
    {
      id: 0,
      name: 'Starter',
      plan_id: '',
      priceMonthly: 0.0,
      description: 'All the basics for starting a new business.',
      includedFeatures: ['1 shop', '3 products', 'Unlimited orders', 'Unlimited blacklist items', '3.2% PayPal Fees'],
      notIncludedFeatures: ['No Team Members (WIP)'],
    },
    {
      id: 1,
      name: 'Basic',
      plan_id: 'prod_ME9suAR3Qq4Jsd',
      priceMonthly: 14.99,
      description: "When starter just isn't enough.",
      includedFeatures: [
        '3 shops',
        '3 team members (WIP)',
        'Unlimited products',
        'Unlimited orders',
        'Unlimited blacklist items',
        '0% PayPal fees',
        '2% fees',
      ],
      notIncludedFeatures: [],
    },
    {
      id: 2,
      name: 'Business',
      plan_id: 'prod_ME9saqIeGYzFtD',
      priceMonthly: 24.99,
      description: 'Tools for an established business.',
      includedFeatures: [
        '5 shops',
        '15 team members (WIP)',
        'Unlimited products',
        'Unlimited orders',
        'Unlimited blacklist items',
        '0% PayPal fees',
        '1% fees',
      ],
      notIncludedFeatures: [],
    },
    {
      id: 3,
      name: 'Enterprise',
      plan_id: 'prod_ME9tCBAuzBzKpO',
      priceMonthly: 54.99,
      description: "You've reached the highest level of success.",
      includedFeatures: [
        'Unlimited shops',
        'Unlimited products',
        'Unlimited team members (WIP)',
        'Unlimited orders',
        'Unlimited blacklist items',
        '0% PayPal fees',
        '0.5% fees',
      ],
      notIncludedFeatures: [],
    },
  ];

  const createSubscription = async (planId: string): Promise<void> => {
    setPatchPending(true);

    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/stripe`, {
        plan_id: planId,
        user_ref: userDetails.ref_id,
      })
      .then((response: AxiosResponse) => {
        const newWindow = window.open(response.data.data.checkout_url, '_self', 'noopener, noreferrer');
        if (newWindow) newWindow.opener = null;
        setPatchPending(false);
      });
  };

  const patchSubscription = async (
    planId: number,
    planIdString: string,
    prorationDate?: number,
    acceptProration = false,
    reinstate = false,
  ): Promise<void> => {
    setPatchPending(true);

    await axios
      .patch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/stripe`, {
        plan_id: planIdString,
        user_ref: userDetails.ref_id,
        accept_proration: acceptProration,
        proration_date: prorationDate,
        is_upgrade: currentTierId < planId,
        reinstate,
      })
      .then((response: AxiosResponse) => {
        if (response.status === 202) {
          confirmProration(
            response.data.data.proration_amount,
            response.data.data.proration_date,
            response.data.data.last4,
            planId,
            planIdString,
          );
        } else {
          setTimeout(() => {
            getUserShops();
            getSubscriptionDetails();

            showNotification({
              title: 'Subscription Modified!',
              message: 'Thank you for your business!',
              color: 'green',
            });

            setPatchPending(false);
          }, 3000);
        }
      });
  };

  const confirmProration = (
    prorationAmount: number,
    prorationDate: number,
    last4: number,
    planId: number,
    planIdString: string,
  ): void => {
    modals.openConfirmModal({
      title: 'Confirm Proration',
      centered: true,
      children: (
        <>
          <Text size="sm">
            Since you are upgrading your subscription, you will be charged a prorated amount for the remainder of this
            month.
          </Text>

          <Space h="sm" />

          <Text size="sm">
            The following amount will be immediately be charged to your payment method ending in {last4}:{' '}
            <Text component="span" size="sm" weight={600}>
              {getSymbolWithIsoCode(selectedShop.currency)}
              {(prorationAmount / 100).toFixed(2)}
            </Text>
            .
          </Text>

          <Space h="sm" />

          <Text size="sm">
            At the start of the next billing cycle you will be charged for the new plan at a rate of{' '}
            {getSymbolWithIsoCode(selectedShop.currency)}
            {tiers.filter((tier: SubscriptionTier) => tier.id === planId)[0].priceMonthly}.
          </Text>
        </>
      ),
      labels: { confirm: 'Approve Charges', cancel: 'Keep Existing Subscription' },
      onConfirm: () => patchSubscription(planId, planIdString, prorationDate, true),
      onCancel: () => setPatchPending(false),
    });
  };

  const reinstateSubscription = (): void => {
    modals.openConfirmModal({
      title: 'Reinstate Subscription',
      centered: true,
      children: (
        <Text size="sm">
          Your subscription was recently canceled. Following through with this action will reinstate your subscription.
          By clicking confirm you consent to be charged the monthly subscription fee of{' '}
          {getSymbolWithIsoCode(selectedShop.currency)}
          {tiers[currentTierId].priceMonthly.toFixed(2)} at the beginning of your next billing cycle.
        </Text>
      ),
      labels: { confirm: 'Reinstate Subscription', cancel: 'Close' },
      confirmProps: { color: 'red' },
      onConfirm: () => patchSubscription(0, '', 0, false, true),
    });
  };

  const confirmCancellation = (): void => {
    modals.openConfirmModal({
      title: 'Cancel Subscription',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to cancel your subscription? Any shops you have that will exceed your new limits will be
          closed. You have until {format(fromUnixTime(subscriptionDetails.current_period_end), 'MMMM do, yyyy')} to make
          any arrangements.
        </Text>
      ),
      labels: { confirm: 'Cancel Subscription', cancel: 'Keep Subscription' },
      confirmProps: { color: 'red' },
      onConfirm: () => cancelSubscription(),
    });
  };

  const cancelSubscription = async (): Promise<void> => {
    setPatchPending(true);

    await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/stripe/${subscriptionDetails.subscription_id}`)
      .then((response: AxiosResponse) => {
        if (response.status === 204) {
          setTimeout(() => {
            getSubscriptionDetails();

            showNotification({
              title: 'Subscription cancelled!',
              message: 'We hope you enjoyed your experience with us!',
              color: 'green',
            });

            setPatchPending(false);
          }, 3000);
        } else {
          showNotification({
            title: 'Uh oh!',
            message: 'There was an issue canceling your subscription.',
            color: 'red',
          });
        }
      });
  };

  const getSubscriptionDetails = async (): Promise<void> => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/${userDetails.ref_id}/${selectedShop.ref_id}`)
      .then((response: AxiosResponse) => {
        if (response.status !== 204) {
          setSubscriptionDetails(response.data.data);

          setStats([
            {
              id: 1,
              name: 'Current Monthly Fees',
              stat: `$${(response.data.data.total_fees / 100).toFixed(2)}`,
              icon: (
                <Box sx={{ color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4] }}>
                  <Receipt2 size={24} />
                </Box>
              ),
            },
            {
              id: 2,
              name: 'Next Payment Due',
              stat:
                response.data.data.current_period_end && !response.data.data.cancel_at_period_end
                  ? `$${tiers[selectedShop.owner.subscription_tier].priceMonthly.toFixed(2)}`
                  : '$0.00',
              icon: (
                <Box sx={{ color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4] }}>
                  <FileInvoice size={24} />
                </Box>
              ),
            },
            {
              id: 3,
              name: 'Next Payment Due Date',
              stat:
                response.data.data.current_period_end && !response.data.data.cancel_at_period_end
                  ? format(fromUnixTime(response.data.data.current_period_end), 'MMMM do, yyyy')
                  : 'N/A',
              icon: (
                <Box sx={{ color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4] }}>
                  <Calendar size={24} />
                </Box>
              ),
            },
          ]);
        }
      });
  };

  useEffect(() => {
    getSubscriptionDetails();
    setCurrentTierId(selectedShop.owner.subscription_tier);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShop, selectedShop.owner.subscription_tier]);

  return (
    <>
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 },
        ]}
        mt={24}
      >
        {stats.map((item: StatsCard) => (
          <Paper p="md" radius="md" key={item.id} withBorder>
            <Group position="apart">
              <Text className="font-bold" size="sm" color="dimmed">
                {item.name}
              </Text>

              {item.icon}
            </Group>

            <Group align="flex-end" spacing="xs" mt={18}>
              <Text className="text-xl font-bold">{item.stat}</Text>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>

      <Title order={3} mt={36}>
        Current Plan
      </Title>

      <Paper radius="md" mt={12} mb={36} withBorder>
        <Stack>
          <Group
            className="rounded rounded-b-none p-3"
            position="apart"
            sx={{ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1] }}
          >
            <Text size="sm" weight={600}>
              Enfront {tiers[currentTierId].name} Plan
            </Text>

            {currentTierId !== 0 && !subscriptionDetails.cancel_at_period_end && (
              <Button onClick={confirmCancellation} loading={patchPending} variant="subtle">
                Cancel Subscription
              </Button>
            )}

            {currentTierId !== 0 && subscriptionDetails.cancel_at_period_end && (
              <Button onClick={reinstateSubscription} loading={patchPending} color="red" variant="subtle" size="sm">
                Ends on {format(fromUnixTime(subscriptionDetails.current_period_end), 'MMMM do, yyyy')}
              </Button>
            )}
          </Group>

          <SimpleGrid className="p-3 pt-0" cols={3}>
            {tiers[currentTierId].includedFeatures.map((feature: string) => (
              <Group align="center" key={feature}>
                <CircleCheck className="text-green-500" size={21} />
                <Text color="gray" size="sm">
                  {feature}
                </Text>
              </Group>
            ))}

            {tiers[currentTierId].notIncludedFeatures.map((feature: string) => (
              <Group align="center" key={feature}>
                <CircleX className="text-red-500" size={21} />
                <Text color="gray" size="sm">
                  {feature}
                </Text>
              </Group>
            ))}
          </SimpleGrid>
        </Stack>
      </Paper>

      <Divider />

      <Title order={3} mt={36}>
        Upgrade Plan
      </Title>

      <SimpleGrid cols={3} mt={12}>
        {tiers
          .filter((tier: SubscriptionTier) => tier.id !== currentTierId)
          .map((tier: SubscriptionTier) => (
            <Paper p="md" radius="md" key={tier.id} withBorder>
              <div className="p-6 pb-0">
                <Title className="leading-6" order={4}>
                  {tier.name}
                </Title>

                <Text color="gray" size="sm" mt={4}>
                  {tier.description}
                </Text>

                <Group align="baseline" spacing="xs" mt={12}>
                  <Text className="text-4xl font-extrabold">${tier.priceMonthly}</Text> <Text color="gray">/mo</Text>
                </Group>

                {tier.id === 0 && (
                  <Button
                    onClick={confirmCancellation}
                    variant="outline"
                    loading={patchPending}
                    disabled={subscriptionDetails.cancel_at_period_end}
                    mt={24}
                    fullWidth
                  >
                    Cancel Subscription
                  </Button>
                )}

                {tier.id !== 0 && currentTierId !== 0 && (
                  <Button
                    onClick={() => patchSubscription(tier.id, tier.plan_id)}
                    variant={currentTierId < tier.id ? 'filled' : 'outline'}
                    loading={patchPending}
                    disabled={subscriptionDetails.cancel_at_period_end}
                    mt={24}
                    fullWidth
                  >
                    {currentTierId > tier.id ? <>Downgrade to {tier.name}</> : <>Upgrade to {tier.name}</>}
                  </Button>
                )}

                {tier.id !== 0 && currentTierId === 0 && (
                  <Button
                    onClick={() => createSubscription(tier.plan_id)}
                    variant="filled"
                    loading={patchPending}
                    disabled={subscriptionDetails.cancel_at_period_end}
                    mt={24}
                    fullWidth
                  >
                    Upgrade to {tier.name}
                  </Button>
                )}
              </div>

              <Stack mt={24} px={24} pb={32}>
                <Text size="xs" transform="uppercase">
                  What&apos;s included
                </Text>

                <Stack>
                  {tier.includedFeatures.map((feature) => (
                    <Group spacing="xs" key={feature}>
                      <CircleCheck className="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
                      <Text color="gray" size="xs">
                        {feature}
                      </Text>
                    </Group>
                  ))}

                  {tier.notIncludedFeatures.map((feature) => (
                    <Group spacing="xs" key={feature}>
                      <CircleX className="h-5 w-5 flex-shrink-0 text-red-500" aria-hidden="true" />
                      <Text color="gray" size="xs">
                        {feature}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          ))}
      </SimpleGrid>
    </>
  );
}

export default BillingTab;
