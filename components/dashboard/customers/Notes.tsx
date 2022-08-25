import { ActionIcon, Grid, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { format, parseISO } from 'date-fns';
import { Trash } from 'tabler-icons-react';
import axios from 'axios';

import { Note } from '../../../types/types';

interface NotesProps {
  getCustomerNotes: () => Promise<void>;
  notes: Note[];
}

function Notes({ getCustomerNotes, notes }: NotesProps): JSX.Element {
  const deleteNote = (note_ref: string): void => {
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/customers/note/${note_ref}`).then(() => {
      getCustomerNotes();
    });
  };

  return (
    <>
      <Title className="text-xl" order={2}>
        Notes
      </Title>

      <Grid>
        {notes.map((note: Note) => (
          <Grid.Col span={4} key={note.ref_id}>
            <Paper className="max-h-60 overflow-y-auto p-4" radius="md" withBorder>
              <Group position="apart">
                <Stack spacing={4}>
                  <Text size="sm">{`${note.user.first_name} ${note.user.last_name}`}</Text>

                  <Text size="xs" color="dimmed">
                    {format(parseISO(note.created_at), 'MMMM do, yyyy')}
                  </Text>
                </Stack>

                <ActionIcon
                  className="mr-4 justify-end"
                  onClick={() => deleteNote(note.ref_id)}
                  color="red"
                  size="xs"
                  variant="transparent"
                >
                  <Trash className="h-5 w-5" />
                </ActionIcon>
              </Group>

              <Text size="sm" mt={12}>
                {note.note}
              </Text>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
}

export default Notes;
