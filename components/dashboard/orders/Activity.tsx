import { ActionIcon, Button, Group, ScrollArea, Text, Textarea, Timeline } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useModals } from '@mantine/modals';
import { InfoCircle, Message, Trash } from 'tabler-icons-react';
import { format, parseISO } from 'date-fns';
import axios from 'axios';

import {
  CommentFormData,
  Order,
  OrderComment,
  OrderStatus,
  OrderStatusItemKey,
  OrderStatusItem,
} from '../../../types/types';

interface OrderActivityProps {
  getOrderInfo: () => Promise<void>;
  orderId: string | string[] | undefined;
  viewedOrder: Order;
}

function Activity({ getOrderInfo, orderId, viewedOrder }: OrderActivityProps): JSX.Element {
  const modals = useModals();

  const form = useForm({
    initialValues: {
      comment: '',
    },
  });

  const openDeleteCommentModal = (commentId: string): void => {
    modals.openConfirmModal({
      title: 'Delete Comment',
      children: (
        <Text size="sm">
          Are you sure you want to delete your comment? This will remove your comment from the order activity meaning no
          one will be able to see it again.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteComment(commentId),
    });
  };

  const deleteComment = async (deleteCommentId: string): Promise<void> => {
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/orders/comments/${deleteCommentId}`).then(() => {
      form.reset();
      getOrderInfo();
    });
  };

  const submitComment = async (data: CommentFormData): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append('comment', data.comment);

    if (orderId) {
      formData.append('order', orderId.toString());
    }

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders/comments`, formData).then(() => {
      form.reset();
      getOrderInfo();
    });
  };

  const getItemStatusText = (status: number): string => {
    switch (status) {
      case -1:
        return 'Canceled';
      case 0:
        return 'Waiting for Payment';
      case 1:
        return 'Sent';
      case 2:
        return 'Delivered';
      default:
        return 'Unknown';
    }
  };

  const getOrderStatusText = (status: number): string => {
    switch (status) {
      case -6:
        return 'Chargeback Won';
      case -5:
        return 'Chargeback Lost';
      case -4:
        return 'Chargeback Pending';
      case -3:
        return 'Order Refunded';
      case -2:
        return 'Payment Has Been Canceled, Denied, or Voided';
      case -1:
        return 'Order Canceled - Due to No Payment';
      case 0:
        return 'Waiting for Payment';
      case 1:
        return 'Payment Confirmed';
      case 2:
        return 'Order In Progress';
      case 3:
        return 'Order Complete';
      default:
        return 'Unknown';
    }
  };

  const getStatusTitles = (status: OrderStatus | OrderComment): JSX.Element => {
    if ('comment' in status && status.comment) {
      return (
        <Group position="apart" grow>
          <span className="font-medium">
            {status.user.first_name} {status.user.last_name}
          </span>

          <ActionIcon
            className="mr-4 justify-end"
            onClick={() => openDeleteCommentModal(status.ref_id)}
            color="red"
            size="xs"
            variant="transparent"
          >
            <Trash className="h-5 w-5" />
          </ActionIcon>
        </Group>
      );
    }

    if ('item' in status && status.item) {
      return (
        <>
          {getItemStatusText(status.status)} - {status.item.name}
        </>
      );
    }

    return <>{getOrderStatusText('status' in status ? status.status : -99)}</>;
  };

  const getStatusKeys = (items: OrderStatusItem): JSX.Element[] => {
    return items.key.map((key: OrderStatusItemKey) => {
      return <span key={key.key}>Key: {key.key}</span>;
    });
  };

  const getBulletIcon = (status: OrderStatus | OrderComment): JSX.Element => {
    if ('comment' in status && status.comment) {
      return <Message />;
    }

    return <InfoCircle />;
  };

  return (
    <>
      <ScrollArea className="h-[35rem]" offsetScrollbars>
        <Timeline active={-1} bulletSize={40} lineWidth={2}>
          {viewedOrder.statuses.map((status: OrderStatus | OrderComment) => (
            <Timeline.Item
              className="pb-6 pl-8"
              bullet={getBulletIcon(status)}
              title={getStatusTitles(status)}
              key={status.created_at}
            >
              <Text color="dimmed" size="xs">
                Created {format(parseISO(status.created_at), 'MMMM do, yyyy H:mma')}
              </Text>

              <Text size="sm" mt={8}>
                {'comment' in status && status.comment && <>{status.comment}</>}
                {'item' in status && status.item && <>{getStatusKeys(status.item)}</>}
              </Text>
            </Timeline.Item>
          ))}
        </Timeline>
      </ScrollArea>

      <form onSubmit={form.onSubmit((values: CommentFormData) => submitComment(values))}>
        <Textarea placeholder="Your comment" label="Leave a Comment" {...form.getInputProps('comment')} />

        <Group position="right" mt={8}>
          <Button disabled={form.values.comment === ''} type="submit">
            Comment
          </Button>
        </Group>
      </form>
    </>
  );
}

export default Activity;
