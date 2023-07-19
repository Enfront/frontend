import { Group, Paper, Text } from '@mantine/core';

import { StatsCard } from '&/types/types';

interface QuickStatsProps {
  stats: StatsCard;
}

function QuickStats({ stats }: QuickStatsProps): JSX.Element {
  return (
    <Paper withBorder p="md" radius="md" key={stats.id}>
      <Group position="apart" noWrap>
        <Text className="font-bold" size="sm" color="dimmed" lineClamp={1}>
          {stats.name}
        </Text>

        {stats.icon}
      </Group>

      <Group align="flex-end" spacing="xs" mt={25}>
        <Text className="text-2xl font-bold">{stats.stat}</Text>
      </Group>
    </Paper>
  );
}

export default QuickStats;
