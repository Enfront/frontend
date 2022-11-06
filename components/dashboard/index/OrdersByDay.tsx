import { Paper, Title } from '@mantine/core';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface OrdersByDayProps {
  data: { date: string; orders: number }[];
}

function OrdersByDay({ data }: OrdersByDayProps): JSX.Element {
  return (
    <Paper p="md" radius="md" withBorder>
      <Title className="text-lg" order={2} mb={16}>
        Orders by Day
      </Title>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: -22,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="1 3" />
          <XAxis dataKey="date" tick={{ fontSize: 14 }} tickMargin={12} tickLine={false} />
          <YAxis
            dataKey="orders"
            tick={{ fontSize: 14 }}
            tickMargin={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip />
          <Area type="monotone" dataKey="orders" stroke="#228be6" fill="#4DABF7" />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default OrdersByDay;
